"use client";

import { useEffect, useState } from "react";
import {  useParams } from "next/navigation"; // Import useRouter and useParams from next/navigation
import { fetchPhotoDetails } from "@/lib/unsplash"; // Import the function to fetch photo details
import ImageGallery, { UnsplashImage } from "@/components/ImageGallery"; // Import ImageGallery for displaying collection photos

export default function CollectionPhotosPage() {
  const { id } = useParams(); // Get the collection ID from the URL

  const [photos, setPhotos] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Wait for the collection ID to be available

    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/collections/${id}/photos`);
        if (response.ok) {
          const data = await response.json();
          const fetchedPhotos: UnsplashImage[] = [];
          for (const imageId of data) {
            const photoDetails = await fetchPhotoDetails(imageId); // Fetch photo details
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
          console.error("Failed to fetch photos for the collection");
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [id]); // Trigger fetch when the collection ID changes

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="w-full h-full absolute top-24 px-16">
      <h1 className="text-center text-[40px] gradient-text mb-4">
        Collection Photos
      </h1>
      {photos.length === 0 ? (
        <p>No photos found in this collection</p>
      ) : (
        <div className="py-8">
          <ImageGallery images={photos} />
        </div>
      )}
    </div>
  );
}
