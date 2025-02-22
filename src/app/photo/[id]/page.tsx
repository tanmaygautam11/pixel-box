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
  urls: { small: string; medium: string; regular: string; full: string };
  user: { name: string; profile_image: { small: string } };
  downloads: number;
  created_at: string;
  location?: { name?: string };
  tags?: { title: string }[];
}

interface Collection {
  _id: string;
  name: string;
}

export default function PhotoPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const data = await fetchPhotoDetails(id);
      setPhoto(data);
    }
    fetchData();
  }, [id]);

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
    if (!newCollectionName.trim()) {
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

    const imageId = photo?.id;

    const response = await fetch("/api/collections/add-image", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionId: selectedCollection,
        imageId: imageId,
      }),
    });

    if (response.ok) {
      alert("Photo added successfully!");
      setShowCollectionModal(false);
      router.refresh();
    } else {
      alert("Failed to add photo.");
    }
  };

  const handleDownload = async (size: keyof Photo["urls"]) => {
    if (!photo?.urls[size]) return;

    try {
      const response = await fetch(photo.urls[size]);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `photo-${photo.id}-${size}.jpg`;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image.");
    }
  };

  if (!photo) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* User Info */}
      <div className="flex items-center mb-4 mt-10">
        <Image
          src={photo.user.profile_image.small}
          alt="User profile photo"
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <p className="font-semibold">{photo.user.name}</p>
      </div>

      <h1 className="text-3xl font-bold mb-4">
        {photo.alt_description || "Untitled"}
      </h1>

      {/* Show Image Location */}
      {photo.location?.name && (
        <p className="text-gray-600 mb-2">📍 Location: {photo.location.name}</p>
      )}

      {/* Image Display */}
      <div className="relative w-full h-[500px] my-6">
        <Image
          src={photo.urls.regular}
          alt={photo.alt_description || "Image"}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      {/* Tags */}
      {photo.tags && photo.tags.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-700 font-semibold mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {photo.tags.map((tag) => (
              <span
                key={tag.title}
                className="bg-gray-200 px-3 py-1 text-sm rounded-full"
              >
                #{tag.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center">
        {session ? (
          <button
            onClick={() => setShowCollectionModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Add to Collection
          </button>
        ) : (
          <p className="text-red-500">Sign in to add photos to a collection.</p>
        )}

        {/* Download Image Button */}
        <div className="relative">
          <button
            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Download Image ⬇️
          </button>

          {showDownloadOptions && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden w-40">
              <button
                onClick={() => handleDownload("small")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Small
              </button>
              <button
                onClick={() => handleDownload("regular")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Regular
              </button>
              <button
                onClick={() => handleDownload("full")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Full
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collection Modal (Unchanged) */}
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
