"use client";

import Image from "next/image";
import Link from "next/link";
import DefaultProfile from "@/../public/icons/default-profile.png"; // Correct import

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string; // This should be a full URL, but we check and correct it if necessary
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

interface ImageGalleryProps {
  images: UnsplashImage[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

const ImageGallery = ({
  images,
  onLoadMore,
  isLoadingMore = false,
}: ImageGalleryProps) => {
  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500">No images available.</p>;
  }

  return (
    <div className="w-full">
      <div className="px-12 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => {
          // Ensure `img.urls.regular` is a valid URL and not just an image ID
          const imageUrl = img.urls.regular.startsWith("http")
            ? img.urls.regular
            : `https://images.unsplash.com/${img.urls.regular}`; // Fallback to full URL if needed

          // Fallback to `DefaultProfile` for profile image
          const profileImageSrc =
            img.user.profile_image.small || DefaultProfile;

          const imageHeight = Math.round((img.height / img.width) * 400);

          return (
            <div
              key={img.id} // Use `img.id` as the key for uniqueness
              className="relative mb-4 rounded-[6px] overflow-hidden shadow-lg group"
              style={{ gridRowEnd: `span ${Math.ceil(imageHeight / 100)}` }}
            >
              <Link href={`/photo/${img.id}`} className="block w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl} // Use the corrected image URL
                    alt={img.alt_description || "Image from Unsplash"}
                    width={400}
                    height={imageHeight}
                    sizes="100vw"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    className="transition-all duration-300 transform group-hover:scale-105"
                  />
                  <div className="flex items-center absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                      <Image
                        src={profileImageSrc} // Use the profile image or fallback
                        alt={`${img.user.name}'s profile`}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <p>{img.user.name}</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {onLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="mb-10 px-12 py-2 bg-black text-white rounded-[6px] hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
