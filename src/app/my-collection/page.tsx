"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPhotoDetails } from "@/lib/unsplash";
import CollectionCard from "@/components/CollectionCard";

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
  const [isLoading, setIsLoading] = useState(false);

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
                  coverPhotoUrl: photoDetails?.urls?.small,
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
      }
    };

    fetchCollections();
  }, [session]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
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
                coverPhotoUrl={coverImageUrl || ""}
                totalPhotos={collection.images.length}
                onClick={() => router.push(`/my-collection/${collection._id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
