import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "selected_images");
    const entries = await fs.promises.readdir(imagesDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => /(\.png|\.jpg|\.jpeg|\.webp|\.gif|\.svg)$/i.test(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = files.map((name) => ({
      src: `/selected_images/${name}`,
      alt: name,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
