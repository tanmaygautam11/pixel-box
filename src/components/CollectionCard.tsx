import React from "react";
import Image from "next/image";

export interface CollectionCardProps {
  id: string;
  title: string;
  coverPhotoUrl: string;
  totalPhotos: number;
  href?: string;
  onClick?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  coverPhotoUrl,
  totalPhotos,
  onClick,
  href,
}) => {
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <div
      className="cursor-pointer bg-white hover:scale-105 transition duration-300"
      onClick={onClick}
    >
      <a href={href}>
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
    </div>
  );
};

export default CollectionCard;
