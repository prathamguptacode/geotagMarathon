import mongoose from "mongoose";
import env from "./env";

const connectDB = () => {
    try {
        mongoose.connect(env.MONGO_URI)
        console.log("Connected to MongoDB!")
    } catch (error) {
        console.error("ERROR:Could not connect to mongodb", error)
    }
}

export default connectDB