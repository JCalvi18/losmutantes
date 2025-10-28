"use client";

import React from "react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-6 flex flex-col items-center gap-3">
        <span className="text-sm opacity-80">Los Mutantes</span>
        <div className="flex items-center justify-center gap-6">
          <Link href="mailto:info@losmutantes.de" target="_blank" aria-label="Email" title="Email" className="opacity-90 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
          </Link>
          <Link href="https://www.facebook.com/losmutantes" target="_blank" aria-label="Facebook" title="Facebook" className="opacity-90 hover:opacity-100 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M22 12.06C22 6.49 17.52 2 11.94 2 6.37 2 1.88 6.49 1.88 12.06c0 4.97 3.63 9.09 8.38 9.94v-7.03H7.9v-2.91h2.36v-2.22c0-2.34 1.39-3.63 3.52-3.63 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.17 0-1.53.73-1.53 1.48v1.89h2.61l-.42 2.91h-2.19V22c4.75-.85 8.38-4.97 8.38-9.94Z" />
            </svg>
          </Link>
          <Link href="https://www.instagram.com/losmutantesteatro" target="_blank" aria-label="Instagram" title="Instagram" className="opacity-90 hover:opacity-100 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-6.5 2A3 3 0 1 1 12 15a3 3 0 0 1 0-6Z" />
            </svg>
          </Link>
          <Link href="https://www.tiktok.com/@los.mutantes1" target="_blank" aria-label="TikTok" title="TikTok" className="opacity-90 hover:opacity-100 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M16 2a6.9 6.9 0 0 0 0 1.5c.21 2.07 1.9 3.88 3.97 4.14.35.05.7.05 1.03.05V11a8.33 8.33 0 0 1-5-1.74v6.02A6.73 6.73 0 1 1 9.5 8.7V11a3.84 3.84 0 1 0 2.5 3.6V2h4Z" />
            </svg>
          </Link>
        </div>
        <p className="text-xs opacity-80 text-center">Síguenos en redes para novedades</p>
      </div>
    </footer>
  );
}


