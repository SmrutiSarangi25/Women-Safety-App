import express from "express"
import { AddProfilePhoto, UpdateEmail, UpdatePassword, UpdateUsername } from "../Controllers/ProfileController.js"
import { upload } from "../Middlewares/Multer.js"
import { verifyUser } from "../Middlewares/AdminAuth.js"
const router = express.Router()

router.post("/add-photo", verifyUser, upload.single("photo"), async (req, res, next) => {
    try {
        await AddProfilePhoto(req, res)
    } catch (error) {
        next(error)
    }
})
router.post("/update-name", verifyUser, UpdateUsername)
router.post("/update-email", verifyUser, UpdateEmail)
router.post("/update-password", verifyUser, UpdatePassword)


export default router