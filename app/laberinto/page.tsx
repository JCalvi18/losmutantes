'use client'

import React from "react"
import Image from "next/image"
import { map } from 'lodash'

import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import Carrousel from "@/app/carrousel"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { ASSETS } from "@/lib/assets"
import { LaberintoTheme } from "@/lib/laberinto/laberinto-theme"
import MazeBackground from "@/lib/laberinto/maze"
import { useGalleryImages } from "@/app/hooks/useGalleryImages"


function Names({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex flex-col md:flex-row gap-3 text-center md:text-left">
            <h3 className="font-bold text-[var(--lb-blue)] mb-0.5">{`${title}:`}</h3>
            <p>{description}</p>
        </div>
    )
}


function Person({ name, flags }: { name: string, flags: string[] }) {
    const mappedFlags = map(flags, f => getUnicodeFlagIcon(f))
    return (
        <div className="flex flex-row gap-1 items-center justify-center">
            <h3 className="font-bold mb-0.5">{name}</h3>
            {mappedFlags.map(f => <p key={`${name}-${f}`}>{f}</p>)}
        </div>
    )
}

export default function Page() {

    const { t } = useLanguage();
    const galleryImages = useGalleryImages("laberinto/presentations");


    return (

        <LaberintoTheme>
            <MazeBackground />
            <section className="
                container mx-auto
                flex flex-col gap-6 flex-1
                max-w-3xl items-center
                px-4 sm:px-6 md:px-8 py-8
                text-[var(--lb-yellow)] text-lg sm:text-xl md:text-2xl
                bg-[var(--lb-background)]/80
                font-bebas
                ">
                <h1 className="sm:text-3xl text-[var(--lb-orange)] font-bold self-center">{t.laberinto.title}</h1>


                <Image
                    src={ASSETS.laberintoTitulo}
                    alt="Band poster"
                    width={800}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="w-full h-auto object-contain"
                    priority
                />


                <h2 className=" text-[var(--lb-orange)] text-2xl sm:text-3xl font-bold">{t.play.synopsis_title}</h2>

                <p>{t.laberinto.synopsis_p1}</p>
                <p>{t.laberinto.synopsis_p2}</p>
                <p>{t.laberinto.synopsis_p3}</p>

                <h2 className="text-[var(--lb-orange)] text-2xl sm:text-3xl font-bold">{t.play.technical_title}</h2>
                <div className="flex flex-col gap-6 flex-1 px-10 lg:items-start md:items-start" >
                    <Names title={t.play.field_title} description={t.laberinto.title} />
                    <Names title={t.play.field_author} description={t.laberinto.authors} />
                    <Names title={t.play.field_genre} description={t.laberinto.gender} />
                    <Names title={t.play.field_duration} description={t.laberinto.duration} />
                    <Names title={t.play.field_language} description={t.laberinto.language} />


                    <Names title={t.play.field_direction} description={t.laberinto.crew_direction} />
                    <Names title={t.play.field_production} description={t.laberinto.crew_production} />
                    {/* <Names title={t.play.field_assistant_direction} description={t.laberinto.crew_assistant_direction} /> */}
                    <Names title={t.play.field_choreography} description={t.laberinto.crew_choreography} />
                    <Names title={t.play.field_lighting} description={t.laberinto.crew_lighting} />
                    <Names title={t.play.field_marketing} description={t.laberinto.crew_marketing} />
                    <Names title={t.play.field_costumes} description={t.laberinto.crew_costumes} />
                    <Names title={t.play.field_scenography} description={t.laberinto.crew_scenography} />
                    <Names title={t.play.field_sound} description={t.laberinto.crew_sound} />
                    {/* <Names title={t.play.field_technical} description="Leandro" /> */}
                    <Names title={t.play.field_graphic} description={t.laberinto.crew_graphic} />
                    <Names title={t.play.field_photography} description={t.laberinto.crew_photography} />
                    <Names title={t.play.field_translations} description={t.laberinto.crew_translation} />
                    <Names title={t.play.field_supertitles} description={t.laberinto.crew_subtitles} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold">{t.play.cast_title}</h2>
                <Image
                    src={ASSETS.nosotros4}
                    alt={t.play.cast_title}
                    width={1600}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="w-auto max-h-80 object-contain "
                    priority
                />

                <div className="grid grid-flow-row-dense md:grid-cols-2 sd:grid-cols-1 gap-4 justify-center content-center">


                    <Person name="Isa Anzaldo" flags={['MX', 'DE']} />
                    <Person name="Birgit Bellmann" flags={['DE']} />
                    <Person name="Jacqueline Bonilla Pérez" flags={['MX']} />
                    <Person name="Helga Böcker" flags={['CO', 'DE']} />
                    <Person name="Jorge Calvimontes" flags={['BO']} />
                    <Person name="Humberto Consuegra" flags={['CO']} />
                    <Person name="Francesco Crifò" flags={['IT']} />
                    <Person name="Luciana Dos Ramos" flags={['UY']} />
                    <Person name="Nikolaos Engonopoulos" flags={['GR']} />
                    <Person name="Pahola González Tovar" flags={['MX']} />
                    <Person name="Veronica Gimenez" flags={['UY']} />
                    <Person name="Silvina Holender" flags={['AR', 'DE']} />
                    <Person name="Jonas Jung" flags={['DE', 'CO']} />
                    <Person name="Jennifer Carmen Kubistin Quirós" flags={['DE', 'CR']} />
                    <Person name="Pilar Morales" flags={['MX']} />
                    <Person name="Diego Nuñez" flags={['CO']} />
                    <Person name="Alejo Olivero" flags={['UY']} />
                    <Person name="Cecilia Paladines" flags={['EC', 'DE']} />
                    <Person name="Pablo Palma Arcenegui" flags={['ES']} />
                    <Person name="Mónica Rus Bono" flags={['ES']} />
                    <Person name="Polina Stadnikova" flags={['DE']} />
                    <Person name="Aldana Troncoso" flags={['AR', 'IT']} />
                    <Person name="Paolo Vega" flags={['MX']} />
                    <Person name="Simon Vergara" flags={['CL']} />
                    {/* <Person name="Clara Vater" flags={['DE']} /> */}

                </div>

                <h2 className="text-[var(--lb-orange)] text-2xl sm:text-3xl font-bold">{t.play.gallery_title}</h2>
                <Carrousel images={galleryImages} className="w-full" />



            </section>
        </LaberintoTheme>
    )
}
