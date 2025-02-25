"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCollectionPhotos, fetchCollectionDetails } from "@/lib/unsplash"; // New function
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

      // Fetch collection details
      const details = await fetchCollectionDetails(Array.isArray(collectionId) ? collectionId[0] : collectionId);
      setCollectionDetails(details);

      // Fetch initial photos
      const collectionPhotos = await fetchCollectionPhotos(Array.isArray(collectionId) ? collectionId[0] : collectionId);
      setPhotos(collectionPhotos);

      setLoading(false);
    };

    loadCollection();
  }, [collectionId]);

  const handleLoadMore = async () => {
    if (!collectionId) return;
    setLoadingMore(true);

    const nextPage = Math.floor(photos.length / 30) + 1;
    const morePhotos = await fetchCollectionPhotos(Array.isArray(collectionId) ? collectionId[0] : collectionId, nextPage);
    setPhotos((prevPhotos) => [...prevPhotos, ...morePhotos]);

    setLoadingMore(false);
  };

  if (!collectionId) {
    return (
      <p className="absolute top-24 text-red-500">
        Collection ID is missing. Please check the URL.
      </p>
    );
  }

  return (
    <div className="absolute top-24">
      <div className="text-center">
        <h1 className="text-[42px] gradient-text">
          {collectionDetails ? collectionDetails.title : "Collection"}
        </h1>
        <p className="text-base font-thin text-black-100">
          {collectionDetails
            ? `Total images: ${collectionDetails.total_photos}`
            : "Loading details..."}
        </p>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ImageGallery
          images={photos}
          onLoadMore={handleLoadMore}
          isLoadingMore={loadingMore}
        />
      )}
    </div>
  );
};

export default CollectionPage;
