// results.jsx — All result visualization components

const { useState } = React;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PHYLUM_COLORS = {
  'Proteobacteria': 'oklch(0.62 0.14 52)',
  'Bacteroidetes':  'oklch(0.55 0.12 248)',
  'Firmicutes':     'oklch(0.52 0.14 148)',
  'Actinobacteria': 'oklch(0.55 0.13 308)',
  'Verrucomicrobia':'oklch(0.52 0.12 198)',
};
const phylumColor = p => PHYLUM_COLORS[p] || 'var(--text3)';
const tierFromScore = s => s < 0.35 ? 'Recommended' : s < 0.6 ? 'Consider' : 'Caution';
const scoreColor = s => s < 0.35 ? 'var(--green)' : s < 0.6 ? 'var(--amber)' : 'var(--red)';

// ─── TierBadge ────────────────────────────────────────────────────────────────
function TierBadge({ tier }) {
  const cls = tier === 'Recommended' ? 'tier-green' : tier === 'Consider' ? 'tier-amber' : 'tier-red';
  return <span className={`tier-badge ${cls}`}>{tier}</span>;
}

// ─── ScoreBar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score }) {
  const pct = Math.round(score * 100);
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: scoreColor(score) }}/>
      </div>
      <span className="score-bar-label" style={{ color: scoreColor(score) }}>{pct}<span style={{fontSize:'0.7em'}}>/100</span></span>
    </div>
  );
}

// ─── DrugCard ────────────────────────────────────────────────────────────────
function DrugCard({ drug }) {
  const [open, setOpen] = useState(false);
  const icons = { ortholog_degradation: '⬡', enterohepatic_reactivation: '↻', neurotransmitter_modulation: '⊕' };
  return (
    <div className={`drug-card ${drug.tier === 'Caution' ? 'drug-card--caution' : ''}`}>
      <div className="drug-card-header" onClick={() => setOpen(!open)}>
        <div className="drug-card-left">
          <TierBadge tier={drug.tier} />
          <span className="drug-name">{drug.drug_name}</span>
        </div>
        <div className="drug-card-right">
          <ScoreBar score={drug.metabolic_interference_score} />
          <span className="drug-expand">{open ? '−' : '+'}</span>
        </div>
      </div>
      <div className="drug-one-liner">{drug.one_line_summary}</div>
      {open && (
        <div className="drug-details">
          <p className="drug-explanation">{drug.detailed_explanation}</p>
          <div className="drug-section-title">Key Interactions</div>
          {drug.key_interactions.map((ki, i) => (
            <div key={i} className="interaction-row">
              <span className="interaction-icon">{icons[ki.interaction_type] || '·'}</span>
              <div>
                <div className="interaction-desc">{ki.description}</div>
                <div className="interaction-implication">→ {ki.clinical_implication}</div>
                <div className="interaction-taxa">{ki.taxa_involved.join(' · ')}</div>
              </div>
            </div>
          ))}
          {drug.risk_flags?.length > 0 && <>
            <div className="drug-section-title" style={{marginTop:'1rem'}}>Risk Flags</div>
            {drug.risk_flags.map((f, i) => <div key={i} className="risk-flag">{f}</div>)}
          </>}
          {drug.potential_adjustments && <>
            <div className="drug-section-title" style={{marginTop:'1rem'}}>Clinical Guidance</div>
            <div className="potential-adj">{drug.potential_adjustments}</div>
          </>}
        </div>
      )}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-bar">
      {tabs.map(t => (
        <button key={t.id} className={`tab-btn ${active === t.id ? 'tab-btn--active' : ''}`} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Drug Scores Chart (Agent 3 output) ───────────────────────────────────────
function DrugScoresChart({ scores }) {
  if (!scores?.length) return <div className="empty-state">Drug score data not available for this run.</div>;
  const sorted = [...scores].sort((a, b) => a.score - b.score);
  return (
    <div className="scores-chart">
      <p className="chart-subtitle">Drugs ranked by predicted metabolic interference score (0–100). Bars show contribution from CYP ortholog degradation risk (blue) and β-glucuronidase reactivation risk (amber). Protective factors (pathway redundancy, active metabolite buffer) reduce the total.</p>
      <div className="scores-rows">
        {sorted.map((d, i) => {
          const tier = tierFromScore(d.score);
          const totalPct = Math.round(d.score * 100);
          const orthoPct = d.components ? Math.round(d.components.ortho * 100) : null;
          const gusPct = d.components ? Math.round(d.components.gus * 100) : null;
          return (
            <div key={d.name} className="sfr-row">
              <div className="sfr-left">
                <span className="sfr-rank">#{i + 1}</span>
                <span className="sfr-name">{d.name}</span>
              </div>
              <div className="sfr-mid">
                <div className="sfr-track">
                  {orthoPct !== null ? <>
                    <div className="sfr-seg sfr-seg--ortho" style={{ width: `${orthoPct}%` }} title={`Ortholog risk: ${orthoPct}/100`}/>
                    <div className="sfr-seg sfr-seg--gus" style={{ width: `${gusPct}%` }} title={`GUS risk: ${gusPct}/100`}/>
                  </> : <div className="sfr-seg" style={{ width: `${totalPct}%`, background: scoreColor(d.score) }}/>}
                </div>
                <span className="sfr-score" style={{ color: scoreColor(d.score) }}>{totalPct}/100</span>
              </div>
              <div className="sfr-right"><TierBadge tier={tier} /></div>
            </div>
          );
        })}
      </div>
      <div className="score-chart-legend">
        <span className="scl-item"><span className="scl-dot scl-dot--ortho"/>CYP ortholog degradation</span>
        <span className="scl-item"><span className="scl-dot scl-dot--gus"/>β-Glucuronidase reactivation</span>
        <span className="scl-note">Protective factors (pathway redundancy, active metabolite buffer) reduce total score and are not shown as positive bars</span>
      </div>
    </div>
  );
}

// ─── Taxa Abundance Chart (Microbiome profile) ────────────────────────────────
function TaxaAbundanceChart({ taxa }) {
  if (!taxa?.length) return <div className="empty-state">Microbiome profile data not available.</div>;
  const sorted = [...taxa].sort((a, b) => b.abundance - a.abundance);
  const maxAb = sorted[0].abundance;
  const phylaSet = [...new Set(sorted.map(t => t.phylum))];
  return (
    <div className="taxa-chart">
      <p className="chart-subtitle">Relative abundance of all gut taxa in this patient's microbiome, colored by phylum. GUS = confirmed β-glucuronidase producer. CYP tags indicate ortholog enzyme families present.</p>
      <div className="phyla-legend">
        {phylaSet.map(p => (
          <span key={p} className="phylum-chip" style={{ color: phylumColor(p), background: phylumColor(p) + '1a', border: `1px solid ${phylumColor(p)}44` }}>{p}</span>
        ))}
      </div>
      <div className="taxa-rows">
        {sorted.map(t => (
          <div key={t.name} className="taxon-row">
            <div className="taxon-left">
              <span className="taxon-name">{t.name}</span>
              <div className="taxon-flags">
                {t.gus && <span className="taxon-flag taxon-flag--gus">GUS</span>}
                {t.cyp && <span className="taxon-flag taxon-flag--cyp">{t.cyp}</span>}
              </div>
            </div>
            <div className="taxon-right">
              <div className="taxon-bar-track">
                <div className="taxon-bar-fill" style={{ width: `${(t.abundance / maxAb) * 100}%`, background: phylumColor(t.phylum) }}/>
              </div>
              <span className="taxon-pct">{t.abundance.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Interaction Network (SVG bipartite graph) ────────────────────────────────
function NetworkGraph({ graph }) {
  const [hovered, setHovered] = useState(null);
  if (!graph) return <div className="empty-state">Interaction network data not available.</div>;

  const W = 640, PAD_X = 20, PAD_TOP = 56, ROW_H = 46, NODE_R = 7;
  const taxaX = 165, drugX = W - 165;
  const tCount = graph.taxa_nodes.length, dCount = graph.drug_nodes.length;
  const taxaH = (tCount - 1) * ROW_H, drugH = (dCount - 1) * ROW_H;
  const H = Math.max(taxaH, drugH) + PAD_TOP + 60;
  const taxaStartY = PAD_TOP + (H - PAD_TOP - 40 - taxaH) / 2;
  const drugStartY = PAD_TOP + (H - PAD_TOP - 40 - drugH) / 2;

  const tPos = graph.taxa_nodes.map((t, i) => ({ ...t, x: taxaX, y: taxaStartY + i * ROW_H }));
  const dPos = graph.drug_nodes.map((d, i) => ({ ...d, x: drugX, y: drugStartY + i * ROW_H }));
  const tById = Object.fromEntries(tPos.map(t => [t.id, t]));
  const dById = Object.fromEntries(dPos.map(d => [d.id, d]));

  const edgeColor = type => type === 'gus' ? 'var(--amber)' : 'var(--accent)';

  return (
    <div className="network-wrap">
      <p className="chart-subtitle">Bipartite interaction network mapping this patient's gut taxa (left) to candidate drugs (right). Blue edges = CYP enzyme ortholog interaction. Amber edges = β-glucuronidase reactivation risk. Edge weight proportional to abundance × evidence confidence. Hover a node to highlight its connections.</p>
      <div className="network-svg-container">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:'DM Sans,sans-serif', overflow:'visible'}}>
          {/* Column headers */}
          <text x={taxaX} y={24} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--text3)" letterSpacing="0.08em">MICROBIOME TAXA</text>
          <text x={drugX} y={24} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--text3)" letterSpacing="0.08em">CANDIDATE DRUGS</text>
          <line x1={taxaX - 60} y1={32} x2={taxaX + 60} y2={32} stroke="var(--border)" strokeWidth="1"/>
          <line x1={drugX - 60} y1={32} x2={drugX + 60} y2={32} stroke="var(--border)" strokeWidth="1"/>

          {/* Edges (behind nodes) */}
          {graph.edges.map((e, i) => {
            const t = tById[e.taxon], d = dById[e.drug];
            if (!t || !d) return null;
            const isHov = hovered && (hovered === e.taxon || hovered === e.drug);
            const opacity = hovered ? (isHov ? 0.75 : 0.05) : 0.28;
            const sw = (e.strength * 2.8) * (isHov ? 1.5 : 1);
            const cpX = W / 2;
            return (
              <path key={i}
                d={`M${t.x + NODE_R} ${t.y} C${cpX} ${t.y} ${cpX} ${d.y} ${d.x - NODE_R} ${d.y}`}
                fill="none" stroke={edgeColor(e.type)} strokeWidth={sw} opacity={opacity}
                style={{transition:'opacity 0.18s, stroke-width 0.18s'}}
              />
            );
          })}

          {/* Taxa nodes */}
          {tPos.map(t => {
            const isHov = hovered === t.id;
            return (
              <g key={t.id} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)} style={{cursor:'default'}}>
                <circle cx={t.x} cy={t.y} r={NODE_R + 2 + Math.min(t.abundance / 5, 5)} fill={phylumColor(t.phylum)} opacity={0.15}/>
                <circle cx={t.x} cy={t.y} r={NODE_R} fill={phylumColor(t.phylum)} stroke={isHov ? 'var(--text)' : 'none'} strokeWidth="1.5"/>
                <text x={t.x - NODE_R - 8} y={t.y + 3.5} textAnchor="end" fontSize="11" fill={isHov ? 'var(--text)' : 'var(--text2)'} fontStyle="italic" style={{transition:'fill 0.18s'}}>{t.label}</text>
                <text x={t.x - NODE_R - 8} y={t.y + 15} textAnchor="end" fontSize="9" fill="var(--text3)">{t.abundance}%</text>
              </g>
            );
          })}

          {/* Drug nodes */}
          {dPos.map(d => {
            const color = d.tier === 'Recommended' ? 'var(--green)' : d.tier === 'Consider' ? 'var(--amber)' : 'var(--red)';
            const isHov = hovered === d.id;
            return (
              <g key={d.id} onMouseEnter={() => setHovered(d.id)} onMouseLeave={() => setHovered(null)} style={{cursor:'default'}}>
                <circle cx={d.x} cy={d.y} r={NODE_R + 3} fill={color} opacity={0.15}/>
                <circle cx={d.x} cy={d.y} r={NODE_R} fill={color} stroke={isHov ? 'var(--text)' : 'none'} strokeWidth="1.5"/>
                <text x={d.x + NODE_R + 9} y={d.y + 3.5} textAnchor="start" fontSize="11.5" fill={isHov ? 'var(--text)' : 'var(--text2)'} fontWeight={isHov ? '600' : '500'} style={{transition:'fill 0.18s'}}>{d.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="network-legend">
        <span className="nl-item"><span className="nl-line" style={{background:'var(--accent)'}}/>CYP ortholog</span>
        <span className="nl-item"><span className="nl-line" style={{background:'var(--amber)'}}/>β-Glucuronidase</span>
        <span className="nl-item" style={{color:'var(--text3)'}}>Node size ∝ abundance · Edge weight ∝ evidence × abundance</span>
      </div>
    </div>
  );
}

// ─── Raw output accordion ──────────────────────────────────────────────────────
function RawOutputPanel({ data }) {
  const [open, setOpen] = useState(null);
  const agents = [
    { key: 'agent1_output', label: 'Agent 1 — Pharmacokinetic Mapper' },
    { key: 'agent2_output', label: 'Agent 2 — Ortholog Hunter' },
    { key: 'agent3_output', label: 'Agent 3 — Graph Architect' },
    { key: 'agent4_output', label: 'Agent 4 — Clinical Interpreter' },
  ];
  return (
    <div className="raw-panel">
      <p className="chart-subtitle">Structured JSON from each pipeline agent. In simulation mode, Agent 4 output (recommendation) is shown for all agents. Connect the local API to see per-agent data.</p>
      {agents.map(a => {
        const payload = data[a.key] || (a.key === 'agent4_output' ? data.recommendation : null);
        return (
          <div key={a.key} className="raw-accordion">
            <button className="raw-acc-header" onClick={() => setOpen(open === a.key ? null : a.key)}>
              <span className="raw-acc-title">{a.label}</span>
              <span className="raw-acc-toggle">{open === a.key ? '−' : '+'}</span>
            </button>
            {open === a.key && (
              <pre className="raw-json">{JSON.stringify(payload, null, 2)}</pre>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Clinical Report tab ──────────────────────────────────────────────────────
function ClinicalReport({ rec }) {
  return (
    <>
      <div className="results-drugs">
        <div className="results-section-title">Drug Recommendations</div>
        <div className="tier-legend">
          <span className="tier-badge tier-green">Recommended</span>
          <span className="tier-badge tier-amber">Consider</span>
          <span className="tier-badge tier-red">Caution</span>
          <span className="tier-legend-note">Lower interference score = better predicted compatibility</span>
        </div>
        {rec.drug_recommendations.map(d => <DrugCard key={d.drug_name} drug={d} />)}
      </div>
      <div className="results-microbiome" style={{marginTop:'1.25rem'}}>
        <div className="results-section-title">Microbiome Context</div>
        <p className="mb-summary">{rec.microbiome_context.summary}</p>
        <div className="drug-section-title" style={{marginBottom:'0.75rem', marginTop:'1rem'}}>Key Taxa of Concern</div>
        {rec.microbiome_context.key_taxa_of_concern.map((t, i) => (
          <div key={i} className="mb-taxon-row">
            <span className="mb-taxon-name">{t.taxon}</span>
            <span className="mb-taxon-concern">{t.concern}</span>
            {t.drugs_affected?.length > 0 && <span className="mb-taxon-drugs">{t.drugs_affected.join(' · ')}</span>}
          </div>
        ))}
      </div>
      <div className="results-caveats" style={{marginTop:'1.25rem'}}>
        <div className="results-section-title">Limitations & Caveats</div>
        {rec.limitations_and_caveats.map((c, i) => (
          <div key={i} className="caveat-row">
            <span className="caveat-num">{String(i+1).padStart(2,'0')}</span>
            <span>{c}</span>
          </div>
        ))}
      </div>
      <div className="results-disclaimer" style={{marginTop:'1.25rem'}}>{rec.disclaimer}</div>
    </>
  );
}

// ─── Results root ─────────────────────────────────────────────────────────────
function Results({ data, isLive }) {
  const [tab, setTab] = useState('report');
  const rec = data.recommendation;
  if (!rec) return <div className="error-msg">No recommendation data received.</div>;

  const TABS = [
    { id: 'report',     label: 'Clinical Report' },
    { id: 'scores',     label: 'Drug Scores' },
    { id: 'microbiome', label: 'Microbiome Profile' },
    { id: 'network',    label: 'Interaction Network' },
    { id: 'raw',        label: 'Raw Output' },
  ];

  return (
    <div className="results">
      <div className="results-header">
        <div className="results-header-row">
          <div>
            <div className="results-patient">{rec.patient_id} · {rec.diagnosis}</div>
            <div className="results-summary">{rec.recommendation_summary}</div>
          </div>
          <div className={`source-badge ${isLive ? 'source-live' : 'source-sim'}`}>
            <span className="source-dot"/>
            {isLive ? 'Live API' : 'Simulation'}
          </div>
        </div>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <div className="tab-content">
        {tab === 'report'     && <ClinicalReport rec={rec} />}
        {tab === 'scores'     && <DrugScoresChart scores={data.drug_scores} />}
        {tab === 'microbiome' && <TaxaAbundanceChart taxa={data.taxa} />}
        {tab === 'network'    && <NetworkGraph graph={data.graph} />}
        {tab === 'raw'        && <RawOutputPanel data={data} />}
      </div>
    </div>
  );
}

Object.assign(window, { Results, TierBadge, ScoreBar, DrugCard });
