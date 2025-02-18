import { UnsplashImage } from "@/components/ImageGallery";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  throw new Error("Missing Unsplash Access Key in environment variables");
}

/**
 * Fetch images from Unsplash based on a search query with pagination.
 * @param query - The search term for images.
 * @param count - Number of images to fetch.
 * @param page - Page number to fetch different images.
 * @returns An array of Unsplash photo objects or null on error.
 */
export const fetchImages = async (
  query: string,
  count: number = 30,
  page: number = 1
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
    return data.results;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return null;
  }
};

/**
 * Fetch multiple random wallpapers from Unsplash.
 * @param count - The number of wallpapers to fetch.
 * @returns An array of Unsplash photo objects or null on error.
 */
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

/**
 * Fetches images from Unsplash while avoiding duplicates when loading more.
 *
 * @param query - The search term to use with fetchImages.
 * @param searchCount - Number of images to fetch per page (default: 30).
 * @param wallpaperCount - Number of random wallpapers to fetch (default: 5).
 * @param page - The current page number for pagination.
 * @param existingImages - Already loaded images to prevent duplication.
 * @returns A combined array of new Unsplash photo objects.
 */
export const fetchAllImages = async (
  query: string,
  searchCount: number = 30,
  wallpaperCount: number = 5,
  page: number = 1,
  existingImages: UnsplashImage[] = []
) => {
  try {
    const [searchResults, randomWallpapers] = await Promise.all([
      fetchImages(query, searchCount, page),
      fetchRandomWallpapers(wallpaperCount),
    ]);

    const newImages = [...(searchResults ?? []), ...(randomWallpapers ?? [])];

    // Create a Set of already existing image IDs for uniqueness check
    const existingIds = new Set(existingImages.map((img) => img.id));

    // Filter out already existing images to ensure no duplicates
    const uniqueNewImages = newImages.filter((img) => !existingIds.has(img.id));

    // Return unique new images
    return uniqueNewImages;
  } catch (error) {
    console.error("Error fetching all images:", error);
    return null;
  }
};
