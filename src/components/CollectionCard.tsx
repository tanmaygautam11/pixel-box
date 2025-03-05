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
     onDeleteCollection(id);
    }
  };

  return (
    <div className="cursor-pointer bg-white relative group" onClick={onClick}>
      <a>
        <div className="relative w-full h-72 group">
          <Image
            src={coverPhotoUrl}
            alt={title}
            width={700}
            height={500}
            className="object-cover w-full h-full rounded-[6px]"
          />

          {/* Overlay */}
          <div className="rounded-[6px] absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
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
          className="absolute top-2 right-2 text-secondary-100 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
        >
          <FontAwesomeIcon icon={faTrash} size="sm" />
        </button>
      )}
    </div>
  );
};

export default CollectionCard;
