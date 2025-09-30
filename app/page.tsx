"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { IntroSeen } from "./animation";

function Home() {
  const [introSeen, setIntroSeen] = useState<boolean>(true);
    

  if (introSeen) {
    return (
      <IntroSeen handleEnter={()=>setIntroSeen(false)} />
    );
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <Navbar maxWidth="full" className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b py-4 md:py-6">
        <NavbarContent justify="start">
          <NavbarBrand className="gap-2">
            <Image
              src="/globe.svg"
              alt="Logo"
              width={28}
              height={28}
              priority
            />
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide">Los Mutantes</h1>
        </NavbarContent>
        <NavbarContent justify="end" />
      </Navbar>

      <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold">Tour 2025</h2>
        <p className="text-base leading-relaxed">
          Bienvenido a la experiencia de Los Mutantes. Nuestra mezcla de ritmos y
          energía en vivo llega a nuevas ciudades este año. Acompáñanos en un
          recorrido que no olvidarás.
        </p>

        <div className="w-full aspect-video relative rounded-lg overflow-hidden border">
          <Image
            src="/window.svg"
            alt="Band performing"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain bg-background"
            priority
          />
        </div>

        <p className="text-base leading-relaxed">
          Escucha nuestros últimos lanzamientos y únete a la comunidad. Nos
          encanta ver nuevas caras en cada show.
        </p>

        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">Fechas y lugares</h3>
          <ul className="space-y-2">
            {[
              { city: "Madrid", date: "12 Oct 2025" },
              { city: "Barcelona", date: "18 Oct 2025" },
              { city: "Valencia", date: "25 Oct 2025" },
              { city: "Sevilla", date: "01 Nov 2025" },
            ].map(({ city, date }) => (
              <li key={city} className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className="text-center"><span className="font-medium">{city}</span> — {date}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t mt-8">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-6 flex flex-col items-center gap-3">
          <span className="text-sm opacity-80">Los Mutantes</span>
          <div className="flex items-center justify-center gap-6">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook" title="Facebook" className="opacity-90 hover:opacity-100 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22 12.06C22 6.49 17.52 2 11.94 2 6.37 2 1.88 6.49 1.88 12.06c0 4.97 3.63 9.09 8.38 9.94v-7.03H7.9v-2.91h2.36v-2.22c0-2.34 1.39-3.63 3.52-3.63 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.17 0-1.53.73-1.53 1.48v1.89h2.61l-.42 2.91h-2.19V22c4.75-.85 8.38-4.97 8.38-9.94Z"/>
              </svg>
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram" title="Instagram" className="opacity-90 hover:opacity-100 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-6.5 2A3 3 0 1 1 12 15a3 3 0 0 1 0-6Z"/>
              </svg>
            </Link>
            <Link href="https://tiktok.com" target="_blank" aria-label="TikTok" title="TikTok" className="opacity-90 hover:opacity-100 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16 2a6.9 6.9 0 0 0 0 1.5c.21 2.07 1.9 3.88 3.97 4.14.35.05.7.05 1.03.05V11a8.33 8.33 0 0 1-5-1.74v6.02A6.73 6.73 0 1 1 9.5 8.7V11a3.84 3.84 0 1 0 2.5 3.6V2h4Z"/>
              </svg>
            </Link>
          </div>
          <p className="text-xs opacity-80 text-center">Síguenos en redes para novedades y preventas</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
