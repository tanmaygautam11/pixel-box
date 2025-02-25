"use client";

import { fetchPhotoDetails } from "@/lib/unsplash";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import DefaultProfile from "@/../public/icons/default-profile.png";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPlus,
  faLocationDot,
  faClosedCaptioning,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleDown,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";

interface Photo {
  id: string;
  alt_description?: string;
  urls: { small: string; medium: string; regular: string; full: string };
  user: { name: string; profile_image: { small: string } };
  downloads: number;
  created_at: string;
  location?: { name?: string };
  tags?: { title: string }[];
}

interface Collection {
  _id: string;
  name: string;
}

export default function PhotoPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const data = await fetchPhotoDetails(id);
      setPhoto(data);

      if (data?.urls?.regular) {
        const img = new window.Image();
        img.src = data.urls.regular;
        img.onload = () => {
          setIsPortrait(img.height > img.width);
        };
      }
    }
    fetchData();
  }, [id]);

  const capitalizeFirstLetter = (text?: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  useEffect(() => {
    if (showCollectionModal && session?.user?.id) {
      fetchUserCollections();
    }
  }, [showCollectionModal, session]);

  const fetchUserCollections = async () => {
    const response = await fetch("/api/collections/user", { method: "GET" });

    if (!response.ok) {
      console.error("Failed to fetch collections");
      return;
    }

    const data = await response.json();
    setCollections(data);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error("Enter a collection name.");
      return;
    }

    try {
      const response = await fetch("/api/collections/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Collection created!");
        setNewCollectionName("");
        fetchUserCollections();
      } else {
        console.error("Error creating collection:", data);
        toast.error(`Failed to create collection: ${data.message}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error: Could not create collection.");
    }
  };
  const handleAddToCollection = async () => {
    if (!selectedCollection) {
      toast.error("Select a collection first.");
      return;
    }

    const imageId = photo?.id;

    try {
      const checkResponse = await fetch(
        `/api/collections/${selectedCollection}`
      );
      if (checkResponse.ok) {
        const collectionData = await checkResponse.json();
        const imageExists = collectionData.images.some(
          (img: { id: string }) => img.id === imageId
        );

        if (imageExists) {
          toast.error("Image already exists in the collection.");
        }
      }

      const response = await fetch("/api/collections/add-image", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionId: selectedCollection,
          imageId: imageId,
        }),
      });

      if (response.ok) {
        toast.success("Photo added successfully!");
        setShowCollectionModal(false);
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add photo.");
      }
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("An error occurred while adding the photo.");
    }
  };

  const handleDownload = async (size: keyof Photo["urls"]) => {
    if (!photo?.urls[size]) return;

    try {
      const response = await fetch(photo.urls[size]);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `photo-${photo.id}-${size}.jpg`;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image.");
    }
  };
  const handleTagClick = (tagName: string) => {
    router.push(`/search/${tagName}`);
  };

  if (!photo) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <>
      {/* Full Screen Image View */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <button
            className="z-10 absolute top-4 right-4 text-white px-4 py-2 rounded-[6px] hover:bg-gray-100"
            onClick={() => setIsFullScreen(false)}
          >
            <FontAwesomeIcon icon={faXmark} size="xl" className="text-white" />
          </button>
          <div
            className={`relative w-full h-full flex justify-center items-center transition-transform duration-300 ${
              isZoomed
                ? "scale-150 cursor-zoom-out"
                : "scale-100 cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={photo.urls.full}
              alt={photo.alt_description || "Image"}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="w-full mx-auto px-16 flex-col flex justify-center items-center absolute top-24">
        {/* Image and Details Layout */}
        <div
          className={`mb-10 flex gap-8 w-[90%] ${
            isPortrait ? "flex-row" : "flex-col"
          }`} // Change layout based on portrait/landscape
        >
          {/* Image */}
          <div
            className={`flex justify-center ${
              isPortrait ? "w-1/2 h-[650px]" : "w-full"
            }`}
          >
            <Image
              src={photo.urls.regular}
              alt={photo.alt_description || "Image"}
              width={isPortrait ? 500 : 800}
              height={isPortrait ? 700 : 500}
              className="rounded-[8px] object-cover"
              onClick={() => setIsFullScreen(true)}
            />
          </div>

          {/* Details */}
          <div className={`flex-1 ${isPortrait ? "" : "mt-4"}`}>
            <div className="flex items-center mb-4 mt-5">
              <div className="w-10 h-10 mr-2 rounded-full overflow-hidden">
                <Image
                  src={photo.user.profile_image.small || DefaultProfile}
                  alt={"User profile photo"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <p className="text-base font-semibold text-black-100">
                {photo.user.name}
              </p>
            </div>
            <p className="text-gray-100 text-sm mb-2">
              Published on {format(new Date(photo.created_at), "MMMM dd, yyyy")}
            </p>

            <div className="flex justify-start items-center gap-4">
              <Button
                onClick={() => setShowCollectionModal(true)}
                className="border border-zinc-400 px-6 py-2 bg-secondary-100 text-black-100 rounded-[6px] hover:bg-black-100 hover:text-secondary transition"
              >
                <FontAwesomeIcon icon={faPlus} size="lg" />
                Add to Collection
              </Button>

              {/* Download Image Button */}
              <div className="relative">
                <div className="border border-zinc-400 rounded-[6px]">
                  <Button
                    className="pr-2 rounded-s-[6px] bg-secondary-100 text-black-100 hover:bg-black-100 hover:text-secondary transition"
                    onClick={() => handleDownload("regular")}
                  >
                    <FontAwesomeIcon icon={faCircleDown} size="lg" />
                    Download Image
                  </Button>
                  <Button
                    onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                    className="px-2 border-l border-zinc-400 rounded-r-[6px] bg-secondary-100 text-black-100 hover:bg-black-100 hover:text-secondary transition"
                  >
                    <FontAwesomeIcon icon={faAngleDown} size="lg" />
                  </Button>
                </div>

                {showDownloadOptions && (
                  <div className="border border-zinc-400 absolute right-0 mt-2 text-black-100 bg-white shadow-lg rounded-[6px] overflow-hidden w-40">
                    {(["small", "regular", "full"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          handleDownload(size);
                          setShowDownloadOptions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-secondary"
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              {photo.location?.name && (
                <p className="text-gray-100 mb-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size="lg"
                    className="mr-2"
                  />
                  {photo.location.name}
                </p>
              )}

              <p className="text-gray-100 mb-2">
                <FontAwesomeIcon
                  icon={faClosedCaptioning}
                  size="lg"
                  className="mr-2"
                />
                {capitalizeFirstLetter(photo.alt_description)}
              </p>
              <p className="text-gray-100 mb-2">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  size="lg"
                  className="mr-2"
                />
                Free to use under the Unsplash License
              </p>
            </div>
            {/* Tags */}
            {photo.tags && photo.tags.length > 0 && (
              <div className="my-4">
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag) => (
                    <span
                      key={tag.title}
                      className="text-gray-200 bg-secondary-100 px-3 py-1 text-sm rounded-[4px] cursor-pointer"
                      onClick={() => handleTagClick(tag.title)}
                    >
                      {capitalizeFirstLetter(tag.title)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full"></div>

        {/* Collection Modal */}
        {showCollectionModal && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-8 rounded-[6px] w-2/5 h-max">
              <div className="flex justify-between">
                <h2 className="text-lg font-bold mb-4">Add to Collection</h2>
                <FontAwesomeIcon
                  icon={faXmark}
                  size="xl"
                  className="text-gray-100 hover:text-black-100"
                  onClick={() => setShowCollectionModal(false)}
                />
              </div>
              {/* Create New Collection */}
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Create new collection"
                  className="w-full rounded-[6px] text-gray-200 p-3 border border-zinc-400"
                />
                <button
                  onClick={handleCreateCollection}
                  className="px-4 rounded-[6px] bg-black-100 text-secondary hover:bg-gray-200 transition"
                >
                  <FontAwesomeIcon icon={faPlus} size="lg" />
                </button>
              </div>
              {/* Select Existing Collection */}
              <select
                className="w-full rounded-[6px] p-3 mb-4 text-gray-200 border border-zinc-400 focus:border-gray-200"
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <option value="">Select a Collection</option>
                {collections.map((collection) => (
                  <option key={collection._id} value={collection._id}>
                    {capitalizeFirstLetter(collection.name)}
                  </option>
                ))}
              </select>

              {/* Add to Collection */}
              <button
                onClick={handleAddToCollection}
                className="w-full p-3 rounded-[6px] bg-black-100 text-secondary hover:bg-gray-200 transition"
              >
                Add Photo to Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
