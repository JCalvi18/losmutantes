'use client'

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { map } from 'lodash'

import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import Carrousel from "@/app/carrousel"


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

            <h1 className="text-orange-700 sm:text-3xl font-bold self-center">La Divina Tragedia o La Maldita Comedia</h1>

            <Image
                src="/maldita_comedia_galery/poster.jpg"
                alt="Band poster"
                width={100}
                height={100}
                sizes="(max-width: 1024px) 100vw, 768px"
                className="w-full h-auto object-contain"
                priority
            />


            <h2 className="text-2xl sm:text-3xl font-bold">Sinópsis</h2>

            <p className={textParagraphBlack}>
                En plena crisis política, el Ministerio de Defensa evalúa hacia dónde puede conducir la democracia. Los asesores barajan las cartas de las tiranías y descubren sus recursos naturales. Debido al número de votantes afines, se declara un ataque sorpresivo contra el Infierno, y el Diablo es capturado.
            </p>

            <p className={textParagraphBlack}>
                Sin embargo, esta guerra atenta contra los intereses corporativos celestiales y da lugar a una alianza sin precedentes entre el Cielo y el Infierno.
            </p>


            <p className={textParagraphBlack}>
                Estalla una batalla nunca vista entre la Tierra y el Infierno. Tras el fracaso celestial de acabar con la tiranía subterránea, un país sueña con promover la democracia y, si es necesario, liberar a las almas allí encarceladas. De pronto, el Infierno es invadido.
            </p>

            <p className={textParagraphBlack}>
                En esta parodia de los clichés de varios géneros (sátira política, fantasía y alegoría teológica), se narra la eterna lucha entre el bien y el mal, que se adentra en lo sobrenatural, pero que, en el fondo, explora temas totalmente humanos y terrenales.
            </p>

            <p className={textParagraphBlack}>
                En plena crisis política, el Ministerio de Defensa evalúa hacia dónde puede conducir la democracia. Los asesores barajan las cartas de las tiranías y descubren sus recursos naturales. Debido al número de votantes afines, se declara un ataque sorpresivo contra el Infierno, y el Diablo es capturado. Sin embargo, esta guerra atenta contra los intereses corporativos celestiales y da lugar a una alianza sin precedentes entre el Cielo y el Infierno. Estalla una batalla nunca vista entre la Tierra y el Infierno. Tras el fracaso celestial de acabar con la tiranía subterránea, un país sueña con promover la democracia y, si es necesario, liberar a las almas allí encarceladas. De pronto, el Infierno es invadido.
            </p>


            <p className={textParagraphBlack}>
                En esta parodia de los clichés de varios géneros (sátira política, fantasía y alegoría teológica), se narra la eterna lucha entre el bien y el mal, que se adentra en lo sobrenatural, pero que, en el fondo, explora temas totalmente humanos y terrenales. ¿Qué papel juega la democracia en un mundo donde el Cielo y el Infierno hacen causa común?
            </p>

            <p className={textParagraphBlack}>
                Toda semejanza con la realidad es pura coincidencia.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-black">Ficha Técnica</h2>
            <Names title="Título" description="La Divina Tragedia o La Maldita Comedia" />
            <Names title="Autor" description="Tomás Afán Muñoz" />
            <Names title="Genero" description="Drama balístico" />
            <Names title="Duración" description="80 minutos" />
            <Names title="Idioma" description="Español" />

            <Names title="Dirección" description="Cecilia Paladines" />
            <Names title="Producción" description="Diego Nuñez, Alejo Olivero, Polina Stadnikova y Paolo Vega" />
            <Names title="Asistencia de dirección" description="Jorge Calvimontes y Diego Nuñez" />
            <Names title="Diseño de sonido" description="David Röttele" />
            <Names title="Diseño de iluminación" description="Jorge Calvimontes y Alejo Olivero" />
            <Names title="Vestuario y maquillaje" description="Silvina Holender, Anna Martiney y Polina Stadnikova" />
            <Names title="Escenografía" description="Paolo Vega y Polina Stadnikova" />
            <Names title="Asistencia técnica" description="Alejandro Olivero" />
            <Names title="Diseño gráfico" description="Gabriela Durán" />
            <Names title="Fotografía" description="David Weiss" />
            <Names title="Subtítulos en Alemán, Francés e Inglés" description="Isa Anzaldo, Birgit Bellmann y Anastasia Fink" />


            <h2 className="text-2xl sm:text-3xl font-bold">Elenco</h2>
            <Image
                src="/nosotros.jpg"
                alt="Elenco"
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

            <h2 className="text-2xl sm:text-3xl font-bold text-black">Galería</h2>
            <Carrousel images={galleryImages} className="w-full" />


        </section>
    )
}
