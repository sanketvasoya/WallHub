import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Free 4K & AMOLED Wallpapers";
  const image = searchParams.get("image");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0C",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle at 30% 50%, rgba(124,158,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(167,139,250,0.15) 0%, transparent 50%)",
          }}
        />
        {image && (
          <img
            src={image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.3,
              position: "absolute",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            padding: "40px 60px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#F0F0F0",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 16,
              maxWidth: 800,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#909090",
              letterSpacing: "-0.01em",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            wallection.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
