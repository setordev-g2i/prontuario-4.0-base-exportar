import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpace } from "@remotion/google-fonts/SpaceGrotesk";

import { Scene1Title } from "./scenes/Scene1Title";
import { Scene2Intro } from "./scenes/Scene2Intro";
import { Scene3Tabs } from "./scenes/Scene3Tabs";
import { Scene4IA } from "./scenes/Scene4IA";
import { Scene5Closing } from "./scenes/Scene5Closing";

loadInter();
loadSpace();

const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 780], [0, 60]);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 20% 20%, #1e293b 0%, #0f172a 50%, #020617 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
          top: -200 + drift,
          right: -200,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)",
          bottom: -150 - drift,
          left: -150,
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Bg />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene1Title />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene2Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
        />
        <TransitionSeries.Sequence durationInFrames={300}>
          <Scene3Tabs />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene4IA />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene5Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
