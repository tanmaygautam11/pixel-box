"use client";
import React, { useEffect, useState } from "react";
import { fetchCollections } from "@/lib/unsplash";
import CollectionCard from "@/components/CollectionCard";
import { UnsplashCollection } from "@/types/unsplash";

const CollectionGallery = () => {
  const [collections, setCollections] = useState<UnsplashCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const loadCollections = async () => {
      const newCollections = await fetchCollections(12, page, collections);

      if (newCollections) {
        setCollections((prevCollections) => {
          const updatedCollections = [...prevCollections, ...newCollections];

          // Ensure collections are unique by ID
          const uniqueCollections = Array.from(
            new Map(updatedCollections.map((coll) => [coll.id, coll])).values()
          );

          return uniqueCollections;
        });
      }

      setLoading(false);
    };

    loadCollections();
  }, [page, collections]);

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
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-8 my-8">
          {collections.map((coll) => (
            <CollectionCard
              key={`${coll.id}-${coll.title}`}
              id={coll.id}
              title={coll.title}
              coverPhotoUrl={coll.cover_photo.urls.small}
              totalPhotos={coll.total_photos}
            />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={() => setPage(page + 1)}
          className="mb-10 px-12 py-2 bg-black text-white rounded-[6px] hover:bg-gray-800 disabled:opacity-50"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default CollectionGallery;
