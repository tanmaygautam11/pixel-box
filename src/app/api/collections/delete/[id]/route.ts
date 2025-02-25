import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Collection from "@/models/collection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userId = session.user.id;

    const collection = await Collection.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Collection deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
