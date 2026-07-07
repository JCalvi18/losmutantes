'use client'

import React from "react"
import Image from "next/image"

import { CheckCircleIcon, SparklesIcon, UsersIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "../i18n/LanguageContext";
import { ASSETS } from "@/lib/assets";


export default function Page() {

    const { t } = useLanguage();
    const textNormalWhite = "text-base leading-relaxed text-slate-600 text-white"
    const textParagraph = "text-base leading-relaxed"

    return (
        <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl text-white">
            <h2 className="text-2xl sm:text-3xl font-bold">{t.about.title}</h2>
            <Image
                src={ASSETS.nosotros4}
                alt="Band poster"
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 768px"
                className="w-full h-auto object-contain"
                priority
            />

            <p className={textParagraph}>{t.about.intro1}</p>

            <p className={textParagraph}>{t.about.intro2}</p>

            <p className={textParagraph}>{t.about.intro3}</p>

            <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t.about.what_we_do}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <li className="flex gap-4">
                        <CheckCircleIcon className="h-8 w-8 text-violet-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">{t.about.promote_title}</h3>
                            <p className={textNormalWhite}>{t.about.promote_desc}</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <UsersIcon className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">{t.about.diversity_title}</h3>
                            <p className={textNormalWhite}>{t.about.diversity_desc}</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <SparklesIcon className="h-8 w-8 text-orange-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">{t.about.artistic_title}</h3>
                            <p className={textNormalWhite}>{t.about.artistic_desc}</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <GlobeAltIcon className="h-8 w-8 text-sky-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">{t.about.language_title}</h3>
                            <p className={textNormalWhite}>{t.about.language_desc}</p>
                        </div>
                    </li>
                </ul>
            </div>


            {/* Visión */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t.about.aspirations}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <li className="flex gap-4">
                        <SparklesIcon className="h-8 w-8 text-rose-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">{t.about.reference_title}</h3>
                            <p className={textNormalWhite}>{t.about.reference_desc}</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <CheckCircleIcon className="h-8 w-8 text-violet-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">{t.about.sustainability_title}</h3>
                            <p className={textNormalWhite}>{t.about.sustainability_desc}</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <UsersIcon className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">{t.about.collaboration_title}</h3>
                            <p className={textNormalWhite}>{t.about.collaboration_desc}</p>
                        </div>
                    </li>
                </ul>
            </div>


        </section>
    )
}
