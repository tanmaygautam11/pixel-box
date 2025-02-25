import React from "react";
import Image from "next/image";

export interface CollectionCardProps {
  id: string;
  title: string;
  coverPhotoUrl: string; // This should now be a full URL or Unsplash URL object
  totalPhotos: number;
  href?: string; // Add a href prop to link to the collection page
  onClick?: () => void; // Triggered when the card is clicked
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  coverPhotoUrl,
  totalPhotos,
  onClick,
  href
}) => {
  return (
    <div
      className="cursor-pointer bg-white"
      onClick={onClick} // Trigger the onClick event to select the collection
    >
      <a href={href}>
        <Image
          src={coverPhotoUrl} // Use the full URL directly here
          alt={title}
          width={500}
          height={300}
          className="object-cover w-full h-72 rounded-[6px]"
        />
      </a>
      <div className="mt-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <h4 className="text-gray-500 text-sm">{totalPhotos} photos</h4>
      </div>
    </div>
  );
};

export default CollectionCard;
