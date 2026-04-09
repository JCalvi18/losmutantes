"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, Button } from "@heroui/react";
import { useLanguage, Language } from "./i18n/LanguageContext";

const LANGUAGES: Language[] = ["es", "en", "de"];

export default function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Navbar maxWidth="full" className="bg-white border-b py-4 md:py-6 text-black">
      <NavbarContent justify="start" className="w-1/3" />
      <NavbarContent justify="center" className="w-1/3 flex-col items-center gap-2 text-center">
        <NavbarBrand className="gap-3 items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-black text-center">Los Mutantes</h1>
        </NavbarBrand>
        <div className="w-full flex flex-row sm:flex-column items-center justify-center gap-3 mt-2 w-full text-center">
          <Button as={Link} href="/" variant="flat" size="lg" className="text-black">{t.nav.home}</Button>
          <Button as={Link} href="/archivo" variant="flat" size="lg" className="text-black">{t.nav.archive}</Button>
          <Button as={Link} href="/about" variant="flat" size="lg" className="text-black">{t.nav.about}</Button>
          <Button as={Link} href="/tickets" variant="flat" size="lg" className="text-black font-semibold">{t.nav.tickets}</Button>
        </div>
      </NavbarContent>
      <NavbarContent justify="end" className="w-1/3">
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <Button
              key={lang}
              size="sm"
              variant={language === lang ? "solid" : "flat"}
              onPress={() => setLanguage(lang)}
              className="text-xs uppercase min-w-0 px-2 text-black"
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      </NavbarContent>
    </Navbar>
  );
}


