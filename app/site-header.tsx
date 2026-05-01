"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLanguage, Language } from "./i18n/LanguageContext";

const LANGUAGES: Language[] = ["es", "en", "de"];

export default function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/archivo", label: t.nav.archive },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="w-full bg-white border-b text-black">
      {/* ── Mobile header ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        {/* Burger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Logo + title stacked */}
        <div className="flex flex-col items-center gap-1">
          <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
          <h1 className="text-lg font-semibold tracking-wide text-black">
            Los Mutantes
          </h1>
        </div>

        {/* Language dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border text-sm font-medium hover:bg-gray-100"
          >
            {language.toUpperCase()}
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-md z-50 overflow-hidden">
              {LANGUAGES.filter((l) => l !== language).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setLangOpen(false); }}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-2 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-base rounded-lg hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      {/* ── Desktop header ── */}
      <div className="hidden md:flex max-w-full mx-auto px-4 py-6 items-center">
        <div className="w-1/3" />
        <div className="w-1/3 flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-black">
              Los Mutantes
            </h1>
          </div>
          <div className="w-full flex flex-row items-center justify-center gap-3 mt-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-lg text-black hover:bg-gray-100 rounded-lg"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-1/3 flex justify-end">
          <div className="flex gap-1">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant="ghost"
                onPress={() => setLanguage(lang)}
                className={`text-xs uppercase min-w-0 px-2 ${language === lang ? "bg-red-600 text-black font-bold hover:bg-red-700" : ""}`}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
