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
    required: true, // Must reference a user
  },
  name: {
    type: String,
    required: true, // The name of the collection
  },
  images: {
    type: [String], // Store image IDs (not URLs)
    default: [], // Default to an empty array if no images are provided
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for when the collection was created
  },
});

// Ensure that the Collection model is available (to prevent overriding)
const Collection =
  mongoose.models.Collection ||
  mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;
