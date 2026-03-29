import express from "express"
import { AddReview, GetAllReviews } from "../Controllers/ReviewController.js"
import { verifyUser } from "../Middlewares/AdminAuth.js"
const router = express.Router()

router.post("/addreview", verifyUser, AddReview)
router.get("/allreviews", GetAllReviews)

export default router