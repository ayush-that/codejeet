import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CodeJeet — company-wise LeetCode interview questions";

export default function OpenGraphImage() {
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
          fontSize: "24px",
          color: "#888",
          letterSpacing: "0.05em",
          marginBottom: "24px",
        }}
      >
        codejeet.com
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "72px",
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: "24px",
        }}
      >
        CodeJeet
      </div>
      <div style={{ display: "flex", fontSize: "32px", color: "#aaa", maxWidth: "900px" }}>
        15,000+ company-wise LeetCode interview questions
      </div>
    </div>,
    { ...size }
  );
}
