import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { fetchRandomWallpapers } from "../lib/unsplash";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

const InfiniteCarousel = () => {
  const [images, setImages] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resetWidth, setResetWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
    const storedImages = localStorage.getItem("wallpaperImages");
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    } else {
      const loadImages = async () => {
        const fetchedImages = await fetchRandomWallpapers(10);
        if (Array.isArray(fetchedImages)) {
          const newImages = fetchedImages
            .map((img) => img?.urls?.regular)
            .filter(Boolean) as string[];
          setImages(newImages);
          localStorage.setItem("wallpaperImages", JSON.stringify(newImages));
        }
      };
      loadImages();
    }
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setResetWidth(containerRef.current.offsetWidth / 2);
    }
  }, [images, mounted]);

  // Speed (pixels per second)
  const speed = 120;

  useAnimationFrame((time, delta) => {
    if (!paused && resetWidth > 0) {
      const moveBy = (speed * delta) / 1000;
      let newX = x.get() - moveBy;
      if (newX <= -resetWidth) {
        newX += resetWidth;
      }
      x.set(newX);
    }
  });

  if (!mounted) return null;

  return (
    <div
      className="overflow-hidden w-full relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        ref={containerRef}
        className="flex space-x-4 w-max"
        style={{ x, whiteSpace: "nowrap" }}
      >
        {[...images, ...images].map((src, index) => (
          <motion.div
            key={index}
            className="w-[250px] h-[200px] shadow-md flex-shrink-0 transform transition-transform duration-300 hover:scale-105 sm:w-[300px] sm:h-[250px] md:w-[400px] md:h-[300px]"
          >
            <Image
              src={src}
              alt={`Wallpaper ${index + 1}`}
              className="rounded-[6px] w-full h-full object-cover"
              width={400}
              height={300}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteCarousel;
