"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroLeft from "../../../public/images/hero-left.png";
import HeroRight from "../../../public/images/hero-right.png";
import SearchBar from "@/components/SearchBar";
import ImageGallery, { UnsplashImage } from "@/components/ImageGallery";
import { fetchAllImages } from "../../lib/unsplash";

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchedImageIds, setFetchedImageIds] = useState<Set<string>>(
    new Set()
  );

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search/${query}`;
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const loadImages = async () => {
        try {
          const fetchedImages = await fetchAllImages("popular", 30, 5, 1);
          if (fetchedImages) {
            setImages(fetchedImages);
            setFetchedImageIds(new Set(fetchedImages.map((img) => img.id)));
          }
        } catch (error) {
          console.error("Error loading images on Home page", error);
        }
        setLoading(false);
      };
      loadImages();
    }
  }, [isMounted]);

  const loadMoreImages = async () => {
    setLoadingMore(true);
    try {
      const newPage = page + 1;
      const moreImages = await fetchAllImages(
        "popular",
        30,
        5,
        newPage,
        images
      );

      if (moreImages && moreImages.length > 0) {
        const newImages = moreImages.filter(
          (img) => !fetchedImageIds.has(img.id)
        );

        if (newImages.length > 0) {
          setImages((prevImages) => [...prevImages, ...newImages]);
          setFetchedImageIds(
            (prevSet) =>
              new Set([...prevSet, ...newImages.map((img) => img.id)])
          );
          setPage(newPage);
        }
      }
    } catch (error) {
      console.error("Error loading more images", error);
    }
    setLoadingMore(false);
  };

  if (!isMounted) return null;

  return (
    <>
      <section className="w-full h-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full mt-16">
          <div className="relative w-[400px] h-[600px] mt-10">
            <Image src={HeroLeft} alt="hero image" fill />
          </div>
          <div className="text-center flex flex-col gap-2 w-2/5 mb-32">
            <h1 className="text-4xl text-black-100 font-semibold">Search</h1>
            <p className="text-md text-gray-200">
              Search high-resolution images from Unsplash
            </p>
            <SearchBar initialQuery="" onSearch={handleSearch} />
          </div>
          <div className="relative w-[400px] h-[600px] mt-10">
            <Image src={HeroRight} alt="hero image" fill />
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col items-center mt-12">
        <h2 className="text-2xl font-bold mb-6">Explore Popular Images</h2>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ImageGallery
            images={images}
            onLoadMore={loadMoreImages}
            isLoadingMore={loadingMore}
          />
        )}
      </section>
    </>
  );
};

export default Home;
