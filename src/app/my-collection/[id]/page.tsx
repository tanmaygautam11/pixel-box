"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPhotoDetails } from "@/lib/unsplash";
import ImageGallery, { UnsplashImage } from "@/components/ImageGallery";
import { toast } from "sonner";

export default function CollectionPhotosPage() {
  const { id } = useParams();

  const [photos, setPhotos] = useState<UnsplashImage[]>([]);
  const [collectionTitle, setCollectionTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  useEffect(() => {
    if (!id) return;

    const fetchCollectionDetails = async () => {
      setIsLoading(true);
      try {
        const collectionResponse = await fetch(`/api/collections/user/${id}`);
        if (collectionResponse.ok) {
          const collectionData = await collectionResponse.json();
          console.log("Fetched collection data:", collectionData);

          if (collectionData && collectionData.name) {
            const capitalizedTitle = capitalizeFirstLetter(collectionData.name);
            setCollectionTitle(capitalizedTitle);
          } else {
            console.error(
              "Collection data does not contain a title:",
              collectionData
            );
          }
        } else {
          console.error("Failed to fetch collection details");
        }

        // Fetch photos for the collection
        const photosResponse = await fetch(`/api/collections/${id}/photos`);
        if (photosResponse.ok) {
          const data = await photosResponse.json();
          const fetchedPhotos: UnsplashImage[] = [];
          for (const imageId of data) {
            const photoDetails = await fetchPhotoDetails(imageId);
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
        console.error("Error fetching collection or photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [id]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch("/api/collections/remove-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectionId: id, imageId }),
      });

      if (response.ok) {
        // Remove image from the local state
        setPhotos((prevPhotos) =>
          prevPhotos.filter((photo) => photo.id !== imageId)
        );
        toast.success("Image removed successfully!");
      } else {
        console.error("Failed to delete image");
        toast.error("Failed to remove the image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting the image.");
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="w-full h-full absolute top-24 px-16">
      <h1 className="text-center text-[42px] gradient-text">
        {collectionTitle ? `${collectionTitle}` : "Collection Photos"}
      </h1>
      {photos.length === 0 ? (
        <p>No photos found in this collection</p>
      ) : (
        <div className="py-8">
          <ImageGallery
            images={photos}
            showDeleteButton={true}
            onDeleteImage={handleDeleteImage}
          />
        </div>
      )}
    </div>
  );
}
