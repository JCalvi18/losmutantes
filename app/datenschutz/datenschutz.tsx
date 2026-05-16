"use client";

import { useLanguage } from "@/app/i18n/LanguageContext";

export default function Datenschutz() {
  const { t } = useLanguage();
  const d = t.datenschutz;

  return (
    <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-12 max-w-2xl flex flex-col gap-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600">{d.title}</h1>

      <div className="flex flex-col gap-6 text-white">
        <div>
          <h2 className="font-semibold text-lg mb-1">{d.controller_title}</h2>
          <p>{d.controller_body}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{d.data_title}</h2>
          <p>{d.data_body}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{d.purpose_title}</h2>
          <p>{d.purpose_body}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{d.storage_title}</h2>
          <p>{d.storage_body}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{d.rights_title}</h2>
          <p>{d.rights_body}</p>
        </div>
      </div>
    </section>
  );
}
