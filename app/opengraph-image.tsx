import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "CodeJeet - Company-wise LeetCode Interview Questions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", marginBottom: 24 }}>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#4285F4" }}>c</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#EA4335" }}>o</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#FBBC05" }}>d</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#34A853" }}>e</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#FF6D00" }}>j</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#00BCD4" }}>e</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#A259FF" }}>e</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "#FF4081" }}>t</span>
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#e0e0e0",
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        Company-wise LeetCode Interview Questions
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#888",
          marginTop: 16,
        }}
      >
        17,000+ questions from 660+ companies
      </div>
    </div>,
    { ...size }
  );
}
