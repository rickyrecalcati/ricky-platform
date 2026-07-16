import { ImageResponse } from "next/og";

export const alt = "Ricky Recalcati editorial platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#090706",
          color: "#f5efe3",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(204, 164, 91, 0.45)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: "56px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#caa45f",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Books • Articles • Resources
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 86,
                lineHeight: 0.95,
              }}
            >
              Ricky Recalcati
            </div>
            <div
              style={{
                color: "#d8ccba",
                fontSize: 32,
                lineHeight: 1.35,
                maxWidth: 840,
              }}
            >
              Business, operations, investing and clearer thinking.
            </div>
          </div>
          <div style={{ color: "#caa45f", fontSize: 24 }}>
            rickyrecalcati.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
