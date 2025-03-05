"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCollectionPhotos, fetchCollectionDetails } from "@/lib/unsplash";
import ImageGallery, { UnsplashImage } from "@/components/ImageGallery";

interface CollectionDetails {
  title: string;
  total_photos: number;
}

const CollectionPage = () => {
  const { id: collectionId } = useParams();
  const [photos, setPhotos] = useState<UnsplashImage[]>([]);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    if (!collectionId) return;

    const loadCollection = async () => {
      setLoading(true);

      try {
        const details = await fetchCollectionDetails(
          Array.isArray(collectionId) ? collectionId[0] : collectionId
        );
        setCollectionDetails(details);

        const collectionPhotos = await fetchCollectionPhotos(
          Array.isArray(collectionId) ? collectionId[0] : collectionId
        );
        setPhotos(collectionPhotos);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [collectionId]);

  const handleLoadMore = async () => {
    if (!collectionId) return;
    setLoadingMore(true);

    try {
      const nextPage = Math.floor(photos.length / 30) + 1;
      const morePhotos = await fetchCollectionPhotos(
        Array.isArray(collectionId) ? collectionId[0] : collectionId,
        nextPage
      );
      setPhotos((prevPhotos) => [...prevPhotos, ...morePhotos]);
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!collectionId) {
    return (
      <div className="absolute top-24 w-full text-center text-red-500">
        Collection ID is missing. Please check the URL.
      </div>
    );
  }

  return (
    <div className="absolute top-24 w-full px-4">
      <div className="text-center">
        <h1 className="text-[42px] gradient-text">
          {collectionDetails?.title || "Collection"}
        </h1>
        <p className="text-base font-thin text-gray-500">
          {collectionDetails
            ? `Total images: ${collectionDetails.total_photos}`
            : ""}
        </p>
      </div>

      {/* Image Gallery */}
      <div className="py-8 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <ImageGallery
            images={photos}
            onLoadMore={handleLoadMore}
            isLoadingMore={loadingMore}
          />
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
