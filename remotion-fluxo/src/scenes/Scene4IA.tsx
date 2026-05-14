import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const ITEMS = [
  "Checklist gerado por convênio",
  "Risco de glosa calculado antes do envio",
  "SLA em cascata: convênio → tipo → setor",
  "Fila ordenada por Score",
  "Bloqueio de envios incorretos",
];

export const Scene4IA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = spring({ frame, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ padding: 140, justifyContent: "center" }}>
      <div
        style={{
          opacity: titleS,
          fontFamily: "Inter",
          fontSize: 22,
          color: "#a855f7",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        Inteligência Artificial
      </div>
      <div
        style={{
          opacity: titleS,
          fontFamily: "Space Grotesk",
          fontWeight: 600,
          fontSize: 80,
          color: "white",
          marginBottom: 60,
          letterSpacing: -1.5,
          lineHeight: 1.1,
        }}
      >
        O que a IA faz <span style={{ color: "#a855f7" }}>por trás</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {ITEMS.map((item, i) => {
          const delay = 20 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 16 } });
          const x = interpolate(s, [0, 1], [-60, 0]);
          return (
            <div
              key={item}
              style={{
                opacity: s,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 28,
                fontFamily: "Inter",
                fontSize: 36,
                color: "#e2e8f0",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #a855f7)",
                  flexShrink: 0,
                }}
              />
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
