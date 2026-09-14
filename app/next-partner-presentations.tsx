"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./i18n/LanguageContext";
import { PARTNER_SHOWS } from "@/lib/partnerShows";

function NextPartnerPresentations() {
  const { t, language } = useLanguage();

  const today = new Date()
    .toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" })
    .split("T")[0];

  const upcoming = PARTNER_SHOWS
    .filter((s) => s.isoDate >= today)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  return (
    <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl text-white">
      <h2 className="text-2xl sm:text-3xl font-bold">{t.partnerPresentations.title}</h2>
      <p className="text-base leading-relaxed">{t.partnerPresentations.intro}</p>

      {upcoming.length === 0 ? (
        <p className="text-base leading-relaxed text-slate-400">{t.partnerPresentations.empty}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {upcoming.map((show) => (
            <div
              key={`${show.group}-${show.isoDate}`}
              className="flex flex-col gap-4 rounded-lg border border-slate-700 p-4 sm:flex-row"
            >
              {show.imageUrl && (
                <Image
                  src={show.imageUrl}
                  alt={show.showTitle}
                  width={300}
                  height={400}
                  className="w-full sm:w-40 h-auto object-contain flex-shrink-0"
                />
              )}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{show.showTitle}</h3>
                <p className="text-slate-300">{show.group}</p>
                <p>
                  <span className="font-semibold">{t.partnerPresentations.date_label}: </span>
                  {show.date}
                </p>
                <p>
                  <span className="font-semibold">{t.partnerPresentations.venue_label}: </span>
                  {show.venue}, {show.city}
                </p>
                <p className="text-base leading-relaxed">{show.description[language]}</p>
                <Link
                  href={show.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-300 w-fit"
                >
                  {t.partnerPresentations.info_link}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default NextPartnerPresentations;
