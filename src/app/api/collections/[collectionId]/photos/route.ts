import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Collection from "@/models/collection";

export async function GET(
  req: NextRequest,
  context: { params: { collectionId: string } }
) {
  try {
    const { collectionId } = await context.params; // Await params

    if (!collectionId) {
      return NextResponse.json(
        { message: "Collection ID is required" },
        { status: 400 }
      );
    }
    await connectToDatabase();

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection.images, { status: 200 });
  } catch (error) {
    console.error("Error fetching collection photos:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
