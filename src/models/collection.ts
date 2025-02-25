import mongoose, { Schema, Document } from "mongoose";

// Define the interface for ICollection
interface ICollection extends Document {
  userId: mongoose.Schema.Types.ObjectId; // ObjectId reference to User
  name: string;
  images: string[]; // Store imageIds as strings
  createdAt: Date;
}

const CollectionSchema: Schema<ICollection> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  images: {
    type: [String], // Store image IDs
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection =
  mongoose.models.Collection ||
  mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;
