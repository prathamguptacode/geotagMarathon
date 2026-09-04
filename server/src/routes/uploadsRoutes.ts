import { uploadController, viewImageController } from "@/controllers/uploadController"
import asyncHandler from "@/middlewares/asyncHandler"
import upload from "@/middlewares/multer"
import express from "express"
const router = express.Router()

router.post("/", upload.single("img"), asyncHandler(uploadController))
router.get("/:id", asyncHandler(viewImageController))

export default router
