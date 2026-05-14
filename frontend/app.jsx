// app.jsx — Gut Instinct main app shell

// ─── Backend URL ──────────────────────────────────────────────────────────────
// After deploying to Railway, paste your Railway URL here (no trailing slash).
// Example: 'https://gut-instinct-production.up.railway.app'
// Leave as empty string to always use demo data.
const BACKEND_URL = 'https://web-production-64fb7.up.railway.app';

const { useState, useEffect, useRef } = React;

// ─── Theme ────────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('gi-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('gi-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return [dark, setDark];
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ dark, setDark }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="var(--accent)" strokeWidth="1.5"/>
            <path d="M8 14 C8 10, 12 8, 14 12 C16 16, 20 14, 20 14" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <circle cx="9" cy="17" r="1.5" fill="var(--accent)" opacity="0.7"/>
            <circle cx="14" cy="19" r="1.5" fill="var(--accent)" opacity="0.5"/>
            <circle cx="19" cy="17" r="1.5" fill="var(--accent)" opacity="0.7"/>
          </svg>
          <span className="nav-brand">Gut Instinct</span>
        </div>
        <div className="nav-actions">
          <a href="#demo" className="nav-link">Try Demo</a>
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4"/><line x1="8" y1="1" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="8" y1="13.5" x2="8" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="1" y1="8" x2="2.5" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="13.5" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="3.05" y1="3.05" x2="4.1" y2="4.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="11.9" y1="11.9" x2="12.95" y2="12.95" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="11.9" y1="4.1" x2="12.95" y2="3.05" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="3.05" y1="12.95" x2="4.1" y2="11.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      <div className="hero-tag">Pharmacomicrobiomics · Clinical Decision Support</div>
      <h1 className="hero-headline">Personalized psychiatry,<br/>grounded in the gut.</h1>
      <p className="hero-sub">Gut Instinct maps a patient's microbiome against psychiatric drug pharmacokinetics — predicting how gut bacteria alter drug metabolism before the first prescription is written.</p>
      <div className="hero-ctas">
        <a href="#demo" className="btn-primary">Run a demo case</a>
        <a href="#pipeline" className="btn-ghost">How it works</a>
      </div>
      <div className="hero-disclaimer">Research prototype · Not for clinical use</div>
    </section>
  );
}

// ─── Pipeline explainer ───────────────────────────────────────────────────────
const AGENTS = [
  { n: '01', name: 'Pharmacokinetic Mapper', desc: 'Extracts CYP enzyme pathways, protein binding, and glucuronidation flags for every candidate drug.' },
  { n: '02', name: 'Ortholog Hunter', desc: "Matches human drug-metabolizing enzymes to bacterial orthologs present in the patient's microbiome." },
  { n: '03', name: 'Graph Architect', desc: 'Builds a knowledge graph and computes a metabolic interference score (0–1) for each drug.' },
  { n: '04', name: 'Clinical Interpreter', desc: 'Translates scores into tiered, clinician-readable recommendations with specific taxa and mechanisms cited.' },
];

function Pipeline() {
  return (
    <section className="pipeline" id="pipeline">
      <div className="section-label">4-Agent AI Pipeline</div>
      <h2 className="section-title">From microbiome profile to clinical guidance</h2>
      <p className="section-sub">Each agent is a Claude model with a curated system prompt and structured pharmacomicrobiomics knowledge base. Outputs chain forward — each agent builds on the last.</p>
      <div className="agents-row">
        {AGENTS.map((a, i) => (
          <React.Fragment key={a.n}>
            <div className="agent-card">
              <div className="agent-num">{a.n}</div>
              <div className="agent-name">{a.name}</div>
              <div className="agent-desc">{a.desc}</div>
            </div>
            {i < AGENTS.length - 1 && <div className="agent-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// ─── Pipeline progress ────────────────────────────────────────────────────────
const AGENT_LABELS = [
  'Pharmacokinetic Mapper',
  'Ortholog Hunter',
  'Graph Architect',
  'Clinical Interpreter',
];

function PipelineProgress({ step }) {
  return (
    <div className="pipeline-progress">
      {AGENT_LABELS.map((label, i) => {
        const done = i < step, active = i === step;
        return (
          <div key={i} className={`pp-step ${done ? 'pp-done' : active ? 'pp-active' : 'pp-waiting'}`}>
            <div className="pp-dot">
              {done ? (
                <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : active ? <div className="pp-spinner"/> : null}
            </div>
            <div className="pp-label">Agent {i + 1} · {label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Demo section ─────────────────────────────────────────────────────────────
function Demo() {
  const [selected, setSelected] = useState(null);
  const [running, setRunning]   = useState(false);
  const [step, setStep]         = useState(-1);
  const [results, setResults]   = useState(null);
  const [isLive, setIsLive]     = useState(false);
  const [error, setError]       = useState(null);
  const resultsRef = useRef(null);

  async function runCase(caseObj) {
    setSelected(caseObj.id);
    setRunning(true);
    setResults(null);
    setError(null);
    setIsLive(false);
    setStep(0);

    // Try real FastAPI backend (90 s timeout — 4 Claude API calls + potential cold start)
    let apiResult = null;
    if (BACKEND_URL) {
      try {
        const res = await Promise.race([
          fetch(`${BACKEND_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseObj.request),
          }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 90000)),
        ]);
        if (res.ok) { apiResult = await res.json(); setIsLive(true); }
      } catch {}
    }

    // Animate 4 agent steps
    const stepDelay = apiResult ? 180 : 750 + Math.random() * 350;
    for (let i = 0; i < 4; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, stepDelay));
    }
    setStep(4);
    await new Promise(r => setTimeout(r, 280));

    // Merge API result with demo data — use live data when the backend provides it
    const base = DEMO_RESULTS[caseObj.id] || {};
    let merged;
    if (apiResult) {
      // Live response — start from API result, fill visualization gaps from demo
      merged = {
        ...base,
        ...apiResult,
        // Visualization fields: prefer live, fallback to demo
        taxa: apiResult.taxa || base.taxa || [],
        drug_scores: apiResult.drug_scores || base.drug_scores || [],
        graph: apiResult.graph || base.graph || {},
        recommendation: apiResult.recommendation || base.recommendation || null,
        // Explicitly preserve raw agent outputs from live API
        agent1_output: apiResult.agent1_output || null,
        agent2_output: apiResult.agent2_output || null,
        agent3_output: apiResult.agent3_output || null,
        agent4_output: apiResult.agent4_output || null,
      };
    } else {
      // No backend — use hardcoded demo data
      merged = base;
    }

    setRunning(false);
    console.log('[GUT INSTINCT] source:', apiResult ? 'LIVE API' : 'DEMO', '| keys:', Object.keys(merged).join(', '));
    setResults(merged);

    setTimeout(() => {
      if (resultsRef.current) {
        const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  }

  return (
    <section className="demo-section" id="demo">
      <div className="section-label">Interactive Demo</div>
      <h2 className="section-title">Run a patient case</h2>
      <p className="section-sub">
        Select a demo profile to run the full 4-agent pipeline. Results are generated by a live 4-agent AI pipeline — if the backend is unavailable, pre-validated demo data loads automatically so all visualizations work immediately.
      </p>

      <div className="case-cards">
        {DEMO_CASES.map(c => (
          <button
            key={c.id}
            className={`case-card ${selected === c.id ? 'case-card--selected' : ''}`}
            onClick={() => !running && runCase(c)}
            disabled={running}
          >
            <div className="case-badge">{c.badge}</div>
            <div className="case-label">{c.label}</div>
            <div className="case-desc">{c.description}</div>
            <div className="case-run-btn">{running && selected === c.id ? 'Running…' : 'Run Analysis →'}</div>
          </button>
        ))}
      </div>

      {running && <PipelineProgress step={step} />}
      {error && <div className="error-msg">{error}</div>}
      {results && !running && (
        <div ref={resultsRef}>
          <Results data={results} isLive={isLive} />
        </div>
      )}
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">Gut Instinct</div>
      <div className="footer-note">A pharmacomicrobiomics research prototype. Not validated for clinical use. Built with Claude.</div>
    </footer>
  );
}

// ─── Tweaks ───────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": 216,
  "cardRadius": 12,
  "density": "comfortable"
}/*EDITMODE-END*/;

function Tweaks({ visible }) {
  const [vals, setVals] = useState(TWEAK_DEFAULTS);
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-hue', vals.accentHue);
    document.documentElement.style.setProperty('--radius', vals.cardRadius + 'px');
    document.documentElement.style.setProperty('--density-gap', vals.density === 'compact' ? '1rem' : vals.density === 'spacious' ? '2.5rem' : '1.75rem');
  }, [vals]);
  function update(k, v) {
    const next = { ...vals, [k]: v };
    setVals(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  }
  if (!visible) return null;
  return (
    <div className="tweaks-panel">
      <div className="tweaks-title">Tweaks</div>
      <label className="tweak-row">
        <span>Accent hue</span>
        <input type="range" min="160" max="280" value={vals.accentHue} onChange={e => update('accentHue', +e.target.value)} />
        <span className="tweak-val">{vals.accentHue}°</span>
      </label>
      <label className="tweak-row">
        <span>Card radius</span>
        <input type="range" min="4" max="24" value={vals.cardRadius} onChange={e => update('cardRadius', +e.target.value)} />
        <span className="tweak-val">{vals.cardRadius}px</span>
      </label>
      <label className="tweak-row">
        <span>Density</span>
        <select value={vals.density} onChange={e => update('density', e.target.value)}>
          <option value="compact">Compact</option>
          <option value="comfortable">Comfortable</option>
          <option value="spacious">Spacious</option>
        </select>
      </label>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  const [dark, setDark] = useTheme();
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('message', e => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  }, []);

  return (
    <>
      <Nav dark={dark} setDark={setDark} />
      <main>
        <Hero />
        <Pipeline />
        <Demo />
      </main>
      <Footer />
      <Tweaks visible={tweaksOpen} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
