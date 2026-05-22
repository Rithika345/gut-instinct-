// landing.jsx — Hero, problem statement, and three mechanisms

const MECHANISMS = [
  {
    id: 'enzymatic',
    title: 'Enzymatic Mimicry',
    sub: 'Drug-metabolizing enzymes in gut bacteria',
    body: 'Gut bacteria carry oxidoreductases, nitroreductases, and hydrolases capable of metabolizing drugs in the gut lumen before systemic absorption. Zimmermann et al. (2019) screened 76 bacterial species against 271 drugs and found 176 were significantly metabolized — through non-CYP mechanisms distinct from human liver enzymes.',
    ref: 'Zimmermann et al. 2019, Nature · Wallace et al. 2010',
  },
  {
    id: 'hijacking',
    title: 'Drug Hijacking',
    sub: 'Direct microbial inactivation',
    body: 'Certain taxa inactivate specific drugs via specialized reductive chemistry. E. lenta\'s cardiac glycoside reductase (cgr operon) inactivates digoxin — the clearest validated proof-of-concept. Analogous mechanisms likely govern psychiatric drug response in colonized patients.',
    ref: 'Haiser et al. 2013, Science · Koppel et al. 2017',
  },
  {
    id: 'enterohepatic',
    title: 'Enterohepatic Reactivation',
    sub: 'β-Glucuronidase cycling',
    body: 'Drugs conjugated to glucuronic acid in the liver are excreted in bile. Bacterial β-glucuronidase (GUS) enzymes — produced by E. coli, B. fragilis, R. gnavus — cleave these conjugates, releasing free drug for reabsorption. For venlafaxine, whose active metabolite ODV is primarily eliminated via glucuronidation, this creates erratic and unpredictable plasma cycling.',
    ref: 'Pollet et al. 2017 · Wallace et al. 2010',
  },
];

function MechIcon({ id }) {
  if (id === 'enzymatic') return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="var(--accent)" strokeWidth="1.2"/>
      <path d="M7 16 C7 11 11 9 16 12 C21 15 25 13 25 16" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
      <circle cx="16" cy="16" r="2.2" fill="var(--accent)" opacity="0.5"/>
      <circle cx="9" cy="20" r="1.4" fill="var(--accent)" opacity="0.35"/>
      <circle cx="23" cy="20" r="1.4" fill="var(--accent)" opacity="0.35"/>
    </svg>
  );
  if (id === 'hijacking') return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="7" stroke="var(--accent)" strokeWidth="1.2"/>
      <line x1="9" y1="16" x2="21" y2="16" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round"/>
      <polyline points="17,11 22,16 17,21" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="9" y1="11" x2="9" y2="21" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="var(--accent)" strokeWidth="1.2"/>
      <path d="M16 5 C22 5 27 10 27 16" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
      <path d="M27 16 C27 22 22 27 16 27" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="3 3" fill="none"/>
      <path d="M16 27 C10 27 5 22 5 16" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
      <path d="M5 16 C5 10 10 5 16 5" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="3 3" fill="none"/>
      <circle cx="27" cy="16" r="2.5" fill="var(--accent)" opacity="0.7"/>
      <circle cx="5" cy="16" r="2.5" fill="var(--accent)" opacity="0.35"/>
    </svg>
  );
}

function Landing() {
  return (
    <div className="landing-wrap">

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="lh-inner">
          <div className="lh-eyebrow">Pharmacomicrobiomics · Clinical Decision Support</div>
          <h1 className="lh-headline">
            Stop guessing which<br/>psych med works.<br/>
            <span className="lh-headline-accent">Use the gut to find out.</span>
          </h1>
          <p className="lh-body">
            70% of psychiatric patients cycle through multiple medications before finding one that works.
            Pharmacogenomics explains only part of why. The gut microbiome — largely ignored — explains much of the rest.
          </p>
          <div className="lh-stats">
            <div className="lh-stat">
              <div className="lh-stat-n">2–3×</div>
              <div className="lh-stat-l">medications tried on average before psychiatric remission</div>
            </div>
            <div className="lh-stat-divider"/>
            <div className="lh-stat">
              <div className="lh-stat-n">~38%</div>
              <div className="lh-stat-l">of drug PK variability unexplained by pharmacogenomics alone</div>
            </div>
            <div className="lh-stat-divider"/>
            <div className="lh-stat">
              <div className="lh-stat-n">1.5 kg</div>
              <div className="lh-stat-l">microbial biomass with direct drug-metabolizing enzymatic capability</div>
            </div>
          </div>
          <div className="lh-ctas">
            <a href="#demo" className="btn-primary">Run a demo case</a>
            <a href="#mechanisms" className="btn-ghost">See the science</a>
          </div>
        </div>
        <div className="lh-diagram" aria-hidden="true">
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
            {/* Outer ring - bacteria */}
            {[0,60,120,180,240,300].map((deg, i) => {
              const r = 100, cx = 120 + r * Math.cos(deg * Math.PI/180), cy = 120 + r * Math.sin(deg * Math.PI/180);
              const colors = ['oklch(0.62 0.14 52)','oklch(0.55 0.12 248)','oklch(0.52 0.14 148)','oklch(0.62 0.14 52)','oklch(0.55 0.13 308)','oklch(0.52 0.14 148)'];
              return <circle key={i} cx={cx} cy={cy} r={10 + i % 3 * 3} fill={colors[i]} opacity={0.18}/>;
            })}
            {/* Inner ring - enzymes */}
            {[30,90,150,210,270,330].map((deg, i) => {
              const r = 58, cx = 120 + r * Math.cos(deg * Math.PI/180), cy = 120 + r * Math.sin(deg * Math.PI/180);
              return <rect key={i} x={cx-6} y={cy-6} width={12} height={12} rx={3} fill="var(--accent)" opacity={0.25}/>;
            })}
            {/* Edges outer→inner */}
            {[0,60,120,180,240,300].map((deg, i) => {
              const r1=90, r2=64, a2=deg+30;
              return <line key={i}
                x1={120 + r1*Math.cos(deg*Math.PI/180)} y1={120 + r1*Math.sin(deg*Math.PI/180)}
                x2={120 + r2*Math.cos(a2*Math.PI/180)} y2={120 + r2*Math.sin(a2*Math.PI/180)}
                stroke="var(--accent)" strokeWidth="0.8" opacity={0.2}/>;
            })}
            {/* Center - drug */}
            <circle cx="120" cy="120" r="22" fill="var(--accent)" opacity={0.1}/>
            <circle cx="120" cy="120" r="12" fill="var(--accent)" opacity={0.25}/>
            {/* Edges inner→center */}
            {[30,90,150,210,270,330].map((deg, i) => {
              const r1=52, r2=12;
              return <line key={i}
                x1={120 + r1*Math.cos(deg*Math.PI/180)} y1={120 + r1*Math.sin(deg*Math.PI/180)}
                x2={120 + r2*Math.cos(deg*Math.PI/180)} y2={120 + r2*Math.sin(deg*Math.PI/180)}
                stroke="var(--accent)" strokeWidth="0.8" opacity={0.2}/>;
            })}
            <text x="120" y="124" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--accent)" fontFamily="DM Mono, monospace">DRUG</text>
          </svg>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="problem-section">
        <div className="ps-label">The Problem</div>
        <div className="ps-items">
          {[
            { n:'01', h:'Trial-and-error prescribing', b:'No validated biomarker predicts psychiatric drug response. Clinicians cycle empirically through medications at 4–8 week intervals — while patients experience adverse effects, discontinuation syndromes, and delayed remission.' },
            { n:'02', h:'Pharmacogenomics misses the picture', b:'CYP2D6 and CYP2C19 genotyping explains ~30% of response variability. The gut microbiome — with its own complement of drug-metabolizing enzymes — is absent from every major pharmacogenomic panel.' },
            { n:'03', h:'Every oral drug passes through a microbial gauntlet', b:'Before reaching systemic circulation, oral drugs traverse a lumen teeming with bacteria. Resident microbes intercept, transform, and inactivate them using their own drug-metabolizing enzymes — oxidoreductases, hydrolases, and reductases that operate through mechanisms distinct from human CYP450 enzymes, at concentrations no current prescribing model accounts for.' },
          ].map(p => (
            <div key={p.n} className="ps-item">
              <div className="ps-num">{p.n}</div>
              <div className="ps-content">
                <div className="ps-heading">{p.h}</div>
                <div className="ps-body">{p.b}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mechanisms ── */}
      <section className="mechanisms-section" id="mechanisms">
        <div className="ms-header">
          <div className="ms-label">Three Biological Mechanisms</div>
          <div className="ms-title">Why the microbiome can't be ignored in psychiatric prescribing</div>
        </div>
        <div className="ms-cards">
          {MECHANISMS.map(m => (
            <div key={m.id} className="mech-card">
              <div className="mech-card-top">
                <div className="mech-icon"><MechIcon id={m.id}/></div>
                <div>
                  <div className="mech-title">{m.title}</div>
                  <div className="mech-sub">{m.sub}</div>
                </div>
              </div>
              <div className="mech-body">{m.body}</div>
              <div className="mech-ref">{m.ref}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { Landing });
