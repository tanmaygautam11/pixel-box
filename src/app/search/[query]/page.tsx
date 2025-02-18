"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchImages } from "../../../lib/unsplash"; // Ensure this path is correct
import SearchBar from "@/components/SearchBar"; // Ensure this path is correct
import Gradient from "../../../../public/images/gradiend-bg@2x.png"; // Ensure this path is correct

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
        <div className="px-12 mt-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="break-inside-avoid mb-4 relative rounded-[6px] overflow-hidden shadow-lg group"
            >
              <div className="relative w-full">
                <Image
                  src={img.urls.regular || img.urls.small}
                  alt={img.alt_description || "Image from Unsplash"}
                  width={400}
                  height={Math.round((img.height / img.width) * 400)}
                  sizes="100vw"
                  style={{ objectFit: "cover", width: "100%", height: "auto" }}
                  className="transition-all duration-300 transform group-hover:scale-105"
                  priority
                />
                <div className="flex items-center absolute bottom-0 left-0 w-full bg-gradient-to-t from-black-100 via-transparent to-transparent text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                    <Image
                      src={img.user.profile_image.small}
                      alt={`${img.user.name}'s profile`}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <p>{img.user.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
