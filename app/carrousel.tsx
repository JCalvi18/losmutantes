"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";

type CarrouselImage = {
  src: string;
  alt?: string;
};

type CarrouselProps = {
  images: CarrouselImage[];
  autoPlay?: boolean;
  intervalMs?: number;
  className?: string;
};

export function Carrousel({
  images,
  autoPlay = true,
  intervalMs = 4000,
  className,
}: CarrouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const numImages = images.length;
  const isEmpty = numImages === 0;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (isEmpty) return;
      const normalized = ((nextIndex % numImages) + numImages) % numImages;
      setCurrentIndex(normalized);
    },
    [isEmpty, numImages]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (!autoPlay || isEmpty) return;
    const id = setInterval(() => {
      setCurrentIndex((idx) => ((idx + 1) % numImages + numImages) % numImages);
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, intervalMs, isEmpty, numImages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = useMemo(() => images[currentIndex], [images, currentIndex]);

  if (isEmpty) {
    return (
      <div className={className}>
        <div className="w-full aspect-video relative rounded-lg overflow-hidden border flex items-center justify-center text-sm opacity-70">
          No images to display
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="w-full aspect-video relative rounded-lg overflow-hidden border">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt ?? "Gallery image"}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover bg-background"
          priority
        />

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/0 via-black/0 to-black/0" />

        <div className="absolute inset-y-0 left-0 flex items-center p-2">
          <Button
            size="sm"
            radius="full"
            variant="flat"
            className="pointer-events-auto bg-background/70"
            onPress={prev}
            aria-label="Previous image"
          >
            ◀
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center p-2">
          <Button
            size="sm"
            radius="full"
            variant="flat"
            className="pointer-events-auto bg-background/70"
            onPress={next}
            aria-label="Next image"
          >
            ▶
          </Button>
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => {
            const active = i === currentIndex;
            return (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => goTo(i)}
                className={
                  "h-2.5 w-2.5 rounded-full transition-opacity " +
                  (active ? "bg-foreground opacity-100" : "bg-foreground/40 opacity-60 hover:opacity-90")
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Carrousel;


