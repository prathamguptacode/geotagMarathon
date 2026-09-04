import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  }
}, { timestamps: true })

export default mongoose.model("photosIds", imageSchema)
