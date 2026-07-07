"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"
import { useLanguage } from "./i18n/LanguageContext";
import { LaberintoTheme } from "@/lib/laberinto/laberinto-theme";
import { ASSETS } from "@/lib/assets";
import MazeBackground from "@/lib/laberinto/maze";
import Carrousel from "./carrousel";
import { useGalleryImages } from "./hooks/useGalleryImages";

function Home() {
  const { t } = useLanguage();


  const sponsorImages = useGalleryImages("laberinto/sponsors");
  const galleryImages = useGalleryImages("laberinto/presentations");

  // Maze finishes at 2000ms. Background fades in at 2800ms (800ms buffer),
  // content elements follow sequentially every ~250ms starting at 3100ms (+1s vs before).
  const delay = (ms: number, duration?: number): React.CSSProperties => ({
    animationDelay: `${ms}ms`,
    ...(duration !== undefined && { animationDuration: `${duration}ms` }),
  });

  return (
    <LaberintoTheme>
      <MazeBackground />

      {/* Background overlay — animates independently so opacity can be staggered */}
      <div
        className="lb-fade-in fixed inset-0 -z-[5] bg-[var(--lb-background)]/80 pointer-events-none"
        style={delay(2800, 1400)}
        aria-hidden="true"
      />

      <section className="
      container mx-auto
      flex flex-col gap-6 flex-1
      max-w-3xl items-center
      px-4 sm:px-6 md:px-8 py-8
      text-[var(--lb-yellow)] text-lg sm:text-xl md:text-2xl
      font-bebas
      ">
        <h2
          className="lb-fade-in text-xl sm:text-2xl md:text-3xl font-russo text-[var(--lb-orange)]"
          style={delay(4100)}
        >
          {t.home.season}
        </h2>

        <Image
          src={ASSETS.laberintoTitulo}
          alt="Band poster"
          width={800}
          height={900}
          sizes="(max-width: 1024px) 100vw, 768px"
          className="lb-fade-in w-full h-auto object-contain"
          style={delay(4350)}
          priority
        />

        <div
          className="lb-fade-in container mx-auto flex flex-col items-center"
          style={delay(4600)}
        >
          <p className="text-xl sm:text-2xl md:text-3xl">{t.home.authors}</p>
        </div>

        <p className="lb-fade-in" style={delay(4850)}>{t.home.description1}</p>

        <p className="lb-fade-in" style={delay(4100)}>
          <span className="text-[var(--lb-orange)]">{"LOS MUTANTES "}</span>
          {t.home.description2}
        </p>

        <p className="lb-fade-in leading-relaxed" style={delay(4350)}>{t.home.description3}</p>

        <p className="lb-fade-in leading-relaxed text-[var(--lb-blue)]" style={delay(4350)}>{t.home.subtitles}</p>

        <div className="lb-fade-in flex flex-col sm:flex-col gap-8 items-center" style={delay(4600)}>
          <Link
            href="/laberinto"
            className="border border-[var(--lb-yellow)] text-[var(--lb-yellow)] px-6 py-2 hover:bg-[var(--lb-yellow)] hover:text-[var(--lb-background)] transition-colors"
          >
            {t.home.cta}
          </Link>
          {/* <Link
            href="/tickets"
            className="border rounded-xl border-[var(--lb-orange)] bg-[var(--lb-orange)] text-[var(--lb-background)] px-6 py-2 hover:opacity-80 transition-opacity"
          >
            {t.nav.tickets}
          </Link> */}
        </div>

        <div className="lb-fade-in flex flex-col items-center text-center" style={delay(4850)}>
          <h3 className="text-[var(--lb-orange)] text-3xl sm:text-3xl md:text-5xl mb-2">{t.home.break_title}</h3>
          <h4 className="text-[var(--lb-yellow)] text-xl sm:text-2xl md:text-3xl">{t.home.thanks_title}</h4>
        </div>

        <div className="lb-fade-in flex flex-col items-center w-full gap-4" style={delay(5100)}>
          <h3 className="text-[var(--lb-orange)] text-3xl sm:text-3xl md:text-5xl">{t.home.gallery_title}</h3>
          <Carrousel images={galleryImages} className="w-full" />
        </div>

      </section>

      <div className="mt-32 lb-fade-in flex flex-col items-center gap-24 w-full text-[var(--lb-yellow)] font-bebas" style={delay(5100)}>
        <h3 className="text-[var(--lb-orange)] text-3xl sm:text-3xl md:text-5xl">{t.sponsors.title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center w-full px-12">
          {sponsorImages.map(({ src, alt }) =>
            <Image
              key={src}
              src={src}
              alt={alt as string}
              width={120}
              height={120}
              sizes="(max-width: 640px) 50vw, 17vw"
              className="w-3/4 h-auto object-contain mx-auto bg-white"
              priority
            />
          )}
        </div>
      </div>
    </LaberintoTheme>
  );
}

export default Home;
