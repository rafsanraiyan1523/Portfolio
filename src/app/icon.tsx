import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#bf1747",
          color: "#f4f2ec",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "-0.06em",
          borderRadius: 7,
        }}
      >
        RR
      </div>
    ),
    size,
  );
}
