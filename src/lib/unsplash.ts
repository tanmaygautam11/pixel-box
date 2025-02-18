const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  throw new Error("Missing Unsplash Access Key in environment variables");
}

/**
 * Fetch images from Unsplash based on a search query.
 * @param query - The search term for images.
 * @param count - Number of images to fetch.
 * @returns An array of Unsplash photo objects or null on error.
 */
export const fetchImages = async (query: string, count: number = 10) => {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&orientation=landscape`;
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
