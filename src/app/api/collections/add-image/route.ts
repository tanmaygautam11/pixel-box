import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Collection from "@/models/collection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: NextRequest) {
  try {
    console.log("Connecting to database...");
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

    // Convert collectionId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return NextResponse.json(
        { message: "Invalid collection ID format" },
        {
          status: 400,
        }
      );
    }

    // Convert session user id to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const collectionObjectId = new mongoose.Types.ObjectId(collectionId);

    const collection = await Collection.findOne({
      _id: collectionObjectId,
      userId,
    });

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        {
          status: 404,
        }
      );
    }

    if (collection.images.includes(imageId)) {
      return NextResponse.json(
        {
          message: "Image already exists in collection",
        },
        { status: 400 }
      );
    }

    collection.images.push(imageId);
    await collection.save();

    return NextResponse.json(
      {
        message: "Image added to collection",
        collection,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding image to collection:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
