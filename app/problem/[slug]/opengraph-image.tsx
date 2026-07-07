import { ImageResponse } from "next/og";
import { getProblem, getProblemCompanies } from "@/lib/pseo-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated on demand — pre-rendering ~2.8k OG images bloated CI and caused ENOENT races.

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#22c55e",
  Medium: "#eab308",
  Hard: "#ef4444",
};

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = await getProblem(slug);
  const companiesMap = await getProblemCompanies();
  const companies = companiesMap[slug] ?? [];

  const title = problem?.title ?? slug;
  const difficulty = problem?.difficulty ?? "Medium";
  const acceptance = problem?.acceptance_rate ?? "";
  const topics = problem?.topics.slice(0, 4) ?? [];
  const diffColor = DIFFICULTY_COLORS[difficulty] ?? "#eab308";

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
          fontSize: "52px",
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: "24px",
          display: "flex",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: diffColor,
            padding: "4px 16px",
            borderRadius: "8px",
            border: `2px solid ${diffColor}`,
          }}
        >
          {difficulty}
        </span>
        {acceptance && (
          <span style={{ fontSize: "24px", color: "#aaa" }}>{acceptance} acceptance</span>
        )}
        {companies.length > 0 && (
          <span style={{ fontSize: "24px", color: "#aaa" }}>
            Asked by {companies.length} {companies.length === 1 ? "company" : "companies"}
          </span>
        )}
      </div>
      {topics.length > 0 && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {topics.map((t) => (
            <span
              key={t}
              style={{
                fontSize: "22px",
                color: "#ccc",
                padding: "6px 16px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>,
    { ...size }
  );
}
