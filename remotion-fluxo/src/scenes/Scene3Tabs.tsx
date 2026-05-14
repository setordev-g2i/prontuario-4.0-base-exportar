import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";

const TABS = [
  { n: "01", t: "Dashboard", d: "Visão em tempo real" },
  { n: "02", t: "Novo Fluxo", d: "Wizard guiado por IA" },
  { n: "03", t: "Recebimento", d: "Confirma ou devolve" },
  { n: "04", t: "Fila Inteligente", d: "Ordenada por Score" },
  { n: "05", t: "Aprovações", d: "Libera ou bloqueia" },
  { n: "06", t: "Rastreabilidade", d: "Auditoria completa" },
  { n: "07", t: "Fluxos", d: "Listagem com filtros" },
  { n: "08", t: "Relatórios", d: "Indicadores e SLA" },
];

const Card: React.FC<{ n: string; t: string; d: string; delay: number }> = ({ n, t, d, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });
  const y = interpolate(s, [0, 1], [60, 0]);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${y}px)`,
        background: "rgba(30, 41, 59, 0.6)",
        border: "1px solid rgba(96, 165, 250, 0.25)",
        borderRadius: 24,
        padding: 36,
        backdropFilter: "blur(0px)",
      }}
    >
      <div
        style={{
          fontFamily: "Space Grotesk",
          fontSize: 28,
          fontWeight: 700,
          color: "#3b82f6",
          marginBottom: 12,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: "Space Grotesk",
          fontSize: 38,
          fontWeight: 600,
          color: "white",
          marginBottom: 10,
          letterSpacing: -0.5,
        }}
      >
        {t}
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 22, color: "#94a3b8" }}>{d}</div>
    </div>
  );
};

export const Scene3Tabs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = spring({ frame, fps, config: { damping: 20 } });
  const yT = interpolate(titleS, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ padding: "80px 120px" }}>
      <div
        style={{
          opacity: titleS,
          transform: `translateY(${yT}px)`,
          fontFamily: "Inter",
          fontSize: 22,
          color: "#60a5fa",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        As 8 abas do módulo
      </div>
      <div
        style={{
          opacity: titleS,
          transform: `translateY(${yT}px)`,
          fontFamily: "Space Grotesk",
          fontWeight: 600,
          fontSize: 64,
          color: "white",
          marginBottom: 50,
          letterSpacing: -1,
        }}
      >
        Tudo num só lugar
      </div>
      <Sequence from={20}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 28,
          }}
        >
          {TABS.map((tab, i) => (
            <Card key={tab.n} n={tab.n} t={tab.t} d={tab.d} delay={i * 8} />
          ))}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
