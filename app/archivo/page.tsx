'use client'

import React from "react"
import Image from "next/image";
import Link from "next/link";

export default function Page() {

    return (
        <section className="grid grid-cols-3 gap-8 items-stretch mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 max-w-3xl mt-2                   
            rounded-lg shadow-xl
            text-black
        ">
            <Link href={'/archivo/lamalditacomedia'} target="_blank" rel="noopener noreferrer" className="text-center hover:underline">
                <Image
                    src="/maldita_comedia_galery/poster.jpg"
                    alt="La maldita comedia"
                    width={1600}
                    height={900}
                    className="w-full h-auto object-contain"
                    priority
                />

            </Link>
        </section>
    )

}