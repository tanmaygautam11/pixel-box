"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ImageGallery, { UnsplashImage } from "@/components/ImageGallery";
import { fetchPhotoDetails } from "@/lib/unsplash"; // Import the function to fetch photo details

export default function MyCollections() {
  const { data: session } = useSession();
  interface Collection {
    _id: string;
    name: string;
    images: string[]; // Store image IDs
  }

  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [photos, setPhotos] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch collections when the page loads
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
        } else {
          console.error("Failed to fetch collections");
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [session]);

  // Fetch photos when a collection is selected
  useEffect(() => {
    if (!selectedCollectionId) return;

    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/collections/${selectedCollectionId}/photos`
        );
        if (response.ok) {
          const data = await response.json();

          // Fetch photo details from Unsplash for each imageId
          const fetchedPhotos: UnsplashImage[] = [];
          for (const imageId of data) {
            const photoDetails = await fetchPhotoDetails(imageId); // Get metadata for each photo
            if (photoDetails) {
              fetchedPhotos.push({
                id: photoDetails.id,
                urls: {
                  regular: photoDetails.urls.regular,
                  small: photoDetails.urls.small,
                },
                width: photoDetails.width,
                height: photoDetails.height,
                alt_description: photoDetails.alt_description,
                user: {
                  name: photoDetails.user.name,
                  profile_image: {
                    small: photoDetails.user.profile_image.small,
                  },
                },
              });
            }
          }
          setPhotos(fetchedPhotos);
        } else {
          console.error("Failed to fetch photos");
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedCollectionId]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">My Collections</h1>
      {collections.length === 0 ? (
        <p>No collections found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <div
              key={collection._id}
              className="cursor-pointer border p-4 rounded shadow-lg hover:bg-gray-100"
              onClick={() => setSelectedCollectionId(collection._id)}
            >
              <h2 className="text-lg font-semibold">{collection.name}</h2>
              <p>{collection.images.length} photos</p>
            </div>
          ))}
        </div>
      )}

      {selectedCollectionId && (
        <div>
          <h2 className="text-xl font-bold mt-8">Photos in this Collection</h2>
          <ImageGallery images={photos} />
        </div>
      )}
    </div>
  );
}
