import { fetchPhotoDetails } from "@/lib/unsplash";
import Image from "next/image";

interface PhotoPageProps {
  params: {
    id: string;
  };
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const photo = await fetchPhotoDetails(params.id);

  if (!photo) {
    return <p className="text-center text-gray-500">Photo not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold">
        {photo.alt_description || "Untitled"}
      </h1>
      <div className="relative w-full h-[500px] my-4">
        <Image
          src={photo.urls.regular}
          alt={photo.alt_description || "Image"}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <p className="text-gray-600">By {photo.user.name}</p>
      <p className="text-gray-600">Downloads: {photo.downloads}</p>
      <p className="text-gray-600">
        Created at: {new Date(photo.created_at).toDateString()}
      </p>
    </div>
  );
}
