import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { fetchRandomWallpapers } from "../../lib/unsplash";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

const Landing = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      // Fetch 10 images in one request
      const fetchedImages = await fetchRandomWallpapers(10);

      // Ensure fetchedImages is an array before mapping over it
      if (Array.isArray(fetchedImages)) {
        setImages(
          fetchedImages
            .map((img) => img?.urls?.regular)
            .filter(Boolean) as string[]
        );
      } else if (fetchedImages && fetchedImages.urls) {
        // Handle the case when only a single image is returned
        setImages([fetchedImages.urls.regular]);
      }
    };

    loadImages();
  }, []);

  return (
    <section className="flex justify-center items-center h-[60%] flex-col">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-5xl font-semibold">
          Welcome to the Ultimate Wallpaper Collection
        </h1>
        <p className="text-lg w-4/5 text-center">
          Discover stunning wallpapers for your desktop, phone, or tablet.
          Browse through thousands of high-quality images to find the perfect
          background for your device.
        </p>
        <Button className="bg-black-100 rounded-[6px] w-max hover:bg-gray-200">
          <Link href="/sign-in" className="text-secondary">
            Get Started
            <FontAwesomeIcon icon={faArrowRight} size="lg" className="pl-1" />
          </Link>
        </Button>
      </div>
      <Carousel className="w-full max-w-4xl">
        {images.map((src, index) => (
          <CarouselItem key={index} className="flex justify-center">
            <Image
              src={src}
              alt={`Wallpaper ${index + 1}`}
              className="rounded-lg w-full h-auto"
              width={800}
              height={600}
            />
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
};

export default Landing;
