"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchImages } from "../../../lib/unsplash"; // Ensure this path is correct
import SearchBar from "@/components/SearchBar"; // Ensure this path is correct
import Gradient from "../../../../public/images/gradiend-bg@2x.png"; // Ensure this path is correct
import ImageGallery from "@/components/ImageGallery";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  width: number;
  height: number;
  alt_description: string | null;
  user: {
    name: string;
    profile_image: {
      small: string;
    };
  };
}

const SearchPage = () => {
  const { query } = useParams<{ query: string | string[] }>();
  const router = useRouter();
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to decode the query parameter
  const getDecodedQuery = () => {
    if (!query) return "";
    if (Array.isArray(query)) {
      return query.map((q) => decodeURIComponent(q)).join(" ");
    }
    return decodeURIComponent(query);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const results = await fetchImages(
            Array.isArray(query) ? query.join(" ") : query
          );
          if (results && Array.isArray(results)) {
            setImages(results);
          } else {
            console.error("Failed to fetch images.");
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        }
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    router.push(`/search/${newQuery}`);
  };

  const decodedQuery = getDecodedQuery();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full h-24 mt-16">
          <Image src={Gradient} alt="gradient image" fill />
        </div>
        <div className="flex justify-center w-3/5 h-14 relative bottom-8">
          <SearchBar onSearch={handleSearch} initialQuery={decodedQuery} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin border-4 border-t-4 border-black-100 rounded-full w-12 h-12"></div>
          <p>Loading...</p>
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-500">
          No results found for {decodedQuery}
        </p>
      ) : (
        // Using a CSS columns layout for a masonry effect
        <ImageGallery images={images as UnsplashImage[]} />
      )}
    </div>
  );
};

export default SearchPage;
