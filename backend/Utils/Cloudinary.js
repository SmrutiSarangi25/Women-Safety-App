import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


async function cloudinaryUpload(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "ContactImages",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error; 
  }
}

async function cloudinaryUploadResource(filePath, options = {}) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || 'GeneralUploads',
      resource_type: options.resourceType || 'auto'
    })

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      bytes: result.bytes,
      format: result.format
    }
  } catch (error) {
    console.error('Cloudinary resource upload error:', error)
    throw error
  }
}

export { cloudinaryUpload, cloudinaryUploadResource };
