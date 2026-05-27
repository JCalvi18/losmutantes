import { useEffect, useState } from "react";

export function useGalleryImages(prefix: string) {
  const [images, setImages] = useState<{ src: string; alt?: string }[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `/api/getMCimages?prefix=${encodeURIComponent(prefix)}`,
          { cache: "force-cache" }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.images)) setImages(data.images);
      } catch {}
    };
    fetchImages();
  }, [prefix]);

  return images;
}
