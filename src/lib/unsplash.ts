import { UnsplashImage } from "@/components/ImageGallery";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  throw new Error("Missing Unsplash Access Key in environment variables");
}

export const fetchImages = async (
  query: string,
  count: number = 30,
  page: number = 1,
  existingImages: UnsplashImage[] = []
) => {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&page=${page}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        Accept: "application/json",
        "Accept-Version": "v1",
      },
    });

    if (response.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch images from Unsplash: ${errorText}`);
    }

    const data = await response.json();
    const existingIds = new Set(existingImages.map((img) => img.id));
    const uniqueImages = data.results.filter(
      (img: UnsplashImage) => !existingIds.has(img.id)
    );

    return uniqueImages;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return null;
  }
};

export const fetchRandomWallpapers = async (count: number = 5) => {
  try {
    const url = `https://api.unsplash.com/photos/random?count=${count}&query=wallpaper&orientation=landscape`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        Accept: "application/json",
        "Accept-Version": "v1",
      },
    });

    if (response.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch wallpapers from Unsplash: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wallpapers from Unsplash:", error);
    return null;
  }
};

export const fetchAllImages = async (
  query: string,
  searchCount: number = 30,
  wallpaperCount: number = 5,
  page: number = 1,
  existingImages: UnsplashImage[] = []
) => {
  try {
    const [searchResults, randomWallpapers] = await Promise.all([
      fetchImages(query, searchCount, page, existingImages),
      fetchRandomWallpapers(wallpaperCount),
    ]);

    const newImages = [...(searchResults ?? []), ...(randomWallpapers ?? [])];
    const existingIds = new Set(existingImages.map((img) => img.id));
    const uniqueNewImages = newImages.filter((img) => !existingIds.has(img.id));

    return uniqueNewImages;
  } catch (error) {
    console.error("Error fetching all images:", error);
    return null;
  }
};
export const fetchPhotoDetails = async (photoId: string) => {
  try {
    const url = `https://api.unsplash.com/photos/${photoId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        Accept: "application/json",
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch photo details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching photo details:", error);
    return null;
  }
};
