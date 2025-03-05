"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPhotoDetails } from "@/lib/unsplash";
import CollectionCard from "@/components/CollectionCard";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Loader from "@/components/Loader";

const placeholderImage =
  "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

export default function MyCollections() {
  const { data: session } = useSession();
  const router = useRouter();
  interface Collection {
    _id: string;
    name: string;
    images: string[]; // Store image IDs
  }

  const [collections, setCollections] = useState<Collection[]>([]);
  const [coverPhotos, setCoverPhotos] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/collections/user", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setCollections(data);

          const coverPhotoPromises = data.map(
            async (collection: Collection) => {
              const firstImageId = collection.images[0];
              if (firstImageId) {
                const photoDetails = await fetchPhotoDetails(firstImageId);
                return {
                  collectionId: collection._id,
                  coverPhotoUrl: photoDetails?.urls?.regular,
                };
              }
              return null;
            }
          );

          const coverPhotosData = await Promise.all(coverPhotoPromises);
          const coverPhotosMap: Record<string, string> = {};
          coverPhotosData.forEach((data) => {
            if (data) {
              coverPhotosMap[data.collectionId] = data.coverPhotoUrl;
            }
          });
          setCoverPhotos(coverPhotosMap);
        } else {
          console.error("Failed to fetch collections");
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setIsLoading(false);
        setShowLoader(false);
      }
    };

    fetchCollections();
  }, [session]);

const handleCreateCollection = async () => {
  if (!newCollectionName.trim()) {
    toast.error("Enter a collection name.");
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
      toast.success("Collection created!");
      setNewCollectionName("");
      setShowCollectionModal(false);

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      console.error("Error creating collection:", data);
      toast.error(`Failed to create collection: ${data.message}`);
    }
  } catch (error) {
    console.error("Network error:", error);
    toast.error("Network error: Could not create collection.");
  }
};

  // Handle collection deletion
  const handleDeleteCollection = async (id: string) => {
    try {
      const response = await fetch(`/api/collections/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCollections((prevCollections) =>
          prevCollections.filter((collection) => collection._id !== id)
        );
        toast.success("Collection deleted successfully!");
      } else {
        toast.error("Failed to delete collection.");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Error deleting collection.");
    }
  };

  if (isLoading || showLoader) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full absolute top-24 px-16">
      <h1 className="text-center text-[40px] gradient-text mb-4">
        My Collections
      </h1>
      {collections.length === 0 ? (
        <p>No collections found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
          {collections.map((collection) => {
            const coverImageUrl = coverPhotos[collection._id];

            return (
              <CollectionCard
                key={collection._id}
                id={collection._id}
                title={collection.name}
                coverPhotoUrl={coverImageUrl || placeholderImage}
                totalPhotos={collection.images.length}
                onClick={() => router.push(`/my-collection/${collection._id}`)}
                showDeleteButton={true}
                onDeleteCollection={handleDeleteCollection}
              />
            );
          })}
          <div
            onClick={() => setShowCollectionModal(true)}
            className="min-h-[300px] cursor-pointer bg-secondary-100 text-gray-100 rounded-xl flex justify-center items-center flex-col gap-2"
          >
            <FontAwesomeIcon icon={faPlus} size="2xl" />
            <h3 className="text-2xl font-medium">Add new collection</h3>
          </div>
        </div>
      )}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-8 rounded-[6px] w-2/5 h-max">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold mb-4">Add to Collection</h2>
              <FontAwesomeIcon
                icon={faXmark}
                size="xl"
                className="text-gray-100 hover:text-black-100"
                onClick={() => setShowCollectionModal(false)}
              />
            </div>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Create new collection"
                className="w-full rounded-[6px] text-gray-200 p-3 border border-zinc-400"
              />
              <button
                onClick={handleCreateCollection}
                className="px-4 rounded-[6px] bg-black-100 text-secondary hover:bg-gray-200 transition"
              >
                <FontAwesomeIcon icon={faPlus} size="lg" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
