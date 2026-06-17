import { ImageResponse } from "next/og";
import { LIVE_COUNT } from "@/lib/liveAtenei";

export const alt = "StudentOS — il salvagente per la tua carriera universitaria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card generata in casa (satori: solo flexbox, colori letterali — non
 *  legge le CSS var del sito). Niente font/immagini esterni. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "linear-gradient(135deg, rgba(124,123,255,0.22), rgba(10,10,15,0) 45%), linear-gradient(315deg, rgba(56,189,248,0.18), rgba(10,10,15,0) 45%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* wordmark: Student + O-anello (salvagente) + S */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#f5f5fa",
          }}
        >
          <span>Student</span>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "9999px",
              border: "18px solid #7c7bff",
              margin: "0 6px",
            }}
          />
          <span>S</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 40,
            fontWeight: 600,
            color: "#9c9bff",
          }}
        >
          Il salvagente per la tua carriera universitaria
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 30,
            color: "#b8b8c4",
            textAlign: "center",
          }}
        >
          Orario, appelli, libretto e media — già pronti per il tuo corso
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 44,
            fontSize: 24,
            color: "#8a8a99",
          }}
        >
          <span>{LIVE_COUNT} atenei in sync live</span>
          <span>·</span>
          <span>senza account</span>
          <span>·</span>
          <span>studentos.app</span>
        </div>
      </div>
    ),
    size,
  );
}
