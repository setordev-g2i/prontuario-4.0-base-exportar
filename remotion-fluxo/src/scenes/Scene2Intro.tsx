import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Scene2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20 } });
  const y = interpolate(s, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ padding: 140, justifyContent: "center" }}>
      <div
        style={{
          opacity: s,
          transform: `translateY(${y}px)`,
          fontFamily: "Inter",
          fontSize: 24,
          color: "#60a5fa",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 30,
        }}
      >
        O que é
      </div>
      <div
        style={{
          opacity: s,
          transform: `translateY(${y}px)`,
          fontFamily: "Space Grotesk",
          fontWeight: 600,
          fontSize: 72,
          color: "white",
          lineHeight: 1.15,
          maxWidth: 1500,
          letterSpacing: -1,
        }}
      >
        O caminho que cada documento percorre dentro do hospital —
        <span style={{ color: "#a855f7" }}> da origem até o destino</span>.
      </div>
      <div
        style={{
          opacity: interpolate(frame, [40, 80], [0, 1], { extrapolateRight: "clamp" }),
          fontFamily: "Inter",
          fontSize: 32,
          color: "#94a3b8",
          marginTop: 50,
          maxWidth: 1400,
          lineHeight: 1.4,
        }}
      >
        O sistema controla quem enviou, quem recebeu, quanto tempo levou,
        se está dentro do prazo e qual o risco de glosa.
      </div>
    </AbsoluteFill>
  );
};
