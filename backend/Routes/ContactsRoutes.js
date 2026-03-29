import express from "express";
import { AddContact, DeleteContact, SendEmergencyInfo } from "../Controllers/ContactsController.js";
import { upload } from "../Middlewares/Multer.js";
import { verifyUser } from "../Middlewares/AdminAuth.js";

const router = express.Router();


router.post("/addcontact", verifyUser, upload.single("photo"), async (req, res, next) => {
  try {
    await AddContact(req, res);
  } catch (error) {
    next(error); 
  }
});
router.delete("/delete-contact", verifyUser, DeleteContact)
router.post("/emergency", verifyUser, SendEmergencyInfo)
router.post("/sos", verifyUser, SendEmergencyInfo)

export default router;
