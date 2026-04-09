"use client";

import { HeroUIProvider } from "@heroui/react";
import { ReactNode } from "react";
import { LanguageProvider } from "./i18n/LanguageContext";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </HeroUIProvider>
  );
}


