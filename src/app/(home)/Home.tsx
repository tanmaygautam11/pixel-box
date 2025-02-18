import { useEffect, useState } from "react";
import Image from "next/image";
import HeroLeft from "../../../public/images/hero-left.png";
import HeroRight from "../../../public/images/hero-right.png";
import SearchBar from "@/components/SearchBar";

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search/${query}`;
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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
          <SearchBar initialQuery="" onSearch={handleSearch} />
        </div>
        <div className="relative w-[400px] h-[600px] mt-10">
          <Image src={HeroRight} alt="hero image" fill />
        </div>
      </div>
    </section>
  );
};

export default Home;
