"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, Button } from "@heroui/react";

export default function SiteHeader() {
  return (
    <Navbar maxWidth="full" className="bg-white border-b py-4 md:py-6 text-black">
      <NavbarContent justify="start" className="w-1/3" />
      <NavbarContent justify="center" className="w-1/3 flex-col items-center gap-2 text-center">
        <NavbarBrand className="gap-3 items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-black text-center">Los Mutantes</h1>
        </NavbarBrand>
        <div className="w-full flex flex-row sm:flex-column items-center justify-center gap-3 mt-2 w-full text-center">
          <Button as={Link} href="/" variant="flat" size="lg" className="text-black">Inicio</Button>
          <Button as={Link} href="/archivo" variant="flat" size="lg" className="text-black">Archivo</Button>
          <Button as={Link} href="/about" variant="flat" size="lg" className="text-black">Sobre nosotros</Button>
        </div>
      </NavbarContent>
      <NavbarContent justify="end" className="w-1/3" />
    </Navbar>
  );
}


