// tree-buy-time.jsx — Hybrid layout: center stage on the left, flowchart sidebar on the right.
// 4-node fast-and-frugal tree.

// Display defaults — formerly tweakable via tweaks-panel.jsx (removed).
const DISPLAY = {
  showExamples: true,
  showFlowchart: true,
};

// The rewritten tree.
// N1 (new) — delete-first.
// N2 — is the struggle the point? (Closely follows the original.)
// N3 — restored: do you have a higher-leverage hour ready, or will you sit anxious and lost?
// N4 — restored: stamina-bar drain (e.g. direct flight vs. layover).
const NODES = {
  N1: {
    id: 'N1',
    label: 'Can it be deleted?',
    question: 'Could this task simply be deleted, with no real consequence in a month?',
    clarify: 'Before buying or doing, ask if it must happen at all. The cheapest hour is the one you do not spend — and most lists hide at least one of these.',
    example: 'A status meeting nobody reads. A reply that does not need writing. A polish nobody will see.',
    YES: { verdict: 'DELETE',  next: null },
    NO:  { verdict: null,      next: 'N2' },
  },
  N2: {
    id: 'N2',
    label: 'Is the friction the point?',
    question: 'Is the friction of this task the actual product?',
    clarify: 'Some work cannot be outsourced because the friction is what produces the change. The struggle, the resistance, the slow grind — that is the thing itself, not a tax on the thing.',
    example: 'Lifting weights. Learning a hard new concept. Practising a craft. Sitting with a difficult emotion. Reading a hard book.',
    YES: { verdict: 'DO_IT_YOURSELF', next: null },
    NO:  { verdict: null,             next: 'N3' },
  },
  N3: {
    id: 'N3',
    label: 'Higher-leverage hour ready?',
    question: 'If I paid to remove this task, will I spend that exact hour on high-leverage work that returns more than the price — or will I just sit feeling anxious and lost?',
    clarify: 'Be honest. "I would relax" and "I would feel less rushed" do not count. The hour you buy must already have a name on it: a piece of work, a person, a rest you have actually planned for.',
    example: 'Yes: ship a chapter, take the long walk you keep deferring, sit with your kid. No: scroll, drift, refresh inbox, feel guilty about the spend.',
    YES: { verdict: null,             next: 'N4' },
    NO:  { verdict: 'DO_IT_YOURSELF', next: null },
  },
  N4: {
    id: 'N4',
    label: 'Drains the stamina bar?',
    question: 'Does this task severely drain my stamina bar?',
    clarify: 'Stamina is finite. A task that empties the well costs more than the task itself — it costs the next thing too. The classic example: pay the premium for a direct flight rather than a layover that wrecks two workdays.',
    example: 'A red-eye that wrecks two workdays. An errand that leaves you depleted before the work that matters. A meeting that scrambles deep focus for hours.',
    YES: { verdict: 'BUY_IT', next: null },
    NO:  { verdict: 'DO_IT_EFFICIENTLY', next: null },
  },
};
const NODE_ORDER = ['N1', 'N2', 'N3', 'N4'];

const VERDICTS = {
  DELETE: {
    kind: 'dont',
    stamp: 'Verdict · Delete',
    title: 'Delete it.',
    body: (<>
      The task does not need doing. Not by you, not by anyone. Cross it off,
      and <strong>do not replace it with something else.</strong> The win here
      is not just the hour you saved — it is every future recurrence you killed
      in the same stroke.
    </>),
  },
  DO_IT_YOURSELF: {
    kind: 'dont',
    stamp: 'Verdict · Do it yourself',
    title: 'Do it yourself.',
    body: (<>
      This one is not for sale. Either the friction <em>is</em> the work, or
      you have nothing better lined up to put the bought hour against.
      <strong> Pay in attention, not in money.</strong> Wanting to escape a
      task is not the same as having somewhere to escape to.
    </>),
  },
  DO_IT_EFFICIENTLY: {
    kind: 'dont',
    stamp: 'Verdict · Do it briskly',
    title: 'Do it yourself — briskly.',
    body: (<>
      Not worth deleting. Not worth outsourcing. Not draining enough to bend
      the rest of the day around. <strong>Set a timer, do it once, do it well
      enough, and move on.</strong> The trap here is not laziness — it is
      polishing what you should have merely completed.
    </>),
  },
  BUY_IT: {
    kind: 'buy',
    stamp: 'Verdict · Buy the hour',
    title: 'Buy the hour. Without flinching.',
    body: (<>
      You have a higher-leverage use already in hand, and the task would
      otherwise drain the stamina bar that powers it.
      <strong> Pay the premium and keep moving.</strong> The saved energy
      compounds straight into the work that matters most today — and that is
      a trade worth making, every time it is real.
    </>),
  },
};

function App() {
  const t = DISPLAY;
  const [path, setPath] = React.useState([]); // {nodeId, answer}[]
  const [currentId, setCurrentId] = React.useState('N1');
  const [verdict, setVerdict] = React.useState(null);

  const answer = (ans) => {
    const node = NODES[currentId];
    const branch = node[ans];
    const newPath = [...path, { nodeId: currentId, answer: ans }];
    setPath(newPath);
    if (branch.verdict) {
      setVerdict(branch.verdict);
      setCurrentId(null);
    } else {
      setCurrentId(branch.next);
    }
  };

  const restart = () => { setPath([]); setCurrentId('N1'); setVerdict(null); };

  const back = () => {
    if (path.length === 0) return;
    const newPath = path.slice(0, -1);
    setPath(newPath);
    setVerdict(null);
    if (newPath.length === 0) setCurrentId('N1');
    else {
      const last = newPath[newPath.length - 1];
      const nextId = NODES[last.nodeId][last.answer].next;
      setCurrentId(nextId);
    }
  };

  const visited = {};
  path.forEach((p) => { visited[p.nodeId] = p.answer; });

  const stepNum = path.length + 1;
  const totalSteps = NODE_ORDER.length;

  const node = currentId ? NODES[currentId] : null;
  const v = verdict ? VERDICTS[verdict] : null;

  return (
    <>
      <div className="walk">
        {/* Horizontal stepper — TOP */}
        {t.showFlowchart && (
          <nav className="flowchart" aria-label="Tree progress">
            {NODE_ORDER.map((id, i) => {
              const n = NODES[id];
              const isVisited = visited[id] != null;
              const isCurrent = currentId === id;
              return (
                <React.Fragment key={id}>
                  <div
                    className={`fc-node ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''}`}
                    title={n.label}
                    aria-label={`Step ${i+1} of ${NODE_ORDER.length}: ${n.label}`}
                  >
                    <span className="marker"></span>
                    <span className="fc-num">N{i+1}</span>
                  </div>
                  {i < NODE_ORDER.length - 1 && <div className="fc-connector" />}
                </React.Fragment>
              );
            })}
            <div className={`fc-terminal ${verdict ? 'reached' : ''}`}>
              {verdict ? VERDICTS[verdict].stamp.replace('Verdict · ', '') : 'verdict pending'}
            </div>
          </nav>
        )}

        {/* Stage — focused single column */}
        <div className="stage">
          {node && !v && (
            <>
              <div className="step-label">
                Node {stepNum}<span className="of">of</span>{totalSteps} · {node.label}
              </div>
              <div className="question">{node.question}</div>
              <div className="clarify">{node.clarify}</div>
              {t.showExamples && (
                <div className="example">{node.example}</div>
              )}
              <div className="yn-row">
                <button className="yn-btn yn-yes" onClick={() => answer('YES')}>
                  Yes
                  <span className="arrow">↓ {NODES[currentId].YES.verdict ? 'verdict' : 'continue'}</span>
                </button>
                <button className="yn-btn yn-no" onClick={() => answer('NO')}>
                  No
                  <span className="arrow">↓ {NODES[currentId].NO.verdict ? 'verdict' : 'continue'}</span>
                </button>
              </div>
              {path.length > 0 && (
                <div style={{marginTop: '32px'}}>
                  <button className="btn ghost" onClick={back}>← reconsider previous</button>
                </div>
              )}
            </>
          )}

          {v && (
            <>
              <div className="step-label">Walk complete · {path.length} {path.length === 1 ? 'question' : 'questions'} answered</div>
              <div className={`verdict ${v.kind}`}>
                <div className="stamp">{v.stamp}</div>
                <h2>{v.title}</h2>
                <div className="reasoning">{v.body}</div>
              </div>
              <div className="restart-row">
                <button className="btn accent" onClick={restart}>walk again</button>
                <button className="btn ghost" onClick={back}>← reconsider previous</button>
              </div>
            </>
          )}
        </div>
      </div>

    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
