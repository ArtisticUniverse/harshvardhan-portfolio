import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const font = await readFile(path.join(process.cwd(), "app/fonts/ClashDisplay-Semibold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 64,
          background: "#EBB94A",
          color: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          letterSpacing: -1,
          fontFamily: "Clash",
        }}
      >
        HP
      </div>
    ),
    { ...size, fonts: [{ name: "Clash", data: font, weight: 600, style: "normal" }] },
  );
}
