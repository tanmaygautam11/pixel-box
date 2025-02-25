import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface CollectionCardProps {
  id: string;
  title: string;
  coverPhotoUrl: string;
  totalPhotos: number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  id,
  title,
  coverPhotoUrl,
  totalPhotos,
}) => {
  return (
    <Link href={`/collection/${id}`} passHref>
      <div key={`${id}-${title}`} className="cursor-pointer">
        <Image
          src={coverPhotoUrl}
          alt={title}
          width={500}
          height={300}
          className="object-cover w-full h-72 rounded-[6px] shadow-lg mb-4"
        />
        <h2 className="text-xl font-semibold text-black-100">{title}</h2>
        <h4 className="text-gray-100 text-md">{totalPhotos} photos</h4>
      </div>
    </Link>
  );
};

export default CollectionCard;
