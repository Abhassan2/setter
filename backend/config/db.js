import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_STRING);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
        process.exit(1);
    }
};

export default connectDB;
