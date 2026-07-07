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
        // Append uploadedAt so the URL changes whenever the blob is re-uploaded,
        // busting the browser/CDN cache on the (otherwise immutable) blob object.
        src: `${b.url}?updated=${new Date(b.uploadedAt).getTime()}`,
        alt: b.pathname.split("/").pop() ?? "",
      }));

    return NextResponse.json({ images }, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
