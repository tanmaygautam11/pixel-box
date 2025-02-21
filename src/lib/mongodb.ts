import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose; // If already connected, no need to reconnect
  }

  const opts = {
    bufferCommands: false, // Disable buffering to avoid issues in SSR
  };

  await mongoose.connect(MONGODB_URI!, opts);
  console.log("Connected to MongoDB");
  return mongoose;
}

export default connectToDatabase;
