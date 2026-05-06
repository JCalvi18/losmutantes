"use client";

import Link from "next/link";
import Image from "next/image"
import { Separator } from "@heroui/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "./i18n/LanguageContext";
import { SHOWS } from "@/lib/shows";
import { LaberintoTheme } from "@/lib/laberinto/laberinto-theme";
import { ASSETS } from "@/lib/assets";
import MazeBackground from "@/lib/laberinto/maze";

function PlaceDate({
  city,
  date,
  theater,
  mapsUrl,

}: {
  city: string
  date: string
  theater: string
  mapsUrl: string
}) {

  const row = "flex flex-row items-center gap-2"

  return (
    <li key={city} className="flex flex-col items-center justify-center gap-2">
      <Separator className="my-4 " />
      <div className={`${row} text-[var(--lb-orange)]`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
        </svg>

        <span>{city}</span>
      </div>
      <div className={`${row} text-[var(--lb-yellow)]`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>

        <Link href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline sm:no-underline sm:hover:underline active:opacity-60 transition-opacity">
          <span className="font-medium">{theater}</span>
          <ArrowTopRightOnSquareIcon className="size-4 shrink-0" />
        </Link>
      </div>
      <div className={`${row} text-[var(--lb-blue)]`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        <span className="font-medium">{date}</span>
      </div>
    </li>
  )
}

function Home() {
  const { t } = useLanguage();

  // const [introSeen, setIntroSeen] = useState<boolean>(true);
  // const [galleryImages, setGalleryImages] = useState<{ src: string; alt?: string }[]>([]);

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const res = await fetch("/api/selected-images", { cache: "no-store" });
  //       if (!res.ok) return;
  //       const data = await res.json();
  //       if (Array.isArray(data?.images)) setGalleryImages(data.images);
  //     } catch { }
  //   };
  //   fetchImages();
  // }, []);


  return (
    <LaberintoTheme>
      <MazeBackground />
      <section className="
      container mx-auto
      flex flex-col gap-6 flex-1
      max-w-3xl items-center
      px-4 sm:px-6 md:px-8 py-8
      text-[var(--lb-yellow)] text-lg sm:text-xl md:text-2xl
      bg-[var(--lb-background)]/80
      font-bebas
      ">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-russo text-[var(--lb-orange)]">{t.home.season}</h2>

        <Image
          src={ASSETS.laberintoTitulo}
          alt="Band poster"
          width={800}
          height={900}
          sizes="(max-width: 1024px) 100vw, 768px"
          className="w-full h-auto object-contain"
          priority
        />

        <div className="container mx-auto flex flex-col items-center">
          <p className="text-xl sm:text-2xl md:text-3xl">{t.home.authors}</p>
        </div>


        <p>{t.home.description1}</p>


        <p>
          <span className="text-[var(--lb-orange)]">
            {"LOS MUTANTES "}
          </span>

          {t.home.description2}
        </p>

        <p className="leading-relaxed">{t.home.description3}</p>

        <div className="flex flex-col sm:flex-col gap-8 items-center">
          <Link
            href="/about"
            className="border border-[var(--lb-yellow)] text-[var(--lb-yellow)] px-6 py-2 hover:bg-[var(--lb-yellow)] hover:text-[var(--lb-background)] transition-colors"
          >
            {t.home.cta}
          </Link>
          <Link
            href="/tickets"
            className="border rounded-xl border-[var(--lb-orange)] bg-[var(--lb-orange)] text-[var(--lb-background)] px-6 py-2 hover:opacity-80 transition-opacity"
          >
            {t.nav.tickets}
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-[var(--lb-orange)] text-3xl sm:text-3xl md:text-5xl mb-2">{t.home.dates_title}</h3>
          <ul className="space-y-2">
            {SHOWS.map(({ city, date, theater, link }) => {
              const theaterDisplay = theater === "university" ? t.home.university : theater;
              return (
                <PlaceDate key={`${date}-${city}`} city={city} theater={theaterDisplay} date={date} mapsUrl={link} />
              );
            })}
          </ul>
        </div>
      </section>
    </LaberintoTheme>
  );
}

export default Home;
