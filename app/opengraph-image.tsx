import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/data/content";

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const [font, photo] = await Promise.all([
    readFile(path.join(process.cwd(), "app/fonts/ClashDisplay-Semibold.ttf")),
    readFile(path.join(process.cwd(), "public/images/harsh-3d.png")),
  ]);
  const src = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0A0A0A", position: "relative", fontFamily: "Clash" }}>
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: -80,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(235,185,74,0.35), rgba(235,185,74,0) 65%)",
            display: "flex",
          }}
        />
        <img src={src} alt="" width={520} height={560} style={{ position: "absolute", right: 60, bottom: 0, objectFit: "contain" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 64,
                background: "#EBB94A",
                color: "#0A0A0A",
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              HP
            </div>
            <div style={{ color: "#96948C", fontSize: 22, letterSpacing: 2 }}>PORTFOLIO · INTERACTIVE CV</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#F2F0EA", fontSize: 104, lineHeight: 0.86, letterSpacing: -4 }}>HARSHVARDHAN</div>
            <div style={{ color: "#EBB94A", fontSize: 104, lineHeight: 0.95, letterSpacing: -4 }}>PANDEY</div>
            <div style={{ color: "#F2F0EA", fontSize: 26, marginTop: 28, maxWidth: 640 }}>{site.tagline}</div>
            <div style={{ color: "#96948C", fontSize: 22, marginTop: 8 }}>
              {`${site.taglineSub} · From ${site.hometown}`}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Clash", data: font, weight: 600, style: "normal" }] },
  );
}
