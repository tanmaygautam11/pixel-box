import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import InfiniteCarousel from "../../components/InfiniteCarousel";

const Landing = () => {
  return (
    <>
      <section className="flex justify-center items-center h-[50%] flex-col">
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
      </section>
      <section>
        <InfiniteCarousel />
      </section>
    </>
  );
};

export default Landing;
