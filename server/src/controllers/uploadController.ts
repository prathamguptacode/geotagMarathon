import { RequestHandler } from "express";
import cloudinary from "@/config/cloudinary";
import imageModel from "@/model/imageModel";
import { z } from "zod"
import fs from "fs/promises"

const locationSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number()
})


export const uploadController: RequestHandler = async (req, res) => {
  const path = req.file?.path
  if (!path) {
    return res.fail(404, "IMAGE NOT FOUND")
  }
  const validate = locationSchema.safeParse({ latitude: req.headers.latitude, longitude: req.headers.longitude })
  if (!validate.success) {
    await fs.unlink(path)
    return res.fail(400, "LOCATION NOT FOUND")
  }
  const resCloud = await cloudinary.uploader.upload(path, {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: "geotag"
  })
  const location = {
    type: "Point",
    coordinates: [validate.data.latitude, validate.data.longitude]
  }
  await fs.unlink(path)
  const dbimg = new imageModel({ publicId: resCloud.public_id, location })
  const resDb = await dbimg.save()
  res.success(201, { id: resDb._id }, "UPLOADED")
}

export const viewImageController: RequestHandler = async (req, res) => {
  const id = req.params.id
  const resDb = await imageModel.findById(id)
  if (resDb == null) {
    return res.fail(404, "NOT_FOUND")
  }
  res.success(200, { publicId: resDb.publicId, location: resDb.location })
}
