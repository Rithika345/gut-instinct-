// app.jsx — Gut Instinct (lilac, spacious, single-column)

const BACKEND_URL = '';
const { useState, useEffect, useRef } = React;

// ─── Theme ────────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('gi-theme') === 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('gi-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return [dark, setDark];
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ dark, setDark }) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <a href="#top" className="topbar-brand">
          <span className="topbar-mark"></span>
          Gut Instinct
        </a>
        <nav className="topbar-nav">
          <a className="topbar-link" href="#about">About</a>
          <a className="topbar-link" href="#cases">Cases</a>
          <button className="topbar-toggle" onClick={() => setDark(!dark)}>
            {dark ? 'Light' : 'Dim'}
          </button>
        </nav>
      </div>
    </div>);

}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-eyebrow">Pharmacomicrobiomics · Clinical Decision Support</div>
      <h1 className="hero-title" style={{ fontFamily: "Spectral", color: "rgb(56, 1, 106)" }}>Gut <em>Instinct</em></h1>
      <p className="hero-dek">
        Reading a patient&rsquo;s microbiome against psychiatric pharmacokinetics &mdash;
        predicting how gut bacteria will alter drug metabolism before the prescription is written.
      </p>
      <div className="hero-byline">
        <span>Built by <strong>Rithika Krishna Perugupalli</strong> &amp; <strong>Aparna Ganapathi Basavapatna</strong></span>
        <span className="sep">·</span>
        <span>UCDSOM MedXEngineering Hackathon</span>
        <span className="sep">·</span>
        <span>Not for clinical use</span>
      </div>
    </header>);

}

// ─── Method / About ───────────────────────────────────────────────────────────
const AGENTS = [
{
  n: '01',
  name: 'Pharmacokinetic Mapper',
  desc: 'Extracts CYP enzyme pathways, protein binding, and glucuronidation flags for every candidate drug.'
},
{
  n: '02',
  name: 'Microbiome Interaction Mapper',
  desc: 'Identifies bacterial drug-metabolizing enzymes — oxidoreductases, hydrolases, β-glucuronidases — and maps them to each drug.'
},
{
  n: '03',
  name: 'Graph Architect',
  desc: 'Builds a knowledge graph linking taxa to drugs and computes a metabolic interference score (0–100) for each.'
},
{
  n: '04',
  name: 'Clinical Interpreter',
  desc: 'Translates scores into tiered, clinician-readable recommendations with the specific taxa and mechanisms cited.'
}];


function About() {
  return (
    <section className="section" id="about">
      <div className="section-head">
        <div className="section-eyebrow">How it works</div>
        <h2 className="section-title">A four-agent pipeline, from microbiome profile to clinical guidance.</h2>
        <p className="section-lede">
          Each agent is a Claude model with a curated system prompt and a structured pharmacomicrobiomics knowledge base. Outputs chain forward.
        </p>
      </div>

      <div className="prose">
        <p>
          Microbial metabolism is the unmeasured variable in psychiatric prescribing. The gut harbours β-glucuronidases that can reactivate conjugated drug metabolites, oxidoreductases that degrade serotonergic agents before first-pass metabolism finishes, and pathway redundancies that quietly absorb half the intended dose. None of this appears on a CYP genotype panel.
        </p>
        <p>
          Gut Instinct reads a 16S abundance profile against a candidate drug list and predicts where microbial pharmacokinetics will diverge from the textbook. Every score is traceable back to the taxa, enzymes, and mechanisms responsible for the call.
        </p>
      </div>

      <div className="pipeline">
        {AGENTS.map((a) =>
        <div key={a.n} className="pipeline-step">
            <div className="pipeline-num">Agent {a.n}</div>
            <div className="pipeline-name">{a.name}</div>
            <div className="pipeline-desc">{a.desc}</div>
          </div>
        )}
      </div>
    </section>);

}

// ─── Pipeline progress ────────────────────────────────────────────────────────
const AGENT_LABELS = [
'Pharmacokinetic Mapper',
'Microbiome Interaction Mapper',
'Graph Architect',
'Clinical Interpreter'];


function PipelineProgress({ step }) {
  const stageText = step >= 4 ? 'Complete' : step >= 0 ? `Step ${step + 1} of 4` : 'Idle';
  return (
    <div className="progress">
      <div className="progress-head">
        <span className="progress-title">Running pipeline</span>
        <span className="progress-stage">{stageText}</span>
      </div>
      <div className="progress-steps">
        {AGENT_LABELS.map((label, i) => {
          const done = i < step,active = i === step;
          const cls = done ? 'progress-step--done' : active ? 'progress-step--active' : '';
          return (
            <div key={i} className={`progress-step ${cls}`}>
              <div className="progress-num">
                {done ? '✓ ' : ''}Agent {String(i + 1).padStart(2, '0')}
              </div>
              <div className="progress-label">{label}</div>
            </div>);

        })}
      </div>
    </div>);

}

// ─── Cases ────────────────────────────────────────────────────────────────────
function Cases() {
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [results, setResults] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  async function runCase(caseObj) {
    setSelected(caseObj.id);
    setRunning(true);
    setResults(null);
    setError(null);
    setIsLive(false);
    setStep(0);

    let apiResult = null;
    if (BACKEND_URL) {
      try {
        const res = await Promise.race([
        fetch(`${BACKEND_URL}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(caseObj.request)
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 90000))]
        );
        if (res.ok) {apiResult = await res.json();setIsLive(true);}
      } catch {}
    }

    const stepDelay = apiResult ? 220 : 750 + Math.random() * 300;
    for (let i = 0; i < 4; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, stepDelay));
    }
    setStep(4);
    await new Promise((r) => setTimeout(r, 260));

    const base = DEMO_RESULTS[caseObj.id];
    let merged;
    if (apiResult && apiResult.taxa && apiResult.drug_scores && apiResult.graph) {
      merged = apiResult;
    } else if (apiResult) {
      merged = {
        ...base,
        ...apiResult,
        taxa: apiResult.taxa || base.taxa,
        drug_scores: apiResult.drug_scores || base.drug_scores,
        graph: apiResult.graph || base.graph,
        recommendation: apiResult.recommendation || base.recommendation
      };
    } else {
      merged = base;
    }

    setRunning(false);
    setResults(merged);

    setTimeout(() => {
      if (resultsRef.current) {
        const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 30;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 120);
  }

  return (
    <section className="section" id="cases">
      <div className="section-head">
        <div className="section-eyebrow">Try a demo case</div>
        <h2 className="section-title">Select a patient profile to run.</h2>
        <p className="section-lede">
          Four pre-validated scenarios. Clicking a case runs the full four-agent pipeline and renders a tiered drug recommendation, a microbiome interaction graph, and structural evidence.
        </p>
      </div>

      <div className="cases">
        {DEMO_CASES.map((c, i) => {
          const num = String(i + 1).padStart(2, '0');
          const isSel = selected === c.id;
          return (
            <button
              key={c.id}
              className="case"
              aria-pressed={isSel}
              onClick={() => !running && runCase(c)}
              disabled={running}>
              
              <div className="case-num">{num}</div>
              <div className="case-body">
                <div className="case-diag">{c.badge}</div>
                <div className="case-desc">{c.description}</div>
                <div className="case-meta">
                  {c.request.prior_failures?.length > 0 &&
                  <span className="tag tag--red">Prior failure: {c.request.prior_failures.join(', ')}</span>
                  }
                  {c.request.current_medications?.length > 0 &&
                  <span className="tag tag--amber">Current: {c.request.current_medications.join(', ')}</span>
                  }
                  {!c.request.prior_failures?.length && !c.request.current_medications?.length &&
                  <span className="tag">No prior treatment</span>
                  }
                </div>
              </div>
              <div className={`case-action ${running && isSel ? 'case-action--running' : ''}`}>
                {running && isSel ?
                <>Running pipeline<span className="case-action-arrow">…</span></> :

                <>Run analysis<span className="case-action-arrow">→</span></>
                }
              </div>
            </button>);

        })}
      </div>

      {running && <PipelineProgress step={step} />}
      {error && <div className="error-msg">{error}</div>}
      {results && !running &&
      <div ref={resultsRef}>
          <Results data={results} isLive={isLive} />
        </div>
      }
    </section>);

}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-mark">Gut Instinct</div>
      <div className="footer-text">
        A pharmacomicrobiomics research prototype by <strong>Rithika Krishna Perugupalli</strong> &amp; <strong>Aparna Ganapathi Basavapatna</strong>.
        Built for the UCDSOM MedXEngineering Hackathon. Not validated for clinical decision-making.
      </div>
    </footer>);

}

// ─── Tweaks ───────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lilacHue": 295,
  "lilacIntensity": 0.014,
  "density": "comfortable"
} /*EDITMODE-END*/;

function Tweaks({ visible, onClose }) {
  const [vals, setVals] = useState(TWEAK_DEFAULTS);
  const firstRun = useRef(true);
  useEffect(() => {
    // Skip the initial run so the hand-tuned CSS defaults stay intact.
    if (firstRun.current) {firstRun.current = false;return;}
    const h = vals.lilacHue;
    const c = vals.lilacIntensity;
    document.documentElement.style.setProperty('--bg', `oklch(0.957 ${c} ${h})`);
    document.documentElement.style.setProperty('--bg-deep', `oklch(0.93 ${c * 1.6} ${h})`);
    document.documentElement.style.setProperty('--accent-wash', `oklch(0.92 ${c * 2.8} ${h})`);
    document.documentElement.style.setProperty('--accent', `oklch(0.48 ${Math.max(c * 12, 0.12)} ${h})`);
    document.documentElement.style.setProperty('--accent-2', `oklch(0.6 ${Math.max(c * 9, 0.09)} ${h})`);
    document.documentElement.style.setProperty('--rule', `oklch(0.89 ${c * 1.8} ${h})`);
    document.documentElement.style.setProperty('--rule-soft', `oklch(0.93 ${c * 1.2} ${h})`);
    document.documentElement.style.fontSize =
    vals.density === 'compact' ? '15.5px' :
    vals.density === 'spacious' ? '18.5px' : '17px';
  }, [vals]);
  function update(k, v) {
    const next = { ...vals, [k]: v };
    setVals(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  }
  if (!visible) return null;
  return (
    <div className="tweaks">
      <div className="tweaks-head">
        <span className="tweaks-title">Tweaks</span>
        <button className="tweaks-close" onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className="tweaks-body">
        <div className="tweak-row">
          <div className="tweak-row-head">
            <span>Lilac hue</span>
            <span className="tweak-val">{vals.lilacHue}°</span>
          </div>
          <input type="range" min="260" max="330" value={vals.lilacHue} onChange={(e) => update('lilacHue', +e.target.value)} />
        </div>
        <div className="tweak-row">
          <div className="tweak-row-head">
            <span>Lilac intensity</span>
            <span className="tweak-val">{vals.lilacIntensity.toFixed(3)}</span>
          </div>
          <input type="range" min="0.005" max="0.04" step="0.002" value={vals.lilacIntensity} onChange={(e) => update('lilacIntensity', +e.target.value)} />
        </div>
        <div className="tweak-row">
          <div className="tweak-row-head">
            <span>Density</span>
            <span className="tweak-val">{vals.density}</span>
          </div>
          <select value={vals.density} onChange={(e) => update('density', e.target.value)}>
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </div>
    </div>);

}

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  const [dark, setDark] = useTheme();
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  function closeTweaks() {
    setTweaksOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  }

  return (
    <>
      <TopBar dark={dark} setDark={setDark} />
      <div className="page">
        <Hero />
        <About />
        <Cases />
        <Footer />
      </div>
      <Tweaks visible={tweaksOpen} onClose={closeTweaks} />
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);