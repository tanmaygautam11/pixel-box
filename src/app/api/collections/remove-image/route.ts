import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Collection from "@/models/collection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { collectionId, imageId } = await req.json();

    if (!collectionId || !imageId) {
      return NextResponse.json(
        { message: "Collection ID and image ID are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return NextResponse.json(
        { message: "Invalid collection ID format" },
        {
          status: 400,
        }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const collectionObjectId = new mongoose.Types.ObjectId(collectionId);

    const collection = await Collection.findOne({
      _id: collectionObjectId,
      userId,
    });

    // If collection not found
    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        {
          status: 404,
        }
      );
    }

    if (!collection.images.includes(imageId)) {
      return NextResponse.json(
        { message: "Image not found in the collection" },
        { status: 404 }
      );
    }

    // Remove the image from the collection
    collection.images = collection.images.filter((imgId: string) => imgId !== imageId);
    await collection.save();

    return NextResponse.json(
      {
        message: "Image removed from collection",
        collection,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing image from collection:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
