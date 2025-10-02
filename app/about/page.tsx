'use client'

import React from "react"
import Image from "next/image"

import { CheckCircleIcon, SparklesIcon, UsersIcon, GlobeAltIcon } from "@heroicons/react/24/solid";


export default function page() {

    const textNormalWhite = "text-base leading-relaxed text-slate-600 text-white"
    const textParagraph = "text-base leading-relaxed"

    return (
        <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold">Sobre nosotros</h2>
            <Image
                src="/nosotros2.jpg"
                alt="Band poster"
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 768px"
                className="w-full h-auto object-contain"
                priority
            />

            <p className={textParagraph}>
                Los Mutantes somos un grupo de teatro amateur en español de la Universidad del Sarre fundado en 1999 gracias a una iniciativa estudiantil y con el apoyo del Departamento de Romanística.
            </p>

            <p className={textParagraph}>
                Desde entonces, no hemos dejado de estar activos y contribuimos de forma significativa a la oferta cultural de la Gran Región (Luxemburgo, Lorena, Sarre y Palatinado), incluyendo la creación del festival universitario transfronterizo de teatro *GrAFiTi*.
            </p>


            <p className={textParagraph}>
                Somos parte de la Red Europea de Teatro Amateur en Español. Somos también una asociación registrada (e.V.), lo que nos permite organizar nuestras actividades culturales de manera profesional y abierta a toda la comunidad.
            </p>

            <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">¿Qué hacemos?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <li className="flex gap-4">
                        <CheckCircleIcon className="h-8 w-8 text-violet-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">Promover el teatro en español</h3>
                            <p className={textNormalWhite}>
                                Ofrecemos obras en español, pensadas tanto para hispanohablantes como para público general. Con el objectivo de hacer teatro en Español en Alemania.
                            </p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <UsersIcon className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">Fomentar la diversidad cultural</h3>
                            <p className={textNormalWhite}>
                                Integramos personas de distintas nacionalidades y disciplinas para crear espacios de encuentro e intercambio.
                            </p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <SparklesIcon className="h-8 w-8 text-orange-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">Desarrollo artístico</h3>
                            <p className={textNormalWhite}>
                                Cada miembro puede participar en actuación, dirección, escenografía, técnica y producción: somos un proyecto colectivo.
                            </p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <GlobeAltIcon className="h-8 w-8 text-sky-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">Práctica y promoción del español</h3>
                            <p className={textNormalWhite}>
                                Nuestras actividades sirven también como espacio práctico para estudiantes y personas interesadas en el idioma.
                            </p>
                        </div>
                    </li>
                </ul>
            </div>


            {/* Visión */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Nuestras aspiraciones </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <li className="flex gap-4">
                        <SparklesIcon className="h-8 w-8 text-rose-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">Ser referencia cultural</h3>
                            <p className={textNormalWhite}>
                                Aspiramos a consolidarnos como una plataforma reconocida de teatro en español dentro de Alemania y Europa.
                            </p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <CheckCircleIcon className="h-8 w-8 text-violet-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">Sostenibilidad artística</h3>
                            <p className={textNormalWhite}>
                                Queremos mantener continuidad y renovación: nuevas voces, nuevas ideas y calidad en cada temporada.
                            </p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <UsersIcon className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold mb-6">Colaboración y expansión</h3>
                            <p className={textNormalWhite}>
                                Participaremos en festivales y giras, y colaboraremos con otros grupos para tejer redes culturales internacionales.
                            </p>
                        </div>
                    </li>
                </ul>
            </div>


        </section>
    )
}
