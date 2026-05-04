import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "malditaComedia/galery" });
    const images = blobs
      .filter((b) => /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(b.pathname))
      .sort((a, b) =>
        a.pathname.localeCompare(b.pathname, undefined, { numeric: true })
      )
      .map((b) => ({
        src: b.url,
        alt: b.pathname.split("/").pop() ?? "",
      }));

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
