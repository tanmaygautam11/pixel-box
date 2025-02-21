"use client";

import { fetchPhotoDetails } from "@/lib/unsplash";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

// Define the expected structure of a photo
interface Photo {
  id: string;
  alt_description?: string;
  urls: { regular: string };
  user: { name: string };
  downloads: number;
  created_at: string;
}

export default function PhotoPage() {
  const { id } = useParams<{ id: string }>(); // Unwrapping params
  const { data: session } = useSession();
  const [photo, setPhoto] = useState<Photo | null>(null);
  interface Collection {
    _id: string;
    name: string;
  }

  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const router = useRouter();

  // Fetch photo details
  useEffect(() => {
    async function fetchData() {
      if (!id) return; // Ensure id is available before fetching
      const data = await fetchPhotoDetails(id);
      setPhoto(data);
    }
    fetchData();
  }, [id]);

  // Fetch user's collections when modal opens
  useEffect(() => {
    if (showCollectionModal && session?.user?.id) {
      fetchUserCollections();
    }
  }, [showCollectionModal, session]);

  const fetchUserCollections = async () => {
    const response = await fetch("/api/collections/user", { method: "GET" });

    if (!response.ok) {
      console.error("Failed to fetch collections");
      return;
    }

    const data = await response.json();
    setCollections(data);
  };

const handleCreateCollection = async () => {
  if (!newCollectionName) {
    alert("Enter a collection name.");
    return;
  }

  try {
    const response = await fetch("/api/collections/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCollectionName }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Collection created!");
      setNewCollectionName("");
      fetchUserCollections(); // Refresh collections
    } else {
      console.error("Error creating collection:", data);
      alert(`Failed to create collection: ${data.message}`);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error: Could not create collection.");
  }
};
const handleAddToCollection = async () => {
  if (!selectedCollection) {
    alert("Select a collection first.");
    return;
  }

  // Ensure that `photo.id` is the image ID, not the URL
  const imageId = photo?.id; // The image ID from Unsplash

  const response = await fetch("/api/collections/add-image", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      collectionId: selectedCollection,
      imageId: imageId, // Send imageId instead of imageUrl
    }),
  });

  if (response.ok) {
    alert("Photo added successfully!");
    setShowCollectionModal(false);
    router.refresh(); // Refresh page
  } else {
    alert("Failed to add photo.");
  }
};

  if (!photo) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold">
        {photo.alt_description || "Untitled"}
      </h1>
      <div className="relative w-full h-[500px] my-4">
        <Image
          src={photo.urls.regular}
          alt={photo.alt_description || "Image"}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <p className="text-gray-600">By {photo.user.name}</p>
      <p className="text-gray-600">Downloads: {photo.downloads}</p>
      <p className="text-gray-600">
        Created at: {new Date(photo.created_at).toDateString()}
      </p>

      {session ? (
        <button
          onClick={() => setShowCollectionModal(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add to Collection
        </button>
      ) : (
        <p className="text-red-500 mt-4">
          Sign in to add photos to a collection.
        </p>
      )}

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Select or Create Collection
            </h2>

            {/* Select Existing Collection */}
            <select
              className="w-full p-2 border mb-4"
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <option value="">Select a collection</option>
              {collections.map((collection) => (
                <option key={collection._id} value={collection._id}>
                  {collection.name}
                </option>
              ))}
            </select>

            {/* Create New Collection */}
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="New collection name"
              className="w-full p-2 border mb-4"
            />
            <button
              onClick={handleCreateCollection}
              className="w-full px-4 py-2 bg-green-500 text-white rounded"
            >
              Create Collection
            </button>

            {/* Add to Collection */}
            <button
              onClick={handleAddToCollection}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded mt-4"
            >
              Add Photo to Collection
            </button>

            {/* Close Modal */}
            <button
              onClick={() => setShowCollectionModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
