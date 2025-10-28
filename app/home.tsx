"use client";

import Link from "next/link";
import { Divider } from "@heroui/react";

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
      <Divider className="my-4" />
      <div className={row}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
        </svg>

        <span className="font-medium">{city}</span>
      </div>
      <div className={row}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>

        <Link href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-center hover:underline">
          <span className="font-medium">{theater}</span>
        </Link>
      </div>
      <div className={row}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        <span className="font-medium">{date}</span>
      </div>
    </li>
  )
}

function Home() {
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
    <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl items-center">
      <h2 className="text-2xl sm:text-3xl font-bold">Noche Informativa</h2>
      <p className="text-base leading-relaxed">
        Si vives en Saarbrücken y alguna vez soñaste con hacer teatro en español?
      </p>
      {/* 
      <Image
        src="/poster.jpg"
        alt="Band poster"
        width={1600}
        height={900}
        sizes="(max-width: 1024px) 100vw, 768px"
        className="w-full h-auto object-contain"
        priority
      /> */}

      <p className="text-base leading-relaxed">
        Tal vez para reconectarte con tus raíces, practicar el idioma o simplemente compartir con gente increíble que se atreve a hacer cosas loquísimas (como irse de gira por Latinoamérica o presentarse en festivales internacionales , además de preparar una obra distinta, cada año para el público del Saarland y del mundo!)
      </p>

      <p className="text-base leading-relaxed">
        No necesitas registrarte. ¡solo ven con curiosidad y muchas ganas!
      </p>

      <p className="text-base leading-relaxed">
        Únete al mejor grupo de teatro en español de Alemania Te esperamos ❤️
      </p>

      <h3 className="text-xl font-semibold mb-2">Fecha y lugar</h3>
      <PlaceDate key={'uniqueKey'} city={"Saarbrücken"} theater={"Universidad del Saarland"} date={'Martes 4 de noviembre 2025'} mapsUrl={"https://maps.app.goo.gl/hHZgWYLw6xKoWy2P9"} />

      {/* <Carrousel images={galleryImages} className="w-full" /> */}

    </section>
  );
}

export default Home;


