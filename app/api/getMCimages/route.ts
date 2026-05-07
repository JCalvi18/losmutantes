import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get("prefix") ?? "malditaComedia/galery";
  try {
    const { blobs } = await list({ prefix });
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
