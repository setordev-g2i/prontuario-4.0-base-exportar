import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Scene1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const s2 = spring({ frame: frame - 15, fps, config: { damping: 18, stiffness: 110 } });
  const s3 = spring({ frame: frame - 30, fps, config: { damping: 20 } });
  const y1 = interpolate(s1, [0, 1], [60, 0]);
  const y2 = interpolate(s2, [0, 1], [60, 0]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 100 }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            opacity: s3,
            fontFamily: "Inter",
            fontSize: 22,
            letterSpacing: 8,
            color: "#60a5fa",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Prontuário 4.0 · Módulo
        </div>
        <div
          style={{
            opacity: s1,
            transform: `translateY(${y1}px)`,
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: 180,
            color: "white",
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          Fluxo de
        </div>
        <div
          style={{
            opacity: s2,
            transform: `translateY(${y2}px)`,
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: 180,
            background: "linear-gradient(90deg, #3b82f6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          Documentos
        </div>
      </div>
    </AbsoluteFill>
  );
};
