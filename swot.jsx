// swot.jsx — Four quadrants. Internal/External × Helpful/Harmful.

// Display defaults — formerly tweakable via tweaks-panel.jsx (removed).
const DISPLAY = {
  showAxes: true,
  showPrompts: true,
};

const QUADS = [
  { key: 'S', cls: 'q-S', name: 'Strengths',     prompt: 'Inside you. Helps you. What can you reliably draw on.', axis: ['internal','helpful'] },
  { key: 'W', cls: 'q-W', name: 'Weaknesses',    prompt: 'Inside you. Hinders you. What you would not say aloud.', axis: ['internal','harmful'] },
  { key: 'O', cls: 'q-O', name: 'Opportunities', prompt: 'Outside you. Helps you, if you act. Doors not yet closed.', axis: ['external','helpful'] },
  { key: 'T', cls: 'q-T', name: 'Threats',       prompt: 'Outside you. Hinders you. What you cannot wish away.', axis: ['external','harmful'] },
];

function App() {
  const t = DISPLAY;
  const [active, setActive] = React.useState(null);
  const [items, setItems] = React.useState({
    S: [{id:1,text:''},{id:2,text:''},{id:3,text:''}],
    W: [{id:1,text:''},{id:2,text:''},{id:3,text:''}],
    O: [{id:1,text:''},{id:2,text:''},{id:3,text:''}],
    T: [{id:1,text:''},{id:2,text:''},{id:3,text:''}],
  });
  const nextId = React.useRef(10);

  const update = (k, id, text) => setItems((p) => ({...p, [k]: p[k].map(i => i.id===id ? {...i, text} : i)}));
  const remove = (k, id) => setItems((p) => ({...p, [k]: p[k].filter(i => i.id !== id)}));
  const add = (k) => setItems((p) => ({...p, [k]: [...p[k], {id: nextId.current++, text:''}]}));

  return (
    <>
      <div className="swot-frame">
        {t.showAxes && <div className="swot-axis-top"><span>↑ Helpful</span></div>}
        {t.showAxes && <div className="swot-axis-bot"><span>↓ Harmful</span></div>}
        {t.showAxes && <div className="swot-axis-l"><span>Internal</span></div>}
        {t.showAxes && <div className="swot-axis-r"><span>External</span></div>}

        {QUADS.map((q) => (
          <div key={q.key}
               className={`quad ${q.cls} ${active === q.key ? 'active' : ''}`}
               onClick={() => setActive(q.key)}>
            <div className="quad-head">
              <span className="quad-letter">{q.key}</span>
              <span className="quad-name">{q.name}</span>
            </div>
            {t.showPrompts && <div className="quad-prompt">{q.prompt}</div>}
            <div className="swot-list">
              {items[q.key].map((it, i) => (
                <div className="swot-item" key={it.id}>
                  <span className="bullet">{(i+1).toString().padStart(2,'0')}</span>
                  <input type="text" value={it.text}
                    placeholder="—"
                    onFocus={() => setActive(q.key)}
                    onChange={(e) => update(q.key, it.id, e.target.value)} />
                  <button className="x" onClick={(e) => { e.stopPropagation(); remove(q.key, it.id); }}>×</button>
                </div>
              ))}
            </div>
            <button className="swot-add" onClick={(e) => { e.stopPropagation(); add(q.key); }}>+ add</button>
          </div>
        ))}
      </div>

      <div className="swot-legend">
        <div className="lbl">A note on honesty</div>
        <div className="body">
          The honest SWOT is unpleasant to read back. If yours flatters you,
          you have written a poster, not an assessment. Try again with the
          person you are at three in the morning.
        </div>
      </div>

    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
