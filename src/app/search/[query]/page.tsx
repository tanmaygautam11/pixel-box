"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchImages } from "../../../lib/unsplash";
import SearchBar from "@/components/SearchBar";
import Gradient from "../../../../public/images/gradiend-bg@2x.png";

type UnsplashImage = {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
    profile_image: {
      small: string;
    };
  };
};

const SearchPage = () => {
  const { query } = useParams();
  const router = useRouter();
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        const results = await fetchImages(
          Array.isArray(query) ? query.join(" ") : query
        );
        setImages(results);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    router.push(`/search/${newQuery}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full flex justify-center items-center flex-col">
        <div className="relative w-full h-24 mt-16">
          <Image src={Gradient} alt="gradient image" fill />
        </div>
        <div className="flex justify-center w-3/5 h-14 relative bottom-8">
          <SearchBar
            onSearch={handleSearch}
            initialQuery={Array.isArray(query) ? query.join(" ") : query || ""}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin border-4 border-t-4 border-blue-600 rounded-full w-12 h-12"></div>
          <p>Loading...</p>
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-500">
          No results found for {query}
        </p>
      ) : (
        <div className="px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative min-h-64 h-auto rounded-[6px] overflow-hidden shadow-lg group"
            >
              <Image
                src={img.urls.small}
                alt={img.alt_description || "Image from Unsplash"}
                layout="fill"
                objectFit="cover"
              />
              <div className="flex items-center absolute bottom-0 left-0 bg-gradient-to-t from-black-100 via-transparent to-transparent text-white p-2 w-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
