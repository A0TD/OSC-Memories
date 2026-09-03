import mongoose from "mongoose";

const uri = process.env.MONGO_URI as string;

async function connectDB() {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default connectDB