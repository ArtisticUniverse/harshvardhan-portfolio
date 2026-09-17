import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await readFile(path.join(process.cwd(), "app/fonts/ClashDisplay-Semibold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          color: "#EBB94A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 86,
          letterSpacing: -3,
          fontFamily: "Clash",
        }}
      >
        HP
      </div>
    ),
    { ...size, fonts: [{ name: "Clash", data: font, weight: 600, style: "normal" }] },
  );
}
