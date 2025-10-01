"use client";

import React, { useEffect, useState } from "react";
import Carrousel from "./carrousel";
import { IntroSeen } from "./animation";
import Image from "next/image";
import Link from "next/link";

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
    <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl">
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
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-2">Fechas y lugares</h3>
        <ul className="space-y-2">
          {[
            { city: "Sogamoso", theater: "Teatro Sogamoso", date: "14 Oct -- 6:00 PM", query: "Teatro Sogamoso" },
            { city: "Bogotá", theater: "Universida Pedagógica Nacional", date: "16 Oct -- 4:00 PM", query: "Saarland University" },
            { city: "Manizales", theater: "XX Festival FITU", date: "23 Oct -- 3:00PM", query: "Saarland University" },

          ].map(({ city, date, theater, query }) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            return (
              <li key={city} className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="font-medium">{city}</span>

                <Link href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-center hover:underline">
                  <span className="font-medium">{theater}</span>
                </Link>

                <span className="font-medium">{date}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Home;


