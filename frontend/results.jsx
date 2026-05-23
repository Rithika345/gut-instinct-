// results.jsx — Result panels (lilac, spacious, bright chart colors)

const { useState, useEffect, useRef } = React;

// ─── Bright, distinguishable phylum palette ───────────────────────────────────
const PHYLUM_COLORS = {
  'Proteobacteria':  '#E8693A',  // orange
  'Bacteroidetes':   '#3B7CD9',  // blue
  'Firmicutes':      '#2E9B5C',  // green
  'Actinobacteria':  '#C2389B',  // magenta
  'Verrucomicrobia': '#1F9A91',  // teal
};
const phylumColor = p => PHYLUM_COLORS[p] || '#7A7290';

const tierFromScore = s => s < 0.35 ? 'Recommended' : s < 0.6 ? 'Consider' : 'Caution';
const tierClass = t => t === 'Recommended' ? 'tag--green' : t === 'Consider' ? 'tag--amber' : 'tag--red';
const scoreColor = s => s < 0.35 ? 'var(--c-green)' : s < 0.6 ? 'var(--c-amber)' : 'var(--c-red)';

// ─── TierBadge ────────────────────────────────────────────────────────────────
function TierBadge({ tier }) {
  return <span className={`tag ${tierClass(tier)}`}>{tier}</span>;
}

// ─── Drug entry ───────────────────────────────────────────────────────────────
function DrugEntry({ drug, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pct = Math.round(drug.metabolic_interference_score * 100);
  const color = scoreColor(drug.metabolic_interference_score);
  return (
    <div className="drug">
      <button className="drug-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="drug-left">
          <div className="drug-name">{drug.drug_name}</div>
          <div className="drug-tier-row">
            <TierBadge tier={drug.tier} />
            <span style={{ fontFamily: 'var(--f-sans)', fontSize: 14, color: 'var(--ink-3)' }}>
              Interference score
            </span>
          </div>
        </div>
        <div className="drug-right">
          <div className="drug-score-num" style={{ color }}>
            {pct}<small>/100</small>
          </div>
          <div className="score-track">
            <div className="score-fill" style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>
      </button>
      <div className="drug-oneliner">{drug.one_line_summary}</div>
      <button className="drug-toggle" onClick={() => setOpen(!open)}>
        {open ? 'Hide details –' : 'Show details +'}
      </button>
      {open && (
        <div className="drug-details">
          <p className="drug-explanation">{drug.detailed_explanation}</p>

          <div className="drug-subhead">Key Interactions</div>
          {drug.key_interactions.map((ki, i) => (
            <div key={i} className="interaction">
              <div className="interaction-desc">{ki.description}</div>
              <div className="interaction-implication">{ki.clinical_implication}</div>
              <div className="interaction-taxa">{ki.taxa_involved.join(' · ')}</div>
            </div>
          ))}

          {drug.risk_flags?.length > 0 && (
            <>
              <div className="drug-subhead">Risk Flags</div>
              {drug.risk_flags.map((f, i) => <div key={i} className="risk-flag">{f}</div>)}
            </>
          )}

          {drug.potential_adjustments && (
            <>
              <div className="drug-subhead">Clinical Guidance</div>
              <div className="clinical-guidance">{drug.potential_adjustments}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tab ${active === t.id ? 'tab--active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Clinical Report ──────────────────────────────────────────────────────────
function ClinicalReport({ rec }) {
  return (
    <div className="report">
      <div>
        <div className="panel-head">Drug Recommendations</div>
        <div className="panel-sub">{rec.drug_recommendations.length} candidates ranked by predicted metabolic interference.</div>
        <div className="legend">
          <span className="tag tag--green">Recommended</span>
          <span className="tag tag--amber">Consider</span>
          <span className="tag tag--red">Caution</span>
          <span className="legend-note">Lower interference = better predicted compatibility</span>
        </div>
        <div>
          {rec.drug_recommendations.map((d, i) => (
            <DrugEntry key={d.drug_name} drug={d} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      <div>
        <div className="panel-head">Microbiome Context</div>
        <p className="mb-summary">{rec.microbiome_context.summary}</p>
        <div className="drug-subhead" style={{ marginTop: 0 }}>Key Taxa of Concern</div>
        <div className="mb-taxa">
          {rec.microbiome_context.key_taxa_of_concern.map((t, i) => (
            <div key={i} className="mb-taxon">
              <span className="mb-taxon-name">{t.taxon}</span>
              <span className="mb-taxon-concern">{t.concern}</span>
              {t.drugs_affected?.length > 0 && (
                <span className="mb-taxon-drugs">→ Affects: {t.drugs_affected.join(' · ')}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="panel-head">Limitations &amp; Caveats</div>
        <div className="panel-sub">{rec.limitations_and_caveats.length} items the prescriber should weigh.</div>
        <div>
          {rec.limitations_and_caveats.map((c, i) => (
            <div key={i} className="caveat">
              <span className="caveat-num">{String(i + 1).padStart(2, '0')}</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div className="disclaimer">{rec.disclaimer}</div>
      </div>
    </div>
  );
}

// ─── Drug Scores Chart ────────────────────────────────────────────────────────
function DrugScoresChart({ scores }) {
  if (!scores?.length) return <div className="empty-state">Drug score data not available for this run.</div>;
  const sorted = [...scores].sort((a, b) => a.score - b.score);
  return (
    <div>
      <div className="panel-head">Drug Scores</div>
      <p className="chart-intro">
        Drugs ranked by predicted metabolic interference (0–100). Each bar decomposes the score into <em>enzymatic degradation</em> (blue) and <em>β-glucuronidase reactivation</em> (amber). Protective factors — pathway redundancy, active-metabolite buffer — reduce the total but do not appear as positive bars.
      </p>
      <div className="scores">
        {sorted.map((d, i) => {
          const tier = tierFromScore(d.score);
          const totalPct = Math.round(d.score * 100);
          const orthoPct = d.components ? Math.round(d.components.enz * 100) : null;
          const gusPct = d.components ? Math.round(d.components.gus * 100) : null;
          return (
            <div key={d.name} className="score-row">
              <span className="score-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="score-drug">{d.name}</span>
              <div className="score-stack" title={`Total: ${totalPct}/100`}>
                {orthoPct !== null ? (
                  <>
                    <div className="score-seg-enz" style={{ width: `${orthoPct}%` }} title={`Enzymatic: ${orthoPct}/100`} />
                    <div className="score-seg-gus" style={{ width: `${gusPct}%` }} title={`GUS: ${gusPct}/100`} />
                  </>
                ) : (
                  <div className="score-seg-enz" style={{ width: `${totalPct}%`, background: scoreColor(d.score) }} />
                )}
              </div>
              <div className="score-end">
                <span className="score-end-num" style={{ color: scoreColor(d.score) }}>{totalPct}</span>
                <TierBadge tier={tier} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="score-legend">
        <span className="legend-swatch">
          <span className="legend-box" style={{ background: 'var(--c-blue)' }} />
          Enzymatic degradation
        </span>
        <span className="legend-swatch">
          <span className="legend-box" style={{ background: 'var(--c-amber)' }} />
          β-Glucuronidase reactivation
        </span>
        <span className="score-legend-note">
          Protective factors (pathway redundancy, active-metabolite buffer) are subtracted from the total but not rendered.
        </span>
      </div>
    </div>
  );
}

// ─── Taxa Abundance Chart ─────────────────────────────────────────────────────
function TaxaAbundanceChart({ taxa }) {
  if (!taxa?.length) return <div className="empty-state">Microbiome profile data not available.</div>;
  const sorted = [...taxa].sort((a, b) => b.abundance - a.abundance);
  const maxAb = sorted[0].abundance;
  const phylaSet = [...new Set(sorted.map(t => t.phylum))];
  return (
    <div>
      <div className="panel-head">Microbiome Profile</div>
      <p className="chart-intro">
        Relative abundance of detected gut taxa, ordered by frequency and colored by phylum. <em>GUS+</em> tags mark confirmed drug-reactivating β-glucuronidase producers (E. coli, B. fragilis, R. gnavus). Enzyme tags annotate documented drug-metabolizing enzymes.
      </p>
      <div className="phyla-legend">
        {phylaSet.map(p => (
          <span key={p} className="phyla-legend-item">
            <span className="phyla-legend-dot" style={{ background: phylumColor(p) }} />
            {p}
          </span>
        ))}
      </div>
      <div className="taxa">
        {sorted.map(t => (
          <div key={t.name} className="taxon-row">
            <div className="taxon-left">
              <span className="taxon-name">{t.name}</span>
              <div className="taxon-meta">
                {t.gus && <span className="tag tag--amber">GUS+</span>}
                {t.enzyme && <span className="tag tag--accent">{t.enzyme}</span>}
              </div>
            </div>
            <div className="taxon-bar-track">
              <div
                className="taxon-bar-fill"
                style={{ width: `${(t.abundance / maxAb) * 100}%`, background: phylumColor(t.phylum) }}
              />
            </div>
            <span className="taxon-pct">{t.abundance.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Interaction Network ──────────────────────────────────────────────────────
function NetworkGraph({ graph }) {
  const [hovered, setHovered] = useState(null);
  if (!graph) return <div className="empty-state">Interaction network data not available.</div>;

  const W = 760, PAD_TOP = 60, ROW_H = 52, NODE_R = 9;
  const taxaX = 200, drugX = W - 200;
  const tCount = graph.taxa_nodes.length, dCount = graph.drug_nodes.length;
  const taxaH = (tCount - 1) * ROW_H, drugH = (dCount - 1) * ROW_H;
  const H = Math.max(taxaH, drugH) + PAD_TOP + 80;
  const taxaStartY = PAD_TOP + (H - PAD_TOP - 60 - taxaH) / 2;
  const drugStartY = PAD_TOP + (H - PAD_TOP - 60 - drugH) / 2;

  const tPos = graph.taxa_nodes.map((t, i) => ({ ...t, x: taxaX, y: taxaStartY + i * ROW_H }));
  const dPos = graph.drug_nodes.map((d, i) => ({ ...d, x: drugX, y: drugStartY + i * ROW_H }));
  const tById = Object.fromEntries(tPos.map(t => [t.id, t]));
  const dById = Object.fromEntries(dPos.map(d => [d.id, d]));

  const drugTierColor = (tier) =>
    tier === 'Recommended' ? 'var(--c-green)'
    : tier === 'Consider' ? 'var(--c-amber)'
    : 'var(--c-red)';

  return (
    <div>
      <div className="panel-head">Interaction Network</div>
      <p className="chart-intro">
        Bipartite graph mapping the patient&rsquo;s gut taxa (left) to candidate drugs (right). Solid edges trace enzymatic degradation; dashed edges trace β-glucuronidase reactivation. Edge weight is proportional to abundance × evidence confidence. Hover any node to highlight its connections.
      </p>
      <div className="network-wrap">
        <div className="network-svg-container">
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ fontFamily: 'Instrument Sans, sans-serif', overflow: 'visible' }}>
            {/* Column headers */}
            <text x={taxaX} y={28} textAnchor="middle"
                  fontSize="12" fontWeight="600" fill="var(--accent)" letterSpacing="2">
              MICROBIOME TAXA
            </text>
            <text x={drugX} y={28} textAnchor="middle"
                  fontSize="12" fontWeight="600" fill="var(--accent)" letterSpacing="2">
              CANDIDATE DRUGS
            </text>
            <line x1={taxaX - 90} y1={38} x2={taxaX + 90} y2={38} stroke="var(--rule)" strokeWidth="1.5" />
            <line x1={drugX - 90} y1={38} x2={drugX + 90} y2={38} stroke="var(--rule)" strokeWidth="1.5" />

            {/* Edges */}
            {graph.edges.map((e, i) => {
              const t = tById[e.taxon], d = dById[e.drug];
              if (!t || !d) return null;
              const isHov = hovered && (hovered === e.taxon || hovered === e.drug);
              const opacity = hovered ? (isHov ? 0.9 : 0.08) : 0.35;
              const sw = (e.strength * 2.6) * (isHov ? 1.6 : 1);
              const cpX = W / 2;
              const stroke = e.type === 'gus' ? 'var(--c-amber)' : 'var(--c-blue)';
              const dash = e.type === 'gus' ? '4 4' : undefined;
              return (
                <path key={i}
                  d={`M${t.x + NODE_R + 2} ${t.y} C${cpX} ${t.y} ${cpX} ${d.y} ${d.x - NODE_R - 2} ${d.y}`}
                  fill="none" stroke={stroke} strokeWidth={sw}
                  strokeDasharray={dash}
                  opacity={opacity}
                  strokeLinecap="round"
                  style={{ transition: 'opacity 0.18s, stroke-width 0.18s' }}
                />
              );
            })}

            {/* Taxa nodes (circles) */}
            {tPos.map(t => {
              const isHov = hovered === t.id;
              const color = phylumColor(t.phylum);
              const ringR = NODE_R + 5 + Math.min(t.abundance / 3, 7);
              return (
                <g key={t.id} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'default' }}>
                  <circle cx={t.x} cy={t.y} r={ringR} fill={color} opacity="0.15" />
                  <circle cx={t.x} cy={t.y} r={NODE_R} fill={color} stroke={isHov ? 'var(--ink)' : 'none'} strokeWidth="2" />
                  <text x={t.x - NODE_R - 12} y={t.y + 4} textAnchor="end"
                    fontFamily="Crimson Pro, serif"
                    fontSize="15" fontStyle="italic"
                    fill={isHov ? 'var(--ink)' : 'var(--ink-2)'}
                    fontWeight={isHov ? 600 : 400}>
                    {t.label}
                  </text>
                  <text x={t.x - NODE_R - 12} y={t.y + 19} textAnchor="end"
                    fontSize="11" fill="var(--ink-3)">{t.abundance}%</text>
                </g>
              );
            })}

            {/* Drug nodes (squares) */}
            {dPos.map(d => {
              const color = drugTierColor(d.tier);
              const isHov = hovered === d.id;
              return (
                <g key={d.id} onMouseEnter={() => setHovered(d.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'default' }}>
                  <rect x={d.x - NODE_R - 2} y={d.y - NODE_R - 2} width={(NODE_R + 2) * 2} height={(NODE_R + 2) * 2}
                    fill={color} opacity="0.15" />
                  <rect x={d.x - NODE_R} y={d.y - NODE_R} width={NODE_R * 2} height={NODE_R * 2}
                    fill={color} stroke={isHov ? 'var(--ink)' : 'none'} strokeWidth="2" />
                  <text x={d.x + NODE_R + 12} y={d.y + 4} textAnchor="start"
                    fontFamily="Crimson Pro, serif"
                    fontSize="16"
                    fill={isHov ? 'var(--ink)' : 'var(--ink-2)'}
                    fontWeight={isHov ? 600 : 500}>
                    {d.label}
                  </text>
                  <text x={d.x + NODE_R + 12} y={d.y + 19} textAnchor="start"
                    fontSize="11" fontWeight="500" letterSpacing="1"
                    fill={color}>{(d.tier || '').toUpperCase()}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="network-legend">
          <span className="legend-swatch">
            <svg width="34" height="6" style={{ verticalAlign: 'middle' }}>
              <line x1="0" y1="3" x2="34" y2="3" stroke="var(--c-blue)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Enzymatic degradation
          </span>
          <span className="legend-swatch">
            <svg width="34" height="6" style={{ verticalAlign: 'middle' }}>
              <line x1="0" y1="3" x2="34" y2="3" stroke="var(--c-amber)" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
            </svg>
            β-Glucuronidase reactivation
          </span>
          <span style={{ color: 'var(--ink-3)', fontStyle: 'italic', fontFamily: 'var(--f-serif)', fontSize: 14.5 }}>
            Node halo ∝ abundance · edge weight ∝ evidence × abundance
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Structural Evidence ──────────────────────────────────────────────────────
// Bright, contrasting chain colors
const CHAIN_COLORS = {
  A: '#3B7CD9',   // bright blue for first input
  B: '#E8693A',   // bright orange for second
};
const L1_COLOR = '#E0B62C'; // bright gold for L1 active-site loop

function StructuralEvidence() {
  const data = (typeof STRUCTURAL_DATA !== 'undefined') ? STRUCTURAL_DATA : null;
  const [selectedId, setSelectedId] = useState(data?.comparisons?.[0]?.id || null);
  const viewerRef = useRef(null);
  const viewer3dRef = useRef(null);
  const selected = data?.comparisons?.find(c => c.id === selectedId);

  useEffect(() => {
    if (!selected || !data?.pdbs?.[selected.pdb_key]) return;
    if (typeof $3Dmol === 'undefined' || !viewerRef.current) return;

    if (!viewer3dRef.current) {
      // Transparent so the protein floats directly on the page — no card / colored panel.
      viewer3dRef.current = $3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'rgba(0,0,0,0)',
        backgroundAlpha: 0,
      });
    }
    const viewer = viewer3dRef.current;
    viewer.clear();

    const pdbText = data.pdbs[selected.pdb_key];
    viewer.addModel(pdbText, 'pdb');

    viewer.setStyle({ chain: 'A' }, { cartoon: { color: CHAIN_COLORS.A } });
    viewer.setStyle({ chain: 'B' }, { cartoon: { color: CHAIN_COLORS.B } });

    const [lStartA, lEndA] = selected.l1_residues_chainA || [];
    const [lStartB, lEndB] = selected.l1_residues_chainB || [];
    if (lStartA && lEndA) {
      const range = Array.from({ length: lEndA - lStartA + 1 }, (_, i) => lStartA + i);
      viewer.addStyle({ chain: 'A', resi: range }, { cartoon: { color: L1_COLOR, thickness: 1.3 } });
    }
    if (lStartB && lEndB) {
      const range = Array.from({ length: lEndB - lStartB + 1 }, (_, i) => lStartB + i);
      viewer.addStyle({ chain: 'B', resi: range }, { cartoon: { color: L1_COLOR, thickness: 1.3 } });
    }

    viewer.zoomTo();
    viewer.render();
    
    // Hide the loading text once the model is rendered
    const loader = viewerRef.current.querySelector('.struct-viewer-loading');
    if (loader) loader.style.display = 'none';

  }, [selectedId, selected]);

  if (!data) {
    return <div className="empty-state">Structural data not loaded.</div>;
  }
  if (!data.comparisons?.length) {
    return <div className="empty-state">No structural comparisons available.</div>;
  }
  if (!selected) return <div className="empty-state">Select a comparison.</div>;

  const tmClass = selected.tm_score >= 0.7
    ? 'struct-metric-value--green'
    : selected.tm_score >= 0.5
      ? 'struct-metric-value--amber'
      : 'struct-metric-value--red';
  const verdictClass = {
    high_confidence_structural_match: 'verdict--match',
    same_fold: 'verdict--same',
    partial_similarity: 'verdict--partial',
    no_structural_match: 'verdict--none',
  }[selected.verdict] || 'verdict--same';
  const verdictLabel = selected.verdict.replace(/_/g, ' ');

  return (
    <div>
      <div className="panel-head">Structural Evidence</div>
      <p className="chart-intro">
        TM-align superposition of bacterial β-glucuronidase structures. A TM-score &gt; 0.5 (<em>Zhang &amp; Skolnick, NAR 33:2302, 2005</em>) indicates the two structures share the same overall fold — the structural basis for assuming the bacterial enzyme can bind drug-glucuronide substrates similarly to the reference. The L1 active-site loop (gold, ~residues 359–374) determines drug-glucuronide processing efficiency (<em>Biernat et al. 2019</em>).
      </p>
      <div className="struct-wrap">
        <div className="struct-controls">
          <label htmlFor="struct-pair">Comparison</label>
          <select id="struct-pair" className="struct-select" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            {data.comparisons.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        <div className="struct-viewer" ref={viewerRef}>
          <div className="struct-viewer-loading">Loading 3D viewer…</div>
        </div>

        <div className="struct-legend-row">
          <div className="struct-legend-item">
            <span className="struct-legend-swatch" style={{ background: CHAIN_COLORS.A }} />
            <strong>{selected.chainA.taxon}</strong>
            <span>· {selected.chainA.structure}</span>
          </div>
          <div className="struct-legend-item">
            <span className="struct-legend-swatch" style={{ background: CHAIN_COLORS.B }} />
            <strong>{selected.chainB.taxon}</strong>
            <span>· {selected.chainB.structure}</span>
          </div>
          <div className="struct-legend-item">
            <span className="struct-legend-swatch" style={{ background: L1_COLOR }} />
            <strong>L1 loop</strong>
            <span>· active site (~359–374)</span>
          </div>
        </div>

        <div className="struct-metrics">
          <div className="struct-metric">
            <div className="struct-metric-label">TM-score</div>
            <div className={`struct-metric-value ${tmClass}`}>{selected.tm_score.toFixed(3)}</div>
          </div>
          <div className="struct-metric">
            <div className="struct-metric-label">RMSD</div>
            <div className="struct-metric-value">{selected.rmsd.toFixed(2)} Å</div>
          </div>
          <div className="struct-metric">
            <div className="struct-metric-label">Aligned</div>
            <div className="struct-metric-value">{selected.aligned_length}<span style={{ color: 'var(--ink-3)', fontSize: 20 }}>/{Math.min(selected.chain1_length, selected.chain2_length)}</span></div>
          </div>
          <div className="struct-metric">
            <div className="struct-metric-label">Seq identity</div>
            <div className="struct-metric-value">{Math.round(selected.seq_identity * 100)}%</div>
          </div>
          <div className="struct-metric">
            <div className="struct-metric-label">Verdict</div>
            <div className={`verdict ${verdictClass}`}>{verdictLabel}</div>
          </div>
        </div>

        <div className="struct-narrative">{selected.narrative}</div>
        <div className="struct-interp">{selected.interpretation}</div>

        <div className="struct-cite">
          Sources: <strong>Wallace et al. 2010</strong>, Science 330:831 (E. coli GUS crystal 3LPF).{' '}
          <strong>Dashnyam et al. 2017</strong>, PDB 5Z1A (B. fragilis GUS crystal).{' '}
          <strong>Biernat et al. 2019</strong>, Sci Rep 9:825.{' '}
          <strong>Zhang &amp; Skolnick 2005</strong>, NAR 33:2302.{' '}
          R. gnavus structure: AlphaFold Q6W7J7 v6 (pLDDT 96). Computed with TM-align 20220412.
        </div>
      </div>
    </div>
  );
}

// ─── Raw output ───────────────────────────────────────────────────────────────
function RawOutputPanel({ data }) {
  const [open, setOpen] = useState(null);
  const agents = [
    { key: 'agent1_output', label: 'Pharmacokinetic Mapper',           sub: 'CYP enzymes · protein binding · glucuronidation flags' },
    { key: 'agent2_output', label: 'Microbiome Interaction Mapper',    sub: 'oxidoreductases · hydrolases · β-glucuronidases' },
    { key: 'agent3_output', label: 'Graph Architect',                  sub: 'bipartite graph · interference score' },
    { key: 'agent4_output', label: 'Clinical Interpreter',             sub: 'tiered recommendations' },
  ];
  return (
    <div>
      <div className="panel-head">Raw Agent Output</div>
      <p className="chart-intro">
        Structured JSON output from each agent. In simulation mode, only Agent 4 (Clinical Interpreter) data is present. Connect the live API to inspect per-agent payloads.
      </p>
      <div className="raw-wrap">
        {agents.map((a, i) => {
          const payload = data[a.key] || (a.key === 'agent4_output' ? data.recommendation : null);
          const isOpen = open === a.key;
          return (
            <div key={a.key}>
              <div className="raw-row">
                <button className="raw-header" onClick={() => setOpen(isOpen ? null : a.key)}>
                  <span className="raw-name">
                    Agent {i + 1} — {a.label}
                    <small>{a.sub}</small>
                  </span>
                  <span className="raw-toggle">{isOpen ? 'Hide' : 'View JSON'}</span>
                </button>
              </div>
              {isOpen && (
                <pre className="raw-body">
                  {payload
                    ? JSON.stringify(payload, null, 2)
                    : "// Connect to live API to view raw agent outputs.\n// Demo mode uses pre-computed results."}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
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
    { id: 'microbiome', label: 'Microbiome' },
    { id: 'network',    label: 'Network' },
    { id: 'structure',  label: 'Structural Evidence' },
    { id: 'raw',        label: 'Raw Output' },
  ];

  return (
    <div className="results">
      <div className="results-eyebrow">Results</div>
      <div className="results-head">
        <div>
          <div className="results-pid">
            <strong>{rec.patient_id}</strong>
            &nbsp;·&nbsp; Pipeline complete
          </div>
          <h2 className="results-title">{rec.diagnosis}</h2>
        </div>
        <div className={`results-source ${isLive ? 'results-source--live' : 'results-source--sim'}`}>
          <span className="source-dot" />
          {isLive ? 'Live API' : 'Simulation'}
        </div>
      </div>
      <p className="results-summary">{rec.recommendation_summary}</p>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <div>
        {tab === 'report'     && <ClinicalReport rec={rec} />}
        {tab === 'scores'     && <DrugScoresChart scores={data.drug_scores} />}
        {tab === 'microbiome' && <TaxaAbundanceChart taxa={data.taxa} />}
        {tab === 'network'    && <NetworkGraph graph={data.graph} />}
        {tab === 'structure'  && <StructuralEvidence />}
        {tab === 'raw'        && <RawOutputPanel data={data} />}
      </div>
    </div>
  );
}

Object.assign(window, { Results, TierBadge, DrugEntry, StructuralEvidence });
