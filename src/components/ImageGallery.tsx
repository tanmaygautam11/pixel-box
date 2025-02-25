"use client";

import Image from "next/image";
import Link from "next/link";
import DefaultProfile from "@/../public/icons/default-profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";  

export interface UnsplashImage {
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

interface ImageGalleryProps {
  images: UnsplashImage[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  showDeleteButton?: boolean;
  onDeleteImage?: (imageId: string) => void;
}

const ImageGallery = ({
  images,
  onLoadMore,
  isLoadingMore = false,
  showDeleteButton = false,
  onDeleteImage,
}: ImageGalleryProps) => {
  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500">No images available.</p>;
  }

  const uniqueImages = Array.from(
    new Map(images.map((img) => [img.id, img])).values()
  );

  return (
    <div className="w-full">
      <div className="px-12 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uniqueImages.map((img) => {
          const imageUrl = img.urls.regular.startsWith("http")
            ? img.urls.regular
            : `https://images.unsplash.com/${img.urls.regular}`;

          const profileImageSrc =
            img.user.profile_image.small || DefaultProfile;

          const imageHeight = Math.round((img.height / img.width) * 400);

          return (
            <div
              key={img.id}
              className="relative mb-4 rounded-[6px] overflow-hidden shadow-lg group"
              style={{ gridRowEnd: `span ${Math.ceil(imageHeight / 100)}` }}
            >
              <Link href={`/photo/${img.id}`} className="block w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
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
                        src={profileImageSrc}
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

              {showDeleteButton &&
                onDeleteImage && (
                  <button
                    onClick={() => onDeleteImage(img.id)}
                    className="absolute top-2 right-2 text-secondary-100 rounded-full p-2 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                )}
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
