import "./index.css";
import { Composition } from "remotion";
import { TorzoDemo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TorzoDemo"
        component={TorzoDemo}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
