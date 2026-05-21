"use client";

import { useLanguage } from "@/app/i18n/LanguageContext";

export default function Impressum() {
  const { t } = useLanguage();
  const i = t.impressum;

  return (
    <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-12 max-w-2xl flex flex-col gap-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600">{i.title}</h1>

      <div className="flex flex-col gap-6 text-white">
        <div>
          <h2 className="font-semibold text-lg mb-1">{i.org_title}</h2>
          <p>{i.org_name}</p>
          <p>{i.org_address}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{i.contact_title}</h2>
          <p>
            <a href={`mailto:${i.contact_email}`} className="underline hover:text-red-400">
              {i.contact_email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{i.register_title}</h2>
          <p>{i.register_body}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{i.responsible_title}</h2>
          <p>{i.responsible_body}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">{i.disclaimer_title}</h2>
          <p>{i.disclaimer_body}</p>
        </div>
      </div>
    </section>
  );
}
