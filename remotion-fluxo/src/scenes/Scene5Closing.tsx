import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Scene5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sA = spring({ frame, fps, config: { damping: 18 } });
  const sB = spring({ frame: frame - 30, fps, config: { damping: 18 } });
  const sC = spring({ frame: frame - 70, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ padding: 140, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 60, alignItems: "stretch", marginBottom: 80 }}>
        <div
          style={{
            opacity: sA,
            transform: `translateX(${interpolate(sA, [0, 1], [-40, 0])}px)`,
            background: "rgba(71, 85, 105, 0.3)",
            border: "1px solid #475569",
            borderRadius: 24,
            padding: 50,
            width: 520,
          }}
        >
          <div style={{ fontFamily: "Inter", fontSize: 20, color: "#94a3b8", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>
            Antes
          </div>
          <div style={{ fontFamily: "Space Grotesk", fontSize: 38, color: "#cbd5e1", lineHeight: 1.25, fontWeight: 500 }}>
            Decisão manual, ordem incerta, prazos cobrados na base do telefone.
          </div>
        </div>
        <div
          style={{
            opacity: sB,
            transform: `translateX(${interpolate(sB, [0, 1], [40, 0])}px)`,
            background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))",
            border: "1px solid #3b82f6",
            borderRadius: 24,
            padding: 50,
            width: 520,
          }}
        >
          <div style={{ fontFamily: "Inter", fontSize: 20, color: "#60a5fa", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>
            Agora
          </div>
          <div style={{ fontFamily: "Space Grotesk", fontSize: 38, color: "white", lineHeight: 1.25, fontWeight: 500 }}>
            O sistema ordena, bloqueia o errado e mostra onde estão os riscos.
          </div>
        </div>
      </div>
      <div
        style={{
          opacity: sC,
          fontFamily: "Space Grotesk",
          fontSize: 56,
          fontWeight: 700,
          background: "linear-gradient(90deg, #3b82f6, #a855f7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: -1,
        }}
      >
        Fluxo de Documentos · Prontuário 4.0
      </div>
    </AbsoluteFill>
  );
};
