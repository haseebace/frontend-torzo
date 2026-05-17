import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const providers = ["YTS", "RARBG", "1337x", "TPB", "EZTV", "Torlock"];

const results = [
  {
    title: "Dune Part Two",
    meta: "2160p HDR",
    size: "18.4 GB",
    seeds: "18,940",
    source: "YTS",
    score: "98",
  },
  {
    title: "Dune Part Two",
    meta: "1080p BluRay",
    size: "3.1 GB",
    seeds: "12,408",
    source: "RARBG",
    score: "94",
  },
  {
    title: "Dune Part Two",
    meta: "2160p WEB",
    size: "21.7 GB",
    seeds: "9,772",
    source: "1337x",
    score: "91",
  },
];

const flowSteps = ["Add magnet", "Select files", "Unrestrict link", "Ready"];

const shotLabelStyle: React.CSSProperties = {
  position: "absolute",
  left: 92,
  top: 74,
  color: "rgba(239, 255, 250, 0.62)",
  fontSize: 24,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const frameIn = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: ease });

const Background = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 750], [0, -360], clamp);
  const pulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.28, 0.55]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 72% 18%, rgba(37, 211, 146, 0.28), transparent 28%), radial-gradient(circle at 12% 84%, rgba(71, 143, 255, 0.18), transparent 26%), linear-gradient(135deg, #05080b 0%, #081116 45%, #04100e 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -80,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(186,255,232,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(186,255,232,0.12) 1px, transparent 1px)",
          backgroundSize: "86px 86px",
          transform: `translate3d(${drift}px, ${drift * 0.35}px, 0) rotate(-8deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: pulse,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(120,255,211,0.08) 48%, transparent 70%)",
          transform: `translateX(${interpolate(frame, [0, 750], [-900, 900], clamp)}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const LogoMark = ({ scale = 1 }: { scale?: number }) => (
  <div
    style={{
      width: 88 * scale,
      height: 88 * scale,
      borderRadius: 24 * scale,
      background: "linear-gradient(145deg, #dfffee, #31e895 58%, #07945f)",
      boxShadow: "0 24px 80px rgba(30, 235, 149, 0.36)",
      display: "grid",
      placeItems: "center",
      color: "#04100e",
      fontWeight: 900,
      fontSize: 48 * scale,
    }}
  >
    T
  </div>
);

const BrowserShell = ({
  children,
  title = "torzo.app",
  style,
}: {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      width: 1340,
      minHeight: 720,
      borderRadius: 28,
      border: "1px solid rgba(217, 255, 243, 0.13)",
      background: "rgba(7, 16, 18, 0.88)",
      boxShadow: "0 50px 170px rgba(0,0,0,0.54)",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        height: 68,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 28px",
        borderBottom: "1px solid rgba(217, 255, 243, 0.1)",
        background: "rgba(255,255,255,0.025)",
      }}
    >
      <span className="dot" style={{ background: "#ff5f57" }} />
      <span className="dot" style={{ background: "#ffbd2e" }} />
      <span className="dot" style={{ background: "#28c840" }} />
      <div
        style={{
          marginLeft: 24,
          height: 34,
          flex: 1,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          paddingLeft: 18,
          color: "rgba(239,255,250,0.56)",
          background: "rgba(0,0,0,0.26)",
          fontSize: 18,
        }}
      >
        {title}
      </div>
    </div>
    {children}
  </div>
);

const SearchInput = ({ text, active = false }: { text: string; active?: boolean }) => (
  <div
    style={{
      height: 92,
      borderRadius: 20,
      border: active
        ? "1px solid rgba(111, 255, 197, 0.82)"
        : "1px solid rgba(217, 255, 243, 0.13)",
      background: "rgba(255,255,255,0.055)",
      display: "flex",
      alignItems: "center",
      padding: "0 30px",
      color: "#effffa",
      fontSize: 34,
      boxShadow: active ? "0 0 80px rgba(31, 239, 151, 0.18)" : "none",
    }}
  >
    <span style={{ color: "rgba(239,255,250,0.45)", marginRight: 18 }}>Search</span>
    <span>{text}</span>
    {active ? <span style={{ color: "#6cffc5", marginLeft: 8 }}>|</span> : null}
  </div>
);

const ResultCard = ({
  item,
  index,
  active = false,
}: {
  item: (typeof results)[number];
  index: number;
  active?: boolean;
}) => (
  <div
    style={{
      height: 138,
      borderRadius: 20,
      border: active
        ? "1px solid rgba(111, 255, 197, 0.72)"
        : "1px solid rgba(217, 255, 243, 0.1)",
      background: active ? "rgba(32, 169, 111, 0.16)" : "rgba(255,255,255,0.045)",
      display: "grid",
      gridTemplateColumns: "78px 1fr 160px 160px 130px",
      alignItems: "center",
      gap: 18,
      padding: "0 26px",
      color: "#effffa",
      boxShadow: active ? "0 28px 90px rgba(30, 235, 149, 0.18)" : "none",
    }}
  >
    <div className="rank">{index + 1}</div>
    <div>
      <div style={{ fontSize: 32, fontWeight: 800 }}>{item.title}</div>
      <div style={{ marginTop: 8, color: "rgba(239,255,250,0.54)", fontSize: 21 }}>
        {item.meta} - {item.source}
      </div>
    </div>
    <Metric label="Size" value={item.size} />
    <Metric label="Seeds" value={item.seeds} />
    <Metric label="Score" value={item.score} accent />
  </div>
);

const Metric = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div>
    <div style={{ color: "rgba(239,255,250,0.42)", fontSize: 17 }}>{label}</div>
    <div style={{ color: accent ? "#6cffc5" : "#effffa", fontSize: 26, fontWeight: 800 }}>
      {value}
    </div>
  </div>
);

const ColdOpen = () => {
  const frame = useCurrentFrame();
  const chaos = Array.from({ length: 22 }, (_, i) => i);
  const logoScale = spring({ frame: frame - 34, fps: 30, config: { damping: 14 } });
  const flash = interpolate(frame, [46, 53, 60], [0, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <div style={shotLabelStyle}>Cold open</div>
      {chaos.map((item) => {
        const y = 150 + (item % 7) * 112;
        const x = interpolate(frame, [0, 70], [1980 + item * 82, -780 + item * -50], clamp);
        const opacity = interpolate(frame, [0, 14, 52, 72], [0, 0.6, 0.6, 0], clamp);
        return (
          <div
            key={item}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              width: 420,
              height: 74,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              background: item % 3 === 0 ? "rgba(255,92,92,0.12)" : "rgba(255,255,255,0.045)",
              transform: `translateX(${x}px) skewX(-10deg)`,
              opacity,
              color: "rgba(239,255,250,0.42)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              fontSize: 22,
            }}
          >
            torrent-result-{String(item + 1).padStart(2, "0")} / ads / mirrors
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          opacity: frameIn(frame, 20, 46),
          transform: `scale(${0.82 + logoScale * 0.18})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <LogoMark scale={1.2} />
          <div>
            <div style={{ color: "#effffa", fontSize: 96, fontWeight: 900 }}>Torzo</div>
            <div style={{ color: "rgba(239,255,250,0.58)", fontSize: 30 }}>
              Find the signal. Skip the noise.
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#effffa",
          opacity: flash,
        }}
      />
    </AbsoluteFill>
  );
};

const SearchScene = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const typed = "Dune Part Two 4K".slice(0, Math.floor(interpolate(local, [12, 84], [0, 16], clamp)));
  const shell = frameIn(local, 0, 28);
  const tilt = interpolate(local, [0, 120], [12, -4], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={shotLabelStyle}>Search</div>
      <BrowserShell
        style={{
          transform: `perspective(1600px) rotateX(${tilt}deg) rotateY(-10deg) scale(${0.86 + shell * 0.14})`,
          opacity: shell,
        }}
      >
        <div style={{ padding: 58 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 42 }}>
            <LogoMark scale={0.56} />
            <div style={{ color: "#effffa", fontSize: 38, fontWeight: 900 }}>Torzo</div>
          </div>
          <SearchInput text={typed} active />
          <div
            style={{
              marginTop: 38,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 18,
              opacity: frameIn(local, 88, 118),
            }}
          >
            {["No ads", "Multi-provider", "Real-Debrid ready"].map((label) => (
              <div key={label} className="pill">
                {label}
              </div>
            ))}
          </div>
        </div>
      </BrowserShell>
    </AbsoluteFill>
  );
};

const ProviderSweep = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const scanX = interpolate(local, [0, 115], [-260, 1760], clamp);

  return (
    <AbsoluteFill>
      <div style={shotLabelStyle}>Provider sweep</div>
      <div
        style={{
          position: "absolute",
          left: scanX,
          top: 120,
          width: 5,
          height: 840,
          background: "#6cffc5",
          boxShadow: "0 0 60px #6cffc5",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "190px 160px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 26,
          transform: `perspective(1500px) rotateX(${interpolate(local, [0, 120], [10, 0], clamp)}deg)`,
        }}
      >
        {providers.map((provider, index) => {
          const enter = frameIn(local, index * 8, index * 8 + 24);
          const ping = frameIn(local, 52 + index * 6, 72 + index * 6);
          return (
            <div
              key={provider}
              style={{
                borderRadius: 24,
                border: "1px solid rgba(217, 255, 243, 0.12)",
                background: ping > 0.4 ? "rgba(32,169,111,0.22)" : "rgba(255,255,255,0.045)",
                padding: 36,
                color: "#effffa",
                opacity: enter,
                transform: `translateY(${(1 - enter) * 70}px) scale(${0.96 + ping * 0.04})`,
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 900 }}>{provider}</div>
              <div style={{ marginTop: 20, color: "rgba(239,255,250,0.52)", fontSize: 24 }}>
                scanning index
              </div>
              <div className="scanbar">
                <div style={{ width: `${interpolate(local, [38, 116], [0, 100], clamp)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ResultsReveal = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const pan = interpolate(local, [0, 170], [130, -80], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={shotLabelStyle}>Results</div>
      <BrowserShell
        title="torzo.app/results?q=Dune%20Part%20Two%204K"
        style={{
          transform: `perspective(1700px) rotateY(${interpolate(local, [0, 170], [8, -7], clamp)}deg) translateX(${pan}px)`,
        }}
      >
        <div style={{ padding: 38 }}>
          <SearchInput text="Dune Part Two 4K" />
          <div
            style={{
              margin: "28px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "rgba(239,255,250,0.55)",
              fontSize: 24,
            }}
          >
            <span>86 clean results across 6 providers</span>
            <span className="pill small">Sorted by signal</span>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {results.map((item, index) => {
              const enter = frameIn(local, 18 + index * 12, 46 + index * 12);
              return (
                <div
                  key={`${item.source}-${item.meta}`}
                  style={{
                    opacity: enter,
                    transform: `translateX(${(1 - enter) * 180}px)`,
                  }}
                >
                  <ResultCard item={item} index={index} active={index === 0 && local > 92} />
                </div>
              );
            })}
          </div>
        </div>
      </BrowserShell>
    </AbsoluteFill>
  );
};

const DetailScene = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const zoom = spring({ frame: local, fps: 30, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={shotLabelStyle}>Detail</div>
      <BrowserShell
        title="torzo.app/detail"
        style={{
          width: 1240,
          transform: `scale(${0.84 + zoom * 0.16})`,
          opacity: frameIn(local, 0, 20),
        }}
      >
        <div style={{ padding: 46, display: "grid", gridTemplateColumns: "1fr 380px", gap: 34 }}>
          <div>
            <div style={{ color: "#effffa", fontSize: 54, fontWeight: 900 }}>Dune Part Two</div>
            <div style={{ marginTop: 14, color: "rgba(239,255,250,0.55)", fontSize: 25 }}>
              2160p HDR - verified metadata - clean file list
            </div>
            <div style={{ marginTop: 38, display: "grid", gap: 16 }}>
              {["Dune.Part.Two.2024.2160p.HDR.mkv", "Subtitles / English.srt", "Poster.jpg"].map(
                (file, index) => (
                  <div
                    key={file}
                    style={{
                      height: 74,
                      borderRadius: 15,
                      border: "1px solid rgba(217,255,243,0.1)",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 22px",
                      color: index === 0 ? "#effffa" : "rgba(239,255,250,0.58)",
                      fontSize: 23,
                      background: index === 0 ? "rgba(32,169,111,0.13)" : "rgba(255,255,255,0.04)",
                    }}
                  >
                    {file}
                  </div>
                ),
              )}
            </div>
          </div>
          <div
            style={{
              borderRadius: 24,
              border: "1px solid rgba(111,255,197,0.32)",
              background: "rgba(32,169,111,0.12)",
              padding: 32,
              color: "#effffa",
            }}
          >
            <div style={{ fontSize: 26, color: "rgba(239,255,250,0.62)" }}>Best match</div>
            <div style={{ fontSize: 76, fontWeight: 900, color: "#6cffc5", marginTop: 10 }}>98</div>
            <div style={{ marginTop: 26, display: "grid", gap: 16 }}>
              <Metric label="Seeders" value="18,940" />
              <Metric label="Size" value="18.4 GB" />
              <Metric label="Provider" value="YTS" />
            </div>
          </div>
        </div>
      </BrowserShell>
    </AbsoluteFill>
  );
};

const RealDebridScene = () => {
  const frame = useCurrentFrame();
  const local = frame;

  return (
    <AbsoluteFill>
      <div style={shotLabelStyle}>Real-Debrid flow</div>
      <div
        style={{
          position: "absolute",
          inset: "280px 150px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
        }}
      >
        {flowSteps.map((step, index) => {
          const active = frameIn(local, index * 24, index * 24 + 18);
          return (
            <div
              key={step}
              style={{
                borderRadius: 26,
                border: active > 0.5 ? "1px solid rgba(111,255,197,0.76)" : "1px solid rgba(217,255,243,0.12)",
                background: active > 0.5 ? "rgba(32,169,111,0.18)" : "rgba(255,255,255,0.045)",
                display: "grid",
                placeItems: "center",
                color: "#effffa",
                fontSize: 34,
                fontWeight: 800,
                transform: `translateY(${(1 - active) * 60}px) scale(${0.94 + active * 0.06})`,
                opacity: frameIn(local, index * 12, index * 12 + 24),
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    margin: "0 auto 22px",
                    background: active > 0.5 ? "#6cffc5" : "rgba(239,255,250,0.16)",
                    color: "#04100e",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 28,
                  }}
                >
                  {index + 1}
                </div>
                {step}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 420,
          right: 420,
          bottom: 210,
          height: 92,
          borderRadius: 24,
          background: "linear-gradient(90deg, rgba(108,255,197,0.18), rgba(111,143,255,0.18))",
          border: "1px solid rgba(217,255,243,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#effffa",
          fontSize: 32,
          opacity: frameIn(local, 74, 110),
        }}
      >
        Clean link generated in one focused flow
      </div>
    </AbsoluteFill>
  );
};

const FinalBrand = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const enter = spring({ frame: local, fps: 30, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${0.72 + enter * 0.28})`,
          opacity: frameIn(local, 0, 22),
        }}
      >
        <LogoMark scale={1.45} />
        <div style={{ marginTop: 34, color: "#effffa", fontSize: 118, fontWeight: 900 }}>Torzo</div>
        <div style={{ marginTop: 14, color: "rgba(239,255,250,0.68)", fontSize: 36 }}>
          Ad-free torrent search, cleaned up.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TorzoDemo = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={86}>
        <ColdOpen />
      </Sequence>
      <Sequence from={75} durationInFrames={132}>
        <SearchScene />
      </Sequence>
      <Sequence from={185} durationInFrames={130}>
        <ProviderSweep />
      </Sequence>
      <Sequence from={300} durationInFrames={190}>
        <ResultsReveal />
      </Sequence>
      <Sequence from={470} durationInFrames={135}>
        <DetailScene />
      </Sequence>
      <Sequence from={590} durationInFrames={125}>
        <RealDebridScene />
      </Sequence>
      <Sequence from={700} durationInFrames={50}>
        <FinalBrand />
      </Sequence>
    </AbsoluteFill>
  );
};
