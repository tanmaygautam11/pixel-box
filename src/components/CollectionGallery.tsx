"use client";
import React, { useEffect, useState } from "react";
import { fetchCollections } from "@/lib/unsplash";
import CollectionCard from "@/components/CollectionCard";
import { UnsplashCollection } from "@/types/unsplash";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

const CollectionGallery = () => {
  const [collections, setCollections] = useState<UnsplashCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);
      const newCollections = await fetchCollections(12, page, collections);

      if (newCollections) {
        setCollections((prevCollections) => {
          const updatedCollections = [...prevCollections, ...newCollections];
          const uniqueCollections = Array.from(
            new Map(updatedCollections.map((coll) => [coll.id, coll])).values()
          );
          return uniqueCollections;
        });
      }

      setTimeout(() => setLoading(false), 1000);
    };

    loadCollections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <div className="text-center">
        <h1 className="text-[42px] gradient-text">Collections</h1>
        <p className="text-base font-thin text-black-100">
          Explore the world through collections of beautiful <br /> photos free
          to use under the{" "}
          <a
            href="https://unsplash.com/license"
            className="font-bold underline"
          >
            Unsplash License
          </a>
          .
        </p>
      </div>
      {loading ? (
        <div className="h-[60vh]">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
          {collections.map((coll) => (
            <CollectionCard
              key={coll.id}
              id={coll.id}
              title={coll.title}
              coverPhotoUrl={coll.cover_photo.urls.small}
              totalPhotos={coll.total_photos}
              onClick={() => router.push(`/collection/${coll.id}`)}
            />
          ))}
        </div>
      )}
      {!loading && (

      <div className="flex justify-center">
        <button
          onClick={() => setPage(page + 1)}
          className="mb-10 px-12 py-2 bg-black text-white rounded-[6px] hover:bg-gray-800 disabled:opacity-50"
        >
          Load More
        </button>
      </div>
      )}
    </div>
  );
};

export default CollectionGallery;
