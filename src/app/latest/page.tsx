"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "@/components/ImageGallery";
import { UnsplashImage } from "@/components/ImageGallery";
import { fetchLatestImages } from "@/lib/unsplash";

const Latest = () => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const latestImages = await fetchLatestImages(30);
        setImages(latestImages);
      } catch (error) {
        console.error("Error fetching latest images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const loadMoreImages = async () => {
    setIsLoadingMore(true);
    try {
      const moreImages = await fetchLatestImages(30, page + 1);
      setImages((prevImages) => [...prevImages, ...moreImages]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching more images:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };


  return (
    <div className="container absolute top-24 mx-auto px-4">
      <h1 className="text-[42px] gradient-text text-center">Latest Images</h1>
      <div className="py-8">
        {!isLoading && images.length > 0 ? (
          <ImageGallery
            images={images}
            onLoadMore={loadMoreImages}
            isLoadingMore={isLoadingMore}
          />
        ) : (
          !isLoading && (
            <p className="text-center text-gray-500">No images available.</p>
          )
        )}
      </div>
    </div>
  );

};

export default Latest;
