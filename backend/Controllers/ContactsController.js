import User from "../Models/UserModel.js";
import { cloudinaryUpload } from "../Utils/Cloudinary.js";
import fs from "fs";
import getPublicIdFromUrl from "../Utils/getPublicIdFromUrl.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import twilio from "twilio";
import nodemailer from "nodemailer";

// Enhanced Twilio client with WhatsApp support
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_ACCOUNT_SID.startsWith('AC'))
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const isEmailEnabled = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

// Audit log function for emergency events
const logEmergencyEvent = async (userId, eventType, details) => {
  try {
    const auditEntry = {
      userId,
      eventType, // 'sos_triggered', 'sms_sent', 'whatsapp_sent', 'location_shared'
      details,
      timestamp: new Date(),
      ipAddress: null, // Would be populated from request in production
    };

    // In a real app, you'd save this to a separate audit collection
    console.log('AUDIT LOG:', auditEntry);
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

const AddContact = async (req, res) => {
  const { MobileNo, email, name, userId } = req.body;

  console.log("AddContact request received:", { MobileNo, email, name, userId, hasFile: !!req.file });

  if (!MobileNo || !name || !userId) {
    console.warn("Missing required fields:", { MobileNo, email, name, userId });
    return res.status(400).json({ message: "Please enter all required fields (name, contact number, userId)" });
  }

  let photo;

  try {

    if (req.file) {
      console.log("Received file:", req.file);

      try {
        photo = await cloudinaryUpload(req.file.path);
        console.log("Uploaded photo URL:", photo);
      } catch (cloudinaryError) {
        console.warn("Cloudinary upload failed, using placeholder:", cloudinaryError.message);
        photo = "https://via.placeholder.com/150?text=" + encodeURIComponent(name);
      }

      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });
    } else {
      console.warn("No file provided, using default photo.");
      photo = "https://via.placeholder.com/150?text=" + encodeURIComponent(name);
    }


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          contacts: { user: userId, photo, name, MobileNo, email },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    const newContact = updatedUser.contacts[updatedUser.contacts.length - 1];
    console.log("Contact added successfully:", newContact);

    res.status(201).json({
      message: "Contact added successfully",
      contact: newContact,
    });

  } catch (error) {
    console.error("Error in AddContact:", error);
    res.status(500).json({ 
      message: "An error occurred while adding contact",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

const DeleteContact = async (req, res) => {
  const { userId, contactId } = req.query;

  if (!userId || !contactId) {
    return res.status(400).json({ message: "User ID and Contact ID are required" });
  }

  try {

    const user = await User.findById(userId)

    const ContactToDelete = await user.contacts.find((contact) => contact._id.toString() === contactId)

    if (!ContactToDelete) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (ContactToDelete.photo) {
      try {

        const publicId = getPublicIdFromUrl(ContactToDelete.photo);
        const status = await cloudinary.uploader.destroy(publicId);
        console.log("deleted Successfully", status)
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);

      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { contacts: { _id: contactId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully", user: updatedUser });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "An error occurred while deleting the contact" });
  }
};

const SendEmergencyInfo = async (req, res) => {
  try {
    const { contactNumbers = [], contactEmails = [], location, userId, messageType = 'both' } = req.body;
    console.log('Emergency alert triggered:', { contactNumbers, contactEmails, location, userId, messageType });

    // Validate required fields
    if ((!contactNumbers || contactNumbers.length === 0) && (!contactEmails || contactEmails.length === 0)) {
      return res.status(400).json({
        message: "At least one emergency contact number or email is required"
      });
    }

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        message: "Location is required"
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    // Log SOS trigger
    await logEmergencyEvent(userId, 'sos_triggered', {
      contactCount: contactNumbers.length,
      location: location,
      messageType
    });

    // Create Google Maps link with user's preferred format
    const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

    // Create emergency messages
    const smsMessage = `🚨 EMERGENCY ALERT! 🚨\n\nI need help immediately!\nLocation: ${mapsLink}\n\nPlease respond urgently.`;
    const whatsappMessage = `🚨 *EMERGENCY ALERT* 🚨\n\nI need help immediately!\n📍 Location: ${mapsLink}\n\nPlease respond urgently.`;

    const results = [];

    // Process each contact number
    for (const number of contactNumbers) {
      const cleanNumber = number.replace(/\D/g, '');

      if (!cleanNumber) {
        results.push({
          number,
          status: 'failed',
          error: 'Invalid phone number format'
        });
        continue;
      }

      const contactResult = { number, sms: null, whatsapp: null };

      // Send SMS if Twilio is configured and SMS is requested
      if (twilioClient && process.env.TWILIO_FROM_NUMBER && (messageType === 'both' || messageType === 'sms')) {
        try {
          const smsResponse = await twilioClient.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_FROM_NUMBER,
            to: cleanNumber
          });

          contactResult.sms = {
            status: 'success',
            messageId: smsResponse.sid,
            provider: 'twilio'
          };

          await logEmergencyEvent(userId, 'sms_sent', {
            to: number,
            messageId: smsResponse.sid,
            location: location
          });

        } catch (error) {
          console.error(`SMS error sending to ${number}:`, error);
          contactResult.sms = {
            status: 'failed',
            error: error.message,
            provider: 'twilio'
          };
        }
      }

      // Send WhatsApp if configured and WhatsApp is requested
      if (twilioClient && process.env.TWILIO_WHATSAPP_NUMBER && (messageType === 'both' || messageType === 'whatsapp')) {
        try {
          const whatsAppPayload = {
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${cleanNumber}`,
          };

          if (process.env.TWILIO_WHATSAPP_TEMPLATE) {
            // Twilio template id path (quick reply/flexible template)
            whatsAppPayload.body = `🚨 SOS Alert!\n\nLocation: ${mapsLink}\n\nTemplate: ${process.env.TWILIO_WHATSAPP_TEMPLATE}`;
          } else {
            whatsAppPayload.body = whatsappMessage;
          }

          const whatsappResponse = await twilioClient.messages.create(whatsAppPayload);

          contactResult.whatsapp = {
            status: 'success',
            messageId: whatsappResponse.sid,
            provider: 'twilio-whatsapp'
          };

          await logEmergencyEvent(userId, 'whatsapp_sent', {
            to: number,
            messageId: whatsappResponse.sid,
            location: location
          });

        } catch (error) {
          console.error(`WhatsApp error sending to ${number}:`, error);
          contactResult.whatsapp = {
            status: 'failed',
            error: error.message,
            provider: 'twilio-whatsapp'
          };
        }
      }

      // If neither SMS nor WhatsApp worked, mark as failed
      if (!contactResult.sms && !contactResult.whatsapp) {
        contactResult.status = 'failed';
        contactResult.error = 'No communication method available';
      } else {
        contactResult.status = 'success';
      }

      results.push(contactResult);
    }

    // Send email alerts for configured email contacts
    for (const email of contactEmails) {
      const emailValue = email.trim();
      const emailResult = { email: emailValue, emailStatus: null };

      if (!emailValue || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailValue)) {
        emailResult.status = 'failed';
        emailResult.emailStatus = {
          status: 'failed',
          error: 'Invalid email format'
        };
        results.push(emailResult);
        continue;
      }

      const mailData = {
        from: process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER,
        to: emailValue,
        subject: 'Emergency Alert - Please respond',
        text: `EMERGENCY ALERT!\n\nI need help immediately!\n\nLocation: ${mapsLink}\n\nPlease reach out as soon as possible.`,
        html: `<p><strong>EMERGENCY ALERT!</strong></p><p>I need help immediately!</p><p><a href="${mapsLink}" target="_blank">Open location in Google Maps</a></p><p>Please respond as soon as possible.</p>`,
      };

      if (!isEmailEnabled) {
        emailResult.status = 'success';
        emailResult.emailStatus = {
          status: 'simulated',
          provider: 'nodemailer-simulation',
          message: 'Email not configured, simulated send only',
          mailData,
        };
        results.push(emailResult);
        continue;
      }

      try {
        const emailResp = await smtpTransport.sendMail(mailData);
        emailResult.status = 'success';
        emailResult.emailStatus = {
          status: 'success',
          provider: 'nodemailer',
          messageId: emailResp.messageId,
        };
        await logEmergencyEvent(userId, 'email_sent', {
          to: emailValue,
          location: location,
          messageId: emailResp.messageId,
        });
      } catch (error) {
        console.error(`Email error sending to ${emailValue}:`, error);
        emailResult.status = 'failed';
        emailResult.emailStatus = {
          status: 'failed',
          provider: 'nodemailer',
          error: error.message,
        };
      }

      results.push(emailResult);
    }

    const successfulSends = results.filter(result => result.status === 'success');

    if (successfulSends.length === 0) {
      return res.status(500).json({
        message: "Failed to send all emergency messages",
        details: results
      });
    }

    const totalContactCount = contactNumbers.length + contactEmails.length;
    res.status(200).json({
      message: `Emergency alert sent to ${successfulSends.length} out of ${totalContactCount} contacts`,
      successCount: successfulSends.length,
      totalCount: totalContactCount,
      details: results,
      mapsLink: mapsLink
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({
      message: "Failed to send emergency alert",
      error: error.message
    });
  }
};

export { AddContact, DeleteContact, SendEmergencyInfo };
