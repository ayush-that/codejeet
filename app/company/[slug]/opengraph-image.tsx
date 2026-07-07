import { ImageResponse } from "next/og";
import { getCompanyProfile } from "@/lib/pseo-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated on demand — pre-rendering ~400 OG images slowed Workers Builds.

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getCompanyProfile(slug);

  const name = profile?.displayName ?? slug;
  const count = profile?.questionCount ?? 0;
  const easy = profile?.difficultyDist.easy ?? 0;
  const medium = profile?.difficultyDist.medium ?? 0;
  const hard = profile?.difficultyDist.hard ?? 0;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <span style={{ fontSize: "24px", color: "#888", letterSpacing: "0.05em" }}>
          codejeet.com
        </span>
      </div>
      <div
        style={{
          fontSize: "64px",
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: "24px",
          display: "flex",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: "32px",
          color: "#aaa",
          marginBottom: "40px",
          display: "flex",
        }}
      >
        {count} LeetCode Interview Questions
      </div>
      <div style={{ display: "flex", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "28px",
          }}
        >
          <span style={{ color: "#22c55e" }}>{easy}</span>
          <span style={{ color: "#666" }}>Easy</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "28px",
          }}
        >
          <span style={{ color: "#eab308" }}>{medium}</span>
          <span style={{ color: "#666" }}>Medium</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "28px",
          }}
        >
          <span style={{ color: "#ef4444" }}>{hard}</span>
          <span style={{ color: "#666" }}>Hard</span>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
