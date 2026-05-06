'use client'

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { map } from 'lodash'

import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import Carrousel from "@/app/carrousel"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { ASSETS } from "@/lib/assets"


function Names({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <h3 className="font-bold mb-0.5">{`${title}:`}</h3>
            <p className="text-base leading-relaxed ">{description}</p>
        </div>
    )
}


function Person({ name, flags }: { name: string, flags: string[] }) {
    const mappedFlags = map(flags, f => getUnicodeFlagIcon(f))
    return (
        <div className="flex flex-col md:flex-row gap-0.5 content-center justify-center">
            <h3 className="font-bold mb-0.5">{name}</h3>
            {mappedFlags.map(f => <p key={`${name}-${f}`}>{f}</p>)}
        </div>
    )
}

export default function Page() {

    const { t } = useLanguage();
    const [galleryImages, setGalleryImages] = useState<{ src: string; alt?: string }[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch("/api/getMCimages", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                if (Array.isArray(data?.images)) setGalleryImages(data.images);
            } catch { }
        };
        fetchImages();
    }, []);

    const textParagraphBlack = "text-base leading-relaxed text-justify text-black"

    return (
        <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl mt-2
            bg-gradient-to-b
            from-blue-100
            to-red-600
            rounded-lg shadow-xl
            text-black
        ">

            <h1 className="text-orange-700 sm:text-3xl font-bold self-center">{t.lamalditacomedia.title}</h1>

            <Image
                src={ASSETS.mcPoster}
                alt="Band poster"
                width={100}
                height={100}
                sizes="(max-width: 1024px) 100vw, 768px"
                className="w-full h-auto object-contain"
                priority
            />


            <h2 className="text-2xl sm:text-3xl font-bold">{t.lamalditacomedia.synopsis_title}</h2>

            <p className={textParagraphBlack}>{t.lamalditacomedia.synopsis_p1}</p>

            <p className={textParagraphBlack}>{t.lamalditacomedia.synopsis_p2}</p>

            <p className={textParagraphBlack}>{t.lamalditacomedia.synopsis_p3}</p>

            <p className={textParagraphBlack}>{t.lamalditacomedia.synopsis_p4}</p>

            <p className={textParagraphBlack}>{t.lamalditacomedia.synopsis_p5}</p>

            <p className={textParagraphBlack}>{t.lamalditacomedia.synopsis_p6}</p>

            <p className={textParagraphBlack}>{t.lamalditacomedia.synopsis_p7}</p>

            <h2 className="text-2xl sm:text-3xl font-bold text-black">{t.lamalditacomedia.technical_title}</h2>
            <Names title={t.lamalditacomedia.field_title} description="La Divina Tragedia o La Maldita Comedia" />
            <Names title={t.lamalditacomedia.field_author} description="Tomás Afán Muñoz" />
            <Names title={t.lamalditacomedia.field_genre} description="Drama balístico" />
            <Names title={t.lamalditacomedia.field_duration} description="80 minutos" />
            <Names title={t.lamalditacomedia.field_language} description="Español" />

            <Names title={t.lamalditacomedia.field_direction} description="Cecilia Paladines" />
            <Names title={t.lamalditacomedia.field_production} description="Diego Nuñez, Alejo Olivero, Polina Stadnikova y Paolo Vega" />
            <Names title={t.lamalditacomedia.field_assistant_direction} description="Jorge Calvimontes y Diego Nuñez" />
            <Names title={t.lamalditacomedia.field_sound} description="David Röttele" />
            <Names title={t.lamalditacomedia.field_lighting} description="Jorge Calvimontes y Alejo Olivero" />
            <Names title={t.lamalditacomedia.field_costumes} description="Silvina Holender, Anna Martiney y Polina Stadnikova" />
            <Names title={t.lamalditacomedia.field_scenography} description="Paolo Vega y Polina Stadnikova" />
            <Names title={t.lamalditacomedia.field_technical} description="Alejandro Olivero" />
            <Names title={t.lamalditacomedia.field_graphic} description="Gabriela Durán" />
            <Names title={t.lamalditacomedia.field_photography} description="David Weiss" />
            <Names title={t.lamalditacomedia.field_subtitles} description="Isa Anzaldo, Birgit Bellmann y Anastasia Fink" />


            <h2 className="text-2xl sm:text-3xl font-bold">{t.lamalditacomedia.cast_title}</h2>
            <Image
                src={ASSETS.mcNosotros}
                alt={t.lamalditacomedia.cast_title}
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 768px"
                className="w-auto max-h-80 object-contain "
                priority
            />

            <div className="grid grid-flow-row-dense grid-cols-2 sd:grid-cols-1 gap-4 justify-center content-center">


                <Person name="Alejo Olivero" flags={['UY']} />
                <Person name="Ana Patricia Martínez Pineda" flags={['NI', 'DE']} />
                <Person name="Anastasia Fink" flags={['RU', 'DE']} />
                <Person name="Birgit Bellmann" flags={['DE']} />
                <Person name="Cecilia Paladines" flags={['EC', 'DE']} />
                <Person name="Clara Vater" flags={['DE']} />
                <Person name="David Roettele" flags={['DE']} />
                <Person name="Diego Nuñez" flags={['CO']} />
                <Person name="Humberto Consuegra" flags={['CO']} />
                <Person name="Isa Anzaldo" flags={['MX', 'DE']} />
                <Person name="Jorge Calvimontes" flags={['BO']} />
                <Person name="Nikolaos Engonopoulos" flags={['GR']} />
                <Person name="Paolo Vega" flags={['MX']} />
                <Person name="Pily Morales" flags={['MX']} />
                <Person name="Polina Stadnikova" flags={['RU', 'DE']} />
                <Person name="Silvina Holender" flags={['AR', 'DE']} />
                <Person name="Simon Vergara" flags={['CL']} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-black">{t.lamalditacomedia.gallery_title}</h2>
            <Carrousel images={galleryImages} className="w-full" />


        </section>
    )
}
