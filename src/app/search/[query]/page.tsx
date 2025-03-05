"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchAllImages } from "../../../lib/unsplash";
import SearchBar from "@/components/SearchBar";
import Gradient from "../../../../public/images/gradiend-bg@2x.png";
import ImageGallery from "@/components/ImageGallery";
import { UnsplashImage } from "@/components/ImageGallery";

const SearchPage = () => {
  const { query } = useParams<{ query: string | string[] }>();
  const router = useRouter();
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [fetchedImageIds, setFetchedImageIds] = useState<Set<string>>(
    new Set()
  );

  const getDecodedQuery = () => {
    if (!query) return "";
    return Array.isArray(query)
      ? query.map((q) => decodeURIComponent(q)).join(" ")
      : decodeURIComponent(query);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const results = await fetchAllImages(getDecodedQuery(), 30, 5, 1);
          if (results) {
            setImages(results);
            setFetchedImageIds(new Set(results.map((img) => img.id)));
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        }
        setLoading(false);
      }
    };

    fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const loadMoreImages = async () => {
    setLoadingMore(true);
    try {
      const newPage = page + 1;
      const moreImages = await fetchAllImages(
        getDecodedQuery(),
        30,
        5,
        newPage,
        images
      );

      if (moreImages) {
        const newImages = moreImages.filter(
          (img) => !fetchedImageIds.has(img.id)
        );

        if (newImages.length > 0) {
          setImages((prev) => [...prev, ...newImages]);
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

  const decodedQuery = getDecodedQuery();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full h-24 mt-16">
          <Image src={Gradient} alt="gradient image" fill />
        </div>
        <div className="flex justify-center w-3/5 h-14 relative bottom-8">
          <SearchBar
            onSearch={(newQuery) => router.push(`/search/${newQuery}`)}
            initialQuery={decodedQuery}
          />
        </div>
      </div>

      {!loading && images.length === 0 ? (
        <p className="text-center text-gray-500">
          No results found for {decodedQuery}
        </p>
      ) : (
        <ImageGallery
          images={images}
          onLoadMore={loadMoreImages}
          isLoadingMore={loadingMore}
        />
      )}
    </div>
  );
};

export default SearchPage;
