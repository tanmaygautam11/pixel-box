import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface CollectionCardProps {
  id: string;
  title: string;
  coverPhotoUrl: string;
  totalPhotos: number;
  onClick?: () => void;
  showDeleteButton?: boolean;
  onDeleteCollection?: (id: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  id,
  title,
  coverPhotoUrl,
  totalPhotos,
  onClick,
  showDeleteButton = false,
  onDeleteCollection,
}) => {
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDeleteCollection) {
      await onDeleteCollection(id);
    }
  };

  return (
    <div
      className="cursor-pointer bg-white hover:scale-105 transition duration-300 relative"
      onClick={onClick}
    >
      <a>
        <Image
          src={coverPhotoUrl}
          alt={title}
          width={500}
          height={300}
          className="object-cover w-full h-72 rounded-[6px]"
        />
      </a>
      <div className="mt-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {formattedTitle}
        </h2>
        <h4 className="text-gray-500 text-sm">{totalPhotos} photos</h4>
      </div>

      {/* Conditionally render the delete button */}
      {showDeleteButton && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-secondary-100 rounded-full p-2 hover:text-white"
        >
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </button>
      )}
    </div>
  );
};

export default CollectionCard;
