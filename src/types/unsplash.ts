export interface UnsplashCollection {
  id: string;
  title: string;
  cover_photo: {
    urls: {
      small: string;
    };
  };
  total_photos: number;
}
