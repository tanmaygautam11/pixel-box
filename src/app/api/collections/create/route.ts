import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Collection from "@/models/collection";

export async function POST(req: NextRequest) {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || !session.user?.id) {
      console.log("Unauthorized - Missing user ID");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    console.log("Received collection name:", name);

    if (!name) {
      return NextResponse.json(
        { message: "Collection name is required" },
        { status: 400 }
      );
    }

    // ✅ Check if `session.user.id` is a valid ObjectId before using it
    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      console.error("Invalid ObjectId:", session.user.id);
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id); // ✅ Convert session.user.id to ObjectId

    const newCollection = new Collection({
      userId,
      name,
      images: [],
    });

    console.log("Saving new collection...");
    await newCollection.save();

    console.log("Collection created successfully:", newCollection);
    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.error("Error creating collection:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
