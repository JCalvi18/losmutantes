"use client";

import React, { useEffect, useState } from "react";
import Carrousel from "./carrousel";
import { IntroSeen } from "./animation";
import Image from "next/image";
import Link from "next/link";
import { Button, Divider } from "@heroui/react";

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
        </svg>

        <span className="font-medium">{city}</span>
      </div>
      <div className={row}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>

        <Link href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-center hover:underline">
          <span className="font-medium">{theater}</span>
        </Link>
      </div>
      <div className={row}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        <span className="font-medium">{date}</span>
      </div>
    </li>
  )
}

function Home() {
  const [introSeen, setIntroSeen] = useState<boolean>(true);
  const [galleryImages, setGalleryImages] = useState<{ src: string; alt?: string }[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/selected-images", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.images)) setGalleryImages(data.images);
      } catch { }
    };
    fetchImages();
  }, []);

  if (introSeen) {
    return (
      <IntroSeen handleEnter={() => setIntroSeen(false)} />
    );
  }

  return (
    <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl items-center">
      <h2 className="text-2xl sm:text-3xl font-bold">Tour 2025</h2>
      <p className="text-base leading-relaxed">
        La Divina Tragedia de Tomás Afán Muñoz (título original: La Divina Tragedia o La Maldita Comedia) es una parodia de la guerra. El drama se desarrolla en medio de una crisis política, el Ministerio de Defensa evalúa hacia dónde puede llevar la democracia. Los asesores barajan las cartas de las tiranías y descubren sus recursos naturales. Debido al número de votantes afines, se declara un ataque sorpresa contra el infierno. Sin embargo, esta guerra se dirige contra los intereses empresariales celestiales y conduce a una alianza sin precedentes entre el cielo y el infierno.
      </p>

      <Image
        src="/poster.jpg"
        alt="Band poster"
        width={1600}
        height={900}
        sizes="(max-width: 1024px) 100vw, 768px"
        className="w-full h-auto object-contain"
        priority
      />

      <p className="text-base leading-relaxed">
        La obra muestra varios géneros (sátira política, fantasía y alegoría teológica…) se narra la lucha eterna entre el bien y el mal, adentrándonos en un ámbito sobrenatural, pero en esencia se explora temas absolutamente mundanos y terrenales. ¿Qué papel juega la democracia en un mundo donde el cielo y el infierno están aliados?
      </p>


      <Carrousel images={galleryImages} className="w-full" />



      <Button as={Link} href="/lamalditacomedia" variant="bordered" size="lg" className="flex font-bold text-white bg-red-800 p-6 justify-center w-64 rounded-xl align-self-center">Conoce más sobre la Obra</Button>

      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-2">Fechas y lugares</h3>
        <ul className="space-y-2">
          {[
            { city: "Saarbrücken (Prueba General)", theater: "Universidad del Saarland", date: "7 Oct -- 6:00 PM", query: "Saarland University" },
            { city: "Sogamoso", theater: "Teatro Sogamoso", date: "14 Oct -- 6:00 PM", query: "Teatro Sogamoso" },
            { city: "Bogotá", theater: "Universida Pedagógica Nacional", date: "16 Oct -- 4:00 PM", query: "Saarland University" },
            { city: "Manizales", theater: "XX Festival FITU", date: "23 Oct -- 3:00PM", query: "Saarland University" },

          ].map(({ city, date, theater, query }) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            return (
              <PlaceDate key={`${city}`} city={city} theater={theater} date={date} mapsUrl={mapsUrl} />
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Home;


