// smart.jsx — Read-only conceptual primer for SMART goal-setting.
// GitHub Pages can't persist data, so this page expresses the *idea*
// (mountain, summit, milestone platforms) and the *discipline*
// (patience, consistency) — instead of capturing user input.

// Display defaults — formerly tweakable via tweaks-panel.jsx (removed).
const DISPLAY = {
  showSun: true,
  atmosphere: "dawn",
};

const SMART_LETTERS = [
  { key: 'S', word: 'Specific',
    prompt: 'What exactly. Who, where, which.',
    example: '"Run a 10K in November" — not "get fit".' },
  { key: 'M', word: 'Measurable',
    prompt: 'How will you know it is done.',
    example: 'A finish line, a number, a date someone could verify.' },
  { key: 'A', word: 'Achievable',
    prompt: 'Honest about what is in your power.',
    example: 'Bound by the hours, money, and skill you actually have.' },
  { key: 'R', word: 'Relevant',
    prompt: 'Why this, and why now.',
    example: 'It connects to a bigger thing you already care about.' },
  { key: 'T', word: 'Time-bound',
    prompt: 'By when. A real date.',
    example: 'A deadline that would feel like one if you missed it.' },
];

// Static labels for the five milestones — short evocative phrases that
// illustrate the rhythm of any climb. Not user input.
const MILESTONE_LABELS = [
  'Doable this week.',
  'Builds the habit.',
  'Halfway. Recheck.',
  'Steepens. Keep going.',
  'Within reach.',
];

// World viewBox — wide and short, like a side-scroller frame.
const VB = { w: 1600, h: 620 };

// Ground line height (y).
const GROUND_Y = 540;

// Mountain peak (where the summit card pins) and base camp.
const PEAK = { x: 1330, y: 96 };
const BASE_CAMP = { x: 200, y: GROUND_Y - 4 };

// Foreground terrain control points — defines a continuous silhouette from
// the left edge through the base camp, up the slope, over the summit and
// back down on the right. Milestones are pinned to this curve so they
// always rest on solid ground.
const TERRAIN = [
  { x: -40,  y: GROUND_Y + 0  },
  { x: 200,  y: GROUND_Y - 4  },   // base camp pad
  { x: 350,  y: GROUND_Y - 14 },
  { x: 500,  y: GROUND_Y - 32 },
  { x: 660,  y: GROUND_Y - 64 },
  { x: 820,  y: GROUND_Y - 116 },
  { x: 970,  y: GROUND_Y - 188 },
  { x: 1100, y: GROUND_Y - 270 },
  { x: 1200, y: GROUND_Y - 340 },
  { x: 1275, y: GROUND_Y - 400 },
  { x: PEAK.x, y: PEAK.y },        // summit
  { x: 1395, y: 168 },
  { x: 1480, y: 280 },
  { x: 1600, y: 400 },
  { x: 1640, y: 440 },
];

const smoothstep = (t) => t * t * (3 - 2 * t);

// Returns the terrain y at any x along the slope.
function terrainY(x) {
  if (x <= TERRAIN[0].x) return TERRAIN[0].y;
  if (x >= TERRAIN[TERRAIN.length - 1].x) return TERRAIN[TERRAIN.length - 1].y;
  for (let i = 0; i < TERRAIN.length - 1; i++) {
    const a = TERRAIN[i], b = TERRAIN[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x);
      return a.y + (b.y - a.y) * smoothstep(t);
    }
  }
  return GROUND_Y;
}

// Sample the terrain into points for path drawing.
function sampleTerrain(xFrom, xTo, samples = 100) {
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const x = xFrom + ((xTo - xFrom) * i) / samples;
    pts.push([x, terrainY(x)]);
  }
  return pts;
}

// Filled foreground terrain path (closed below).
const TERRAIN_FILL_PATH = (() => {
  const pts = sampleTerrain(0, VB.w, 120);
  let d = `M 0 ${VB.h}`;
  for (const [x, y] of pts) d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  d += ` L ${VB.w} ${VB.h} Z`;
  return d;
})();

// Stroked silhouette path along the top of the terrain.
const TERRAIN_STROKE_PATH = (() => {
  const pts = sampleTerrain(0, VB.w, 120);
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
})();

// Distant background ridge — pale silhouette to add depth.
const RIDGE_FAR_PATH = (() => {
  const ctrl = [
    [-40, 470], [120, 430], [240, 458], [380, 420], [520, 446],
    [660, 408], [800, 432], [940, 396], [1080, 420], [1220, 388],
    [1360, 414], [1500, 380], [1640, 410],
  ];
  let d = `M -40 ${VB.h}`;
  for (const [x, y] of ctrl) d += ` L ${x} ${y}`;
  d += ` L 1640 ${VB.h} Z`;
  return d;
})();

// Mid-distance ridge — slightly closer, more saturated.
const RIDGE_MID_PATH = (() => {
  const ctrl = [
    [-40, 510], [80, 462], [220, 484], [360, 432], [500, 460],
    [640, 408], [780, 442], [920, 386], [1060, 422], [1200, 362],
    [1340, 408], [1480, 350], [1640, 388],
  ];
  let d = `M -40 ${VB.h}`;
  for (const [x, y] of ctrl) d += ` L ${x} ${y}`;
  d += ` L 1640 ${VB.h} Z`;
  return d;
})();

// Snow cap path — a soft white wedge that sits on the upper slope.
const SNOW_PATH = (() => {
  // Sample terrain near peak and offset slightly downward for the snow line.
  const left = sampleTerrain(1180, PEAK.x, 24);
  const right = sampleTerrain(PEAK.x, 1430, 18);
  let d = `M ${left[0][0].toFixed(1)} ${left[0][1].toFixed(1)}`;
  for (const [x, y] of left.slice(1)) d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  for (const [x, y] of right.slice(1)) d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  // Closing line — undulating snow line back across the slope.
  d += ` L 1430 ${(terrainY(1430) + 26).toFixed(1)}`;
  d += ` L 1380 ${(terrainY(1380) + 36).toFixed(1)}`;
  d += ` L 1320 ${(terrainY(1320) + 32).toFixed(1)}`;
  d += ` L 1260 ${(terrainY(1260) + 44).toFixed(1)}`;
  d += ` L 1210 ${(terrainY(1210) + 36).toFixed(1)}`;
  d += ` L 1180 ${(terrainY(1180) + 28).toFixed(1)} Z`;
  return d;
})();

// Milestone platforms — distribute n platforms along the climb on the slope.
function buildPlatforms(count) {
  // Start well right of base camp so the M1 callout clears the
  // "today · base camp" pill on desktop. End below the snow line so
  // platforms remain visually grounded.
  const xStart = 440;
  const xEnd = 1170;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const x = xStart + (xEnd - xStart) * t;
    pts.push({ x, y: terrainY(x) });
  }
  return pts;
}

function App() {
  const t = DISPLAY;

  const platforms = React.useMemo(
    () => buildPlatforms(MILESTONE_LABELS.length),
    []
  );

  // On mobile the overlay cards are compact pins by default; tapping one
  // expands it to reveal the text. On desktop the .open class has no
  // effect because the expand styles live inside the mobile media query.
  const [openMarker, setOpenMarker] = React.useState(null);
  const toggle = (id) => (e) => {
    e.stopPropagation();
    setOpenMarker((prev) => (prev === id ? null : id));
  };
  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('.summit-card, .ms-callout, .base-label')) {
        setOpenMarker(null);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Atmosphere — blue-sky variants for the "life is a game" world.
  const atm = {
    plain:    { sky1: 'oklch(0.995 0.008 235)', skyMid: 'oklch(0.97 0.025 240)', sky2: 'oklch(0.92 0.045 240)' },
    dawn:     { sky1: 'oklch(0.995 0.012 245)', skyMid: 'oklch(0.96 0.03 250)',  sky2: 'oklch(0.88 0.06 245)' },
    dusk:     { sky1: 'oklch(0.95 0.04 50)',    skyMid: 'oklch(0.85 0.06 30)',   sky2: 'oklch(0.70 0.08 290)' },
    midday:   { sky1: 'oklch(0.995 0.015 230)', skyMid: 'oklch(0.96 0.04 232)',  sky2: 'oklch(0.84 0.075 235)' },
    overcast: { sky1: 'oklch(0.995 0.005 240)', skyMid: 'oklch(0.96 0.01 240)',  sky2: 'oklch(0.90 0.018 240)' },
  }[t.atmosphere] || { sky1: 'oklch(0.99 0.012 235)', skyMid: 'oklch(0.96 0.025 240)', sky2: 'oklch(0.93 0.04 240)' };

  // Trail follows the actual terrain — dashed line tracing the slope from
  // base camp up and over to the summit.
  const trailPath = React.useMemo(() => {
    const pts = sampleTerrain(BASE_CAMP.x, PEAK.x, 80).map(([x, y]) => [x, y - 3]);
    return pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  }, []);

  return (
    <>
      {/* The 2D world */}
      <div className="world">
        <svg className="world-svg" viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Sky — three-stop gradient with a soft horizon haze */}
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={atm.sky1} />
              <stop offset="55%"  stopColor={atm.skyMid} />
              <stop offset="100%" stopColor={atm.sky2} />
            </linearGradient>

            {/* Far ridge — palest blue */}
            <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="oklch(0.86 0.03 245)" />
              <stop offset="100%" stopColor="oklch(0.80 0.045 247)" />
            </linearGradient>

            {/* Mid ridge — slightly more saturated */}
            <linearGradient id="ridgeMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="oklch(0.72 0.06 250)" />
              <stop offset="100%" stopColor="oklch(0.62 0.085 252)" />
            </linearGradient>

            {/* Foreground terrain — deepest, with light from the upper-left */}
            <linearGradient id="terrainFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="oklch(0.50 0.11 252)" />
              <stop offset="55%"  stopColor="oklch(0.40 0.13 254)" />
              <stop offset="100%" stopColor="oklch(0.30 0.14 256)" />
            </linearGradient>

            {/* Snow cap — soft white-to-pale-blue */}
            <linearGradient id="snowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="oklch(0.99 0.005 240)" />
              <stop offset="100%" stopColor="oklch(0.92 0.025 240)" />
            </linearGradient>

            {/* Light side overlay — gentle highlight on the left face */}
            <linearGradient id="terrainLight" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%"  stopColor="oklch(0.80 0.05 240)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="oklch(0.50 0.10 252)" stopOpacity="0" />
            </linearGradient>

            {/* Soft drop-shadow for the platform pads */}
            <filter id="padShadow" x="-30%" y="-50%" width="160%" height="200%">
              <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="oklch(0.20 0.08 254)" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width={VB.w} height={VB.h} fill="url(#sky)" />

          {/* Sun */}
          {t.showSun && (
            <g>
              <circle cx="260" cy="170" r="64" fill="oklch(0.96 0.04 70)"  opacity="0.22" />
              <circle cx="260" cy="170" r="44" fill="oklch(0.97 0.035 70)" opacity="0.45" />
              <circle cx="260" cy="170" r="28" fill="oklch(0.99 0.02 70)" />
            </g>
          )}

          {/* Far parallax ridge */}
          <path d={RIDGE_FAR_PATH} fill="url(#ridgeFar)" opacity="0.85" />

          {/* Mid parallax ridge */}
          <path d={RIDGE_MID_PATH} fill="url(#ridgeMid)" opacity="0.75" />

          {/* Foreground terrain — single continuous slope */}
          <path d={TERRAIN_FILL_PATH} fill="url(#terrainFill)" />
          {/* Subtle highlight on the lit (left) face */}
          <path d={TERRAIN_FILL_PATH} fill="url(#terrainLight)" />
          {/* Crisp silhouette stroke on top of the terrain */}
          <path d={TERRAIN_STROKE_PATH}
            fill="none" stroke="oklch(0.22 0.10 254)" strokeWidth="1.4"
            strokeLinejoin="round" opacity="0.55" />

          {/* Subtle ridge line — a darker spine running down from the peak */}
          <path
            d={`M ${PEAK.x} ${PEAK.y + 4}
                Q ${PEAK.x - 18} ${PEAK.y + 80}, ${PEAK.x - 30} ${PEAK.y + 160}
                T ${PEAK.x - 60} ${PEAK.y + 320}`}
            fill="none" stroke="oklch(0.20 0.10 254)" strokeWidth="1.2"
            opacity="0.20" strokeLinecap="round" />

          {/* Snow cap (drawn on top of the terrain) */}
          <path d={SNOW_PATH} fill="url(#snowFill)" />
          {/* Snow undertone — a single subtle stroke along the snow line */}
          <path d={SNOW_PATH} fill="none" stroke="oklch(0.78 0.03 240)"
            strokeWidth="0.8" opacity="0.45" />

          {/* Ground horizon shadow — faint band where ground meets sky */}
          <rect x="0" y={GROUND_Y - 1} width={VB.w} height="2"
            fill="oklch(0.30 0.10 252)" opacity="0.15" />

          {/* Trail — dashed path tracing the actual terrain from base camp to summit */}
          <path d={trailPath}
            fill="none" stroke="var(--accent)" strokeWidth="1.6"
            strokeDasharray="3 6" strokeLinecap="round" opacity="0.85" />

          {/* Platform pads — each rests ON the slope at terrainY(x) */}
          {platforms.map((p, i) => {
            // tilt the platform slightly to match the slope angle
            const dx = 8;
            const slopeY1 = terrainY(p.x - dx);
            const slopeY2 = terrainY(p.x + dx);
            const angle = (Math.atan2(slopeY2 - slopeY1, dx * 2) * 180) / Math.PI;
            return (
              <g key={`pad-${i}`} transform={`translate(${p.x} ${p.y}) rotate(${angle})`}>
                {/* shadow on slope */}
                <ellipse cx="1" cy="2.5" rx="22" ry="2.2" fill="oklch(0.18 0.08 254)" opacity="0.28" />
                {/* the ledge */}
                <rect x="-22" y="-4" width="44" height="6" rx="1.2"
                  fill="oklch(0.97 0.018 240)"
                  stroke="oklch(0.30 0.12 254)" strokeWidth="1" filter="url(#padShadow)" />
                {/* pin marker */}
                <circle cx="0" cy="-4" r="3.6" fill="white"
                  stroke="var(--accent)" strokeWidth="1.6" />
                {/* number label */}
                <text x="0" y="-11" textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace" fontSize="9"
                  fontWeight="600" fill="var(--accent-ink)"
                  transform={`rotate(${-angle})`}>M{i+1}</text>
              </g>
            );
          })}

          {/* Pine trees scattered on the lower terrain */}
          {[
            [120, 0.95], [250, 0.9], [310, 0.8],
            [430, 0.85], [560, 0.75], [690, 0.7],
          ].map(([tx, scale], i) => {
            const ty = terrainY(tx);
            const h = 28 * scale;
            return (
              <g key={`tree-${i}`} transform={`translate(${tx} ${ty})`} opacity="0.85">
                {/* trunk */}
                <rect x="-1" y={-h * 0.35} width="2" height={h * 0.35} fill="oklch(0.34 0.06 60)" />
                {/* foliage triangles */}
                <path d={`M 0 ${-h} L ${5 * scale} ${-h * 0.55} L ${-5 * scale} ${-h * 0.55} Z`}
                  fill="oklch(0.42 0.09 160)" />
                <path d={`M 0 ${-h * 0.78} L ${6.5 * scale} ${-h * 0.35} L ${-6.5 * scale} ${-h * 0.35} Z`}
                  fill="oklch(0.40 0.10 160)" />
              </g>
            );
          })}

          {/* Climber figure standing at base camp */}
          <g transform={`translate(${BASE_CAMP.x} ${BASE_CAMP.y})`}>
            {/* shadow under climber */}
            <ellipse cx="6" cy="0" rx="14" ry="2" fill="oklch(0.18 0.08 254)" opacity="0.25" />
            {/* small base-camp flag */}
            <line x1="-22" y1="-46" x2="-22" y2="-2" stroke="var(--ink)" strokeWidth="1.2" />
            <path d="M -22 -46 L -4 -41 L -22 -36 Z" fill="var(--accent)" />
            {/* backpack */}
            <rect x="2" y="-22" width="6" height="9" rx="1.5" fill="oklch(0.34 0.10 252)" />
            {/* head */}
            <circle cx="7" cy="-29" r="4.5" fill="var(--accent-deep)" />
            {/* body */}
            <line x1="7" y1="-25" x2="7" y2="-12" stroke="var(--accent-deep)" strokeWidth="2" strokeLinecap="round" />
            {/* arms */}
            <line x1="7" y1="-22" x2="0"  y2="-15" stroke="var(--accent-deep)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="7" y1="-22" x2="15" y2="-17" stroke="var(--accent-deep)" strokeWidth="1.6" strokeLinecap="round" />
            {/* legs */}
            <line x1="7" y1="-12" x2="2"  y2="-1"  stroke="var(--accent-deep)" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="-12" x2="13" y2="-1"  stroke="var(--accent-deep)" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Summit flag at peak */}
          <g>
            <line x1={PEAK.x} y1={PEAK.y} x2={PEAK.x} y2={PEAK.y - 38}
              stroke="var(--accent-deep)" strokeWidth="1.4" />
            <path d={`M ${PEAK.x} ${PEAK.y - 38} L ${PEAK.x + 22} ${PEAK.y - 32} L ${PEAK.x} ${PEAK.y - 26} Z`}
              fill="var(--warm)" stroke="var(--warm-ink)" strokeWidth="1" />
          </g>
        </svg>

        {/* SUMMIT card pinned above the peak — static label */}
        <div
          className={`summit-card ${openMarker === 'summit' ? 'open' : ''}`}
          onClick={toggle('summit')}
          style={{
            left: `${(PEAK.x / VB.w) * 100}%`,
            top:  `${((PEAK.y - 16) / VB.h) * 100}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="ribbon">
            <span>The Summit · Goal</span>
            <span className="alt">peak</span>
          </div>
          <div className="summit-title">The peak.</div>
          <div className="summit-sub">One sentence. SMART. Worth the climb.</div>
        </div>

        {/* Milestone callouts above each platform — static labels */}
        {platforms.map((p, i) => (
          <div
            key={i}
            className={`ms-callout ${openMarker === `m${i}` ? 'open' : ''}`}
            onClick={toggle(`m${i}`)}
            style={{
              left: `${(p.x / VB.w) * 100}%`,
              top:  `${((p.y - 18) / VB.h) * 100}%`,
            }}
          >
            <span className="ms-num">M{i+1}</span>
            <span className="mc-text">{MILESTONE_LABELS[i]}</span>
          </div>
        ))}

        {/* "You are here" label above climber */}
        <div
          className={`base-label ${openMarker === 'base' ? 'open' : ''}`}
          onClick={toggle('base')}
          style={{
            left: `${(BASE_CAMP.x / VB.w) * 100}%`,
            top:  `${((BASE_CAMP.y - 60) / VB.h) * 100}%`,
          }}
        >
          <span className="bl-text">today · base camp</span>
        </div>
      </div>

      {/* SMART criteria — static info cards */}
      <div className="smart-strip">
        {SMART_LETTERS.map((c) => (
          <div key={c.key} className="smart-cell">
            <div className="letter">{c.key}</div>
            <div className="key">{c.word}</div>
            <div className="prompt">{c.prompt}</div>
            <div className="example">{c.example}</div>
          </div>
        ))}
      </div>

      {/* Patience / consistency reminder */}
      <div className="patience-card">
        <svg className="glyph" viewBox="0 0 38 38" fill="none">
          {/* simple sprout / growth glyph */}
          <path d="M19 33 L19 19" stroke="var(--moss-ink)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 19 C 12 19, 9 14, 9 9 C 14 9, 19 12, 19 19 Z" fill="var(--moss)" opacity="0.8" />
          <path d="M19 22 C 26 22, 29 17, 29 12 C 24 12, 19 15, 19 22 Z" fill="var(--moss-ink)" opacity="0.7" />
          <line x1="11" y1="33" x2="27" y2="33" stroke="var(--moss-ink)" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <div>
          <div className="lbl">The point</div>
          <div className="headline">Reach each platform before reaching for the next.</div>
          <div className="body">
            The mountain is not climbed in a leap. It is climbed by being
            <em> consistent </em> on the platform you are on, and
            <em> patient </em> with the one ahead. Skip a platform and the next one
            collapses under you. Stay too long and the summit drifts.
            The work is to keep showing up — small steps, in order, repeatedly.
          </div>
        </div>
      </div>

      <div className="editorial-note">
        <div className="lbl">A note on milestones</div>
        <div className="body">
          The first three milestones should be possible to begin <em>this week</em>.
          If they are not, the goal is too far — bring it nearer, or sharpen the M.
        </div>
      </div>

    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
