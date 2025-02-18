import Image from "next/image";
import HeroLeft from "../../../public/images/hero-left.png";
import HeroRight from "../../../public/images/hero-right.png";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { fetchImages } from "../../lib/unsplash";

type UnsplashImage = {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
};

const Home = () => {
  const [images, setImages] = useState<UnsplashImage[]>([]);

  const handleSearch = async (query: string) => {
    const results = await fetchImages(query);
    if (results) setImages(results);
  };

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full mt-16">
        <div className="relative w-[400px] h-[600px] mt-10">
          <Image src={HeroLeft} alt="hero image" fill />
        </div>
        <div className="text-center flex flex-col gap-2 w-2/5 mb-32">
          <h1 className="text-4xl text-black-100 font-semibold">Search</h1>
          <p className="text-md text-gray-200">
            Search high-resolution images from Unsplash
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="relative w-[400px] h-[600px] mt-10">
          <Image src={HeroRight} alt="hero image" fill />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {images.map((img) => (
          <div key={img.id} className="relative w-64 h-40">
            <Image
              src={img.urls.small}
              alt={img.alt_description}
              layout="fill"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
