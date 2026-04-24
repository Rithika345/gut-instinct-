// demo-data.js — Simulated pipeline data mirroring the real /analyze API response

const DEMO_CASES = [
  {
    id: 'patient1_mdd_dysbiosis',
    label: 'DEMO-001 — MDD / Post-Antibiotic Dysbiosis',
    badge: 'Major Depressive Disorder',
    description: 'Post-antibiotic dysbiosis; depleted Firmicutes, elevated Proteobacteria. Prior failure: Sertraline.',
    request: { diagnosis: 'Major Depressive Disorder', patient_profile_id: 'patient1_mdd_dysbiosis', current_medications: [], prior_failures: ['Sertraline'] }
  },
  {
    id: 'patient2_ptsd_glucuronidase',
    label: 'DEMO-002 — PTSD / High β-Glucuronidase Load',
    badge: 'Post-Traumatic Stress Disorder',
    description: 'Moderately diverse microbiome enriched in GUS-positive species. Current med: Prazosin. No prior failures.',
    request: { diagnosis: 'Post-Traumatic Stress Disorder', patient_profile_id: 'patient2_ptsd_glucuronidase', current_medications: ['Prazosin'], prior_failures: [] }
  }
];

const DEMO_RESULTS = {

  // ── DEMO-001 ────────────────────────────────────────────────────────────────
  patient1_mdd_dysbiosis: {
    status: 'success',

    // ── Microbiome profile (Agent 2 input) ──────────────────────────────────
    taxa: [
      { name: 'Escherichia coli',             phylum: 'Proteobacteria',  abundance: 18.5, gus: true,  cyp: 'CYP2D6/2C19' },
      { name: 'Bacteroides fragilis',          phylum: 'Bacteroidetes',   abundance: 14.3, gus: true,  cyp: 'CYP2D6' },
      { name: 'Bacteroides thetaiotaomicron',  phylum: 'Bacteroidetes',   abundance:  9.1, gus: true,  cyp: 'CYP2C19' },
      { name: 'Klebsiella pneumoniae',         phylum: 'Proteobacteria',  abundance:  8.2, gus: true,  cyp: 'CYP3A4' },
      { name: 'Enterococcus faecalis',         phylum: 'Firmicutes',      abundance:  7.4, gus: true,  cyp: 'CYP2D6' },
      { name: 'Bacteroides vulgatus',          phylum: 'Bacteroidetes',   abundance:  6.7, gus: true,  cyp: 'CYP3A4' },
      { name: 'Ruminococcus gnavus',           phylum: 'Firmicutes',      abundance:  4.8, gus: true,  cyp: null },
      { name: 'Pseudomonas aeruginosa',        phylum: 'Proteobacteria',  abundance:  3.1, gus: false, cyp: 'CYP2D6' },
      { name: 'Clostridium bolteae',           phylum: 'Firmicutes',      abundance:  3.2, gus: true,  cyp: 'CYP2D6' },
      { name: 'Eggerthella lenta',             phylum: 'Actinobacteria',  abundance:  2.6, gus: false, cyp: 'CYP2D6' },
      { name: 'Faecalibacterium prausnitzii',  phylum: 'Firmicutes',      abundance:  2.1, gus: false, cyp: null },
      { name: 'Bifidobacterium longum',        phylum: 'Actinobacteria',  abundance:  1.8, gus: false, cyp: null },
      { name: 'Eubacterium rectale',           phylum: 'Firmicutes',      abundance:  1.3, gus: false, cyp: null },
      { name: 'Prevotella copri',              phylum: 'Bacteroidetes',   abundance:  1.2, gus: false, cyp: 'CYP2C19' },
      { name: 'Akkermansia muciniphila',       phylum: 'Verrucomicrobia', abundance:  0.8, gus: false, cyp: null },
    ],

    // ── Drug scores (Agent 3 output) ─────────────────────────────────────────
    drug_scores: [
      { name: 'Mirtazapine',   score: 0.21, components: { ortho: 0.14, gus: 0.03 } },
      { name: 'Bupropion',     score: 0.26, components: { ortho: 0.20, gus: 0.02 } },
      { name: 'Escitalopram',  score: 0.32, components: { ortho: 0.18, gus: 0.08 } },
      { name: 'Fluoxetine',    score: 0.44, components: { ortho: 0.30, gus: 0.06 } },
      { name: 'Sertraline',    score: 0.68, components: { ortho: 0.28, gus: 0.24 } },
      { name: 'Venlafaxine',   score: 0.74, components: { ortho: 0.22, gus: 0.38 } },
    ],

    // ── Interaction network (Agent 3 graph) ───────────────────────────────────
    graph: {
      drug_nodes: [
        { id: 'fluoxetine',   label: 'Fluoxetine',   tier: 'Consider' },
        { id: 'sertraline',   label: 'Sertraline',   tier: 'Caution' },
        { id: 'escitalopram', label: 'Escitalopram', tier: 'Recommended' },
        { id: 'venlafaxine',  label: 'Venlafaxine',  tier: 'Caution' },
        { id: 'bupropion',    label: 'Bupropion',    tier: 'Recommended' },
        { id: 'mirtazapine',  label: 'Mirtazapine',  tier: 'Recommended' },
      ],
      taxa_nodes: [
        { id: 'ecoli',     label: 'E. coli',                  phylum: 'Proteobacteria', abundance: 18.5 },
        { id: 'bfrag',     label: 'B. fragilis',              phylum: 'Bacteroidetes',  abundance: 14.3 },
        { id: 'btheta',    label: 'B. thetaiotaomicron',      phylum: 'Bacteroidetes',  abundance:  9.1 },
        { id: 'kpneu',     label: 'K. pneumoniae',            phylum: 'Proteobacteria', abundance:  8.2 },
        { id: 'efaec',     label: 'E. faecalis',              phylum: 'Firmicutes',     abundance:  7.4 },
        { id: 'bvulg',     label: 'B. vulgatus',              phylum: 'Bacteroidetes',  abundance:  6.7 },
        { id: 'rgnavus',   label: 'R. gnavus',                phylum: 'Firmicutes',     abundance:  4.8 },
        { id: 'paerug',    label: 'P. aeruginosa',            phylum: 'Proteobacteria', abundance:  3.1 },
        { id: 'elenta',    label: 'E. lenta',                 phylum: 'Actinobacteria', abundance:  2.6 },
      ],
      edges: [
        // E. coli
        { taxon:'ecoli', drug:'fluoxetine',   type:'cyp', strength:0.90 },
        { taxon:'ecoli', drug:'mirtazapine',  type:'cyp', strength:0.90 },
        { taxon:'ecoli', drug:'venlafaxine',  type:'cyp', strength:0.90 },
        { taxon:'ecoli', drug:'sertraline',   type:'cyp', strength:0.65 },
        { taxon:'ecoli', drug:'escitalopram', type:'cyp', strength:0.65 },
        { taxon:'ecoli', drug:'sertraline',   type:'gus', strength:0.80 },
        { taxon:'ecoli', drug:'venlafaxine',  type:'gus', strength:0.90 },
        // B. fragilis
        { taxon:'bfrag', drug:'sertraline',   type:'gus', strength:0.72 },
        { taxon:'bfrag', drug:'venlafaxine',  type:'gus', strength:0.80 },
        { taxon:'bfrag', drug:'fluoxetine',   type:'cyp', strength:0.38 },
        { taxon:'bfrag', drug:'mirtazapine',  type:'cyp', strength:0.38 },
        // B. thetaiotaomicron
        { taxon:'btheta', drug:'sertraline',   type:'cyp', strength:0.42 },
        { taxon:'btheta', drug:'escitalopram', type:'cyp', strength:0.42 },
        { taxon:'btheta', drug:'sertraline',   type:'gus', strength:0.42 },
        // K. pneumoniae
        { taxon:'kpneu', drug:'mirtazapine',  type:'cyp', strength:0.40 },
        { taxon:'kpneu', drug:'venlafaxine',  type:'cyp', strength:0.40 },
        { taxon:'kpneu', drug:'bupropion',    type:'cyp', strength:0.28 },
        // E. faecalis
        { taxon:'efaec', drug:'fluoxetine',   type:'cyp', strength:0.35 },
        { taxon:'efaec', drug:'mirtazapine',  type:'cyp', strength:0.35 },
        { taxon:'efaec', drug:'venlafaxine',  type:'gus', strength:0.45 },
        { taxon:'efaec', drug:'sertraline',   type:'gus', strength:0.38 },
        // B. vulgatus
        { taxon:'bvulg', drug:'mirtazapine',  type:'cyp', strength:0.30 },
        { taxon:'bvulg', drug:'venlafaxine',  type:'cyp', strength:0.30 },
        // R. gnavus
        { taxon:'rgnavus', drug:'sertraline',  type:'gus', strength:0.35 },
        { taxon:'rgnavus', drug:'venlafaxine', type:'gus', strength:0.40 },
        // P. aeruginosa
        { taxon:'paerug', drug:'fluoxetine',  type:'cyp', strength:0.22 },
        { taxon:'paerug', drug:'mirtazapine', type:'cyp', strength:0.22 },
        // E. lenta
        { taxon:'elenta', drug:'fluoxetine',  type:'cyp', strength:0.20 },
      ],
    },

    // ── Agent 4 recommendation ────────────────────────────────────────────────
    recommendation: {
      patient_id: 'DEMO-001',
      diagnosis: 'Major Depressive Disorder',
      recommendation_summary: "This patient's post-antibiotic dysbiosis creates high microbiome-drug interference for several antidepressants. Elevated Proteobacteria—E. coli at 18.5% and Klebsiella at 8.2%—carry well-documented CYP2D6-like orthologs and β-glucuronidase activity. Mirtazapine and Bupropion show the lowest predicted interference and are preferred first-line options.",
      drug_recommendations: [
        {
          drug_name: 'Mirtazapine', tier: 'Recommended', metabolic_interference_score: 0.21, confidence: 'moderate',
          one_line_summary: 'Lowest predicted interference; multi-CYP redundancy (CYP3A4, CYP2D6, CYP1A2) buffers individual bacterial ortholog activity.',
          detailed_explanation: "Mirtazapine's three parallel CYP pathways provide substantial metabolic redundancy. E. coli and Pseudomonas aeruginosa carry CYP2D6-like orthologs, but their interference is offset by CYP3A4 and CYP1A2 backup routes. Glucuronidation via UGT1A4 is a minor elimination pathway, so the high β-glucuronidase burden has minimal predicted impact. Its NaSSA mechanism also sidesteps serotonin-pathway interference common among SSRIs.",
          key_interactions: [{ interaction_type: 'ortholog_degradation', description: 'E. coli CYP2D6-like ortholog (Tier 1, 18.5%) — partial pre-absorption degradation predicted', taxa_involved: ['Escherichia coli'], evidence_tier: 1, clinical_implication: 'Minor bioavailability reduction; offset by multi-CYP redundancy' }],
          risk_flags: ['Standard therapeutic monitoring advised given CYP2D6 ortholog burden'],
          potential_adjustments: 'Start at 15 mg nightly. No dose adjustment predicted from microbiome data alone.'
        },
        {
          drug_name: 'Bupropion', tier: 'Recommended', metabolic_interference_score: 0.26, confidence: 'moderate',
          one_line_summary: 'CYP2B6-primary metabolism avoids the heavily-colonized CYP2D6-ortholog taxa; hydroxybupropion active metabolite provides efficacy buffer.',
          detailed_explanation: "Bupropion is primarily metabolized by CYP2B6 to hydroxybupropion — an active, equipotent metabolite for which no high-abundance bacterial orthologs are present in this patient. Klebsiella pneumoniae carries a predicted CYP2B6-like activity (Tier 3, 8.2%), but this is low-confidence and clinically unlikely to be significant. The active metabolite buffer is substantial.",
          key_interactions: [{ interaction_type: 'ortholog_degradation', description: 'Klebsiella pneumoniae CYP2B6-like activity (Tier 3, 8.2%) — low-confidence prediction only', taxa_involved: ['Klebsiella pneumoniae'], evidence_tier: 3, clinical_implication: 'Predicted to be clinically insignificant' }],
          risk_flags: ['Strong CYP2D6 inhibitor — monitor any co-prescribed CYP2D6 substrates'],
          potential_adjustments: 'Standard dosing. Hydroxybupropion active metabolite provides efficacy backup against variable absorption.'
        },
        {
          drug_name: 'Escitalopram', tier: 'Recommended', metabolic_interference_score: 0.32, confidence: 'moderate',
          one_line_summary: 'Clean PK profile; CYP2C19 primary pathway faces modest ortholog burden from B. thetaiotaomicron and E. coli.',
          detailed_explanation: "Escitalopram has the cleanest SSRI pharmacokinetic profile, with only minor glucuronidation. The CYP2C19 primary pathway faces Tier 2 ortholog activity from B. thetaiotaomicron (9.1%) and E. coli (18.5%), but evidence tier and pathway redundancy keep the predicted interference moderate. Its 56% protein binding also reduces displacement DDI risk compared to high-protein-bound SSRIs.",
          key_interactions: [{ interaction_type: 'ortholog_degradation', description: 'B. thetaiotaomicron CYP2C19-like activity (Tier 2, 9.1%) and E. coli CYP2C19-like (Tier 2, 18.5%)', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Modest predicted bioavailability reduction; monitor for under-response at standard doses' }],
          risk_flags: ['CYP2C19 ortholog burden from two abundant taxa — consider upper-range dosing if response is suboptimal'],
          potential_adjustments: 'Standard dosing 10–20 mg. Consider 20 mg if response is suboptimal at 6–8 weeks.'
        },
        {
          drug_name: 'Fluoxetine', tier: 'Consider', metabolic_interference_score: 0.44, confidence: 'moderate',
          one_line_summary: "E. coli CYP2D6 ortholog creates moderate primary-pathway interference; norfluoxetine's ultra-long half-life provides a meaningful buffer.",
          detailed_explanation: "Fluoxetine's primary CYP2D6 pathway faces direct competition from E. coli (18.5%, Tier 1) and Pseudomonas aeruginosa (3.1%, Tier 2). However, the active metabolite norfluoxetine has an unusually long half-life (4–16 days), providing a large pharmacological buffer. Glucuronidation is a minor pathway for fluoxetine, limiting GUS-related risk. Net interference is moderate.",
          key_interactions: [
            { interaction_type: 'ortholog_degradation', description: 'E. coli CYP2D6-like reductase (Tier 1, 18.5%) — highest-confidence single-taxon interaction', taxa_involved: ['Escherichia coli', 'Pseudomonas aeruginosa'], evidence_tier: 1, clinical_implication: 'Reduced parent compound levels predicted; monitor for under-response' },
            { interaction_type: 'enterohepatic_reactivation', description: 'β-glucuronidase producers present; glucuronidation is minor pathway for fluoxetine', taxa_involved: ['Bacteroides fragilis', 'Enterococcus faecalis'], evidence_tier: 2, clinical_implication: 'Low reactivation risk for this specific drug' }
          ],
          risk_flags: ['E. coli CYP2D6 ortholog at 18.5% — consider plasma level monitoring at 4–6 weeks', 'Strong CYP2D6 inhibitor — significant DDI potential'],
          potential_adjustments: 'May require higher-end-of-range dosing. Plasma level monitoring recommended if available.'
        },
        {
          drug_name: 'Venlafaxine', tier: 'Caution', metabolic_interference_score: 0.74, confidence: 'high',
          one_line_summary: "ODV active metabolite primarily eliminated via glucuronidation — a MAJOR pathway facing the highest β-glucuronidase load in this profile.",
          detailed_explanation: "Venlafaxine's active metabolite ODV (desvenlafaxine) is primarily eliminated via glucuronidation, making this the highest-risk drug in this microbiome context. This patient carries multiple high-abundance β-glucuronidase producers: E. coli (18.5%), Bacteroides fragilis (14.3%), Enterococcus faecalis (7.4%), and Ruminococcus gnavus (4.8%). Deconjugation and re-absorption of glucuronidated ODV creates unpredictable enterohepatic cycling and erratic plasma levels.",
          key_interactions: [{ interaction_type: 'enterohepatic_reactivation', description: 'Four Tier 1 GUS producers with combined abundance >44% deconjugate ODV-glucuronide', taxa_involved: ['Escherichia coli', 'Bacteroides fragilis', 'Enterococcus faecalis', 'Ruminococcus gnavus'], evidence_tier: 1, clinical_implication: 'High risk of erratic ODV plasma levels; effective dose unpredictable' }],
          risk_flags: ['ODV glucuronidation is a MAJOR elimination pathway — critical vulnerability', 'Consider Mirtazapine or Bupropion instead'],
          potential_adjustments: 'If clinically necessary, therapeutic drug monitoring is strongly advised. Avoid unless other options exhausted.'
        },
        {
          drug_name: 'Sertraline', tier: 'Caution', metabolic_interference_score: 0.68, confidence: 'high',
          one_line_summary: 'Prior failure combined with CYP2C19-ortholog burden; microbiome interference may have contributed to non-response.',
          detailed_explanation: "Sertraline failed this patient. Microbiome analysis reveals CYP2C19-ortholog activity from Bacteroides thetaiotaomicron (9.1%, Tier 2) and E. coli (18.5%, Tier 2) that likely reduced bioavailability at the time of the prior trial. UGT1A1-mediated glucuronidation adds secondary GUS-reactivation risk. Notably, the prior failure may be microbiome-related — if the dysbiosis is treated, sertraline may be worth reconsidering.",
          key_interactions: [{ interaction_type: 'ortholog_degradation', description: 'Combined CYP2C19-like ortholog burden from B. thetaiotaomicron + E. coli reduces primary pathway availability', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Reduced bioavailability predicted; may explain prior treatment failure' }],
          risk_flags: ['Prior treatment failure — consider microbiome interference as mechanism', 'CYP2C19 ortholog burden present in two abundant taxa'],
          potential_adjustments: 'If retreating with sertraline, combine with gut microbiome restoration strategy and consider TDM.'
        }
      ],
      microbiome_context: {
        summary: "Post-antibiotic dysbiosis: Proteobacteria overgrowth (E. coli 18.5%, Klebsiella 8.2%) with Firmicutes depletion. The loss of Faecalibacterium prausnitzii (2.1%) and Eubacterium rectale (1.3%) removes protective butyrate producers that maintain gut barrier integrity. High combined β-glucuronidase burden (>40% GUS-producing taxa) creates systemic metabolite reactivation risk for glucuronidated drugs.",
        key_taxa_of_concern: [
          { taxon: 'Escherichia coli', concern: 'CYP2D6 + CYP2C19 orthologs (Tier 1); strong GUS producer — highest single-taxon risk at 18.5%', drugs_affected: ['Fluoxetine', 'Sertraline', 'Venlafaxine', 'Mirtazapine'] },
          { taxon: 'Bacteroides fragilis', concern: 'Strong β-glucuronidase producer (Tier 1, 14.3%) — major contributor to enterohepatic reactivation', drugs_affected: ['Venlafaxine', 'Sertraline'] },
          { taxon: 'Enterococcus faecalis', concern: 'CYP2D6-like activity (Tier 2) + strong GUS (Tier 1, 7.4%); also produces tyramine', drugs_affected: ['Fluoxetine', 'Mirtazapine', 'Venlafaxine'] },
          { taxon: 'Faecalibacterium prausnitzii', concern: 'Severely depleted (2.1%) — loss of anti-inflammatory butyrate production increases gut permeability', drugs_affected: [] }
        ]
      },
      limitations_and_caveats: [
        'Sequence homology does not guarantee functional equivalence. Bacterial orthologs may not metabolize drugs identically to human enzymes.',
        'Microbiome composition is dynamic and changes with diet, antibiotics, and illness. These predictions reflect the profile at time of sampling.',
        'This analysis does not account for human pharmacogenomic variation (e.g., CYP2D6 poor/ultrarapid metabolizer status). Combining microbiome and pharmacogenomic data would substantially improve accuracy.',
        'The current knowledge base is limited to 6 antidepressants. Tricyclics, MAOIs, and augmentation agents are outside this version\'s scope.',
        'Dose-response relationships are not modeled. Predictions address relative bioavailability and metabolic interference, not therapeutic equivalence at any specific dose.'
      ],
      disclaimer: 'This is a research/educational tool. All predictions are probabilistic and based on emerging pharmacomicrobiomics evidence. This tool does not replace clinical judgment. Microbiome-drug interactions are an active area of research and many interactions remain unvalidated.'
    }
  },

  // ── DEMO-002 ────────────────────────────────────────────────────────────────
  patient2_ptsd_glucuronidase: {
    status: 'success',

    taxa: [
      { name: 'Ruminococcus gnavus',           phylum: 'Firmicutes',      abundance: 11.4, gus: true,  cyp: null },
      { name: 'Enterococcus faecalis',          phylum: 'Firmicutes',      abundance:  9.2, gus: true,  cyp: 'CYP2D6' },
      { name: 'Faecalibacterium prausnitzii',   phylum: 'Firmicutes',      abundance:  8.7, gus: false, cyp: null },
      { name: 'Bacteroides fragilis',           phylum: 'Bacteroidetes',   abundance:  7.6, gus: true,  cyp: 'CYP2D6' },
      { name: 'Clostridium scindens',           phylum: 'Firmicutes',      abundance:  6.8, gus: true,  cyp: 'CYP3A4' },
      { name: 'Eubacterium rectale',            phylum: 'Firmicutes',      abundance:  6.1, gus: false, cyp: null },
      { name: 'Bacteroides thetaiotaomicron',   phylum: 'Bacteroidetes',   abundance:  5.9, gus: true,  cyp: 'CYP2C19' },
      { name: 'Clostridium bolteae',            phylum: 'Firmicutes',      abundance:  5.3, gus: true,  cyp: 'CYP2D6' },
      { name: 'Bifidobacterium longum',         phylum: 'Actinobacteria',  abundance:  5.2, gus: false, cyp: null },
      { name: 'Eggerthella lenta',              phylum: 'Actinobacteria',  abundance:  4.7, gus: false, cyp: 'CYP2D6' },
      { name: 'Escherichia coli',               phylum: 'Proteobacteria',  abundance:  4.3, gus: true,  cyp: 'CYP2D6/2C19' },
      { name: 'Akkermansia muciniphila',        phylum: 'Verrucomicrobia', abundance:  3.8, gus: false, cyp: null },
      { name: 'Lactobacillus rhamnosus',        phylum: 'Firmicutes',      abundance:  3.4, gus: false, cyp: null },
      { name: 'Bifidobacterium adolescentis',   phylum: 'Actinobacteria',  abundance:  3.1, gus: false, cyp: null },
      { name: 'Lactobacillus reuteri',          phylum: 'Firmicutes',      abundance:  2.1, gus: false, cyp: null },
    ],

    drug_scores: [
      { name: 'Escitalopram', score: 0.19, components: { ortho: 0.12, gus: 0.04 } },
      { name: 'Sertraline',   score: 0.28, components: { ortho: 0.16, gus: 0.09 } },
      { name: 'Mirtazapine',  score: 0.35, components: { ortho: 0.24, gus: 0.06 } },
      { name: 'Fluoxetine',   score: 0.41, components: { ortho: 0.26, gus: 0.10 } },
      { name: 'Bupropion',    score: 0.48, components: { ortho: 0.30, gus: 0.10 } },
      { name: 'Venlafaxine',  score: 0.81, components: { ortho: 0.18, gus: 0.50 } },
    ],

    graph: {
      drug_nodes: [
        { id: 'escitalopram', label: 'Escitalopram', tier: 'Recommended' },
        { id: 'sertraline',   label: 'Sertraline',   tier: 'Recommended' },
        { id: 'mirtazapine',  label: 'Mirtazapine',  tier: 'Consider' },
        { id: 'fluoxetine',   label: 'Fluoxetine',   tier: 'Consider' },
        { id: 'venlafaxine',  label: 'Venlafaxine',  tier: 'Caution' },
      ],
      taxa_nodes: [
        { id: 'rgnavus',   label: 'R. gnavus',              phylum: 'Firmicutes',     abundance: 11.4 },
        { id: 'efaec',     label: 'E. faecalis',            phylum: 'Firmicutes',     abundance:  9.2 },
        { id: 'bfrag',     label: 'B. fragilis',            phylum: 'Bacteroidetes',  abundance:  7.6 },
        { id: 'cscindens', label: 'C. scindens',            phylum: 'Firmicutes',     abundance:  6.8 },
        { id: 'btheta',    label: 'B. thetaiotaomicron',    phylum: 'Bacteroidetes',  abundance:  5.9 },
        { id: 'cbolteae',  label: 'C. bolteae',             phylum: 'Firmicutes',     abundance:  5.3 },
        { id: 'elenta',    label: 'E. lenta',               phylum: 'Actinobacteria', abundance:  4.7 },
        { id: 'ecoli',     label: 'E. coli',                phylum: 'Proteobacteria', abundance:  4.3 },
      ],
      edges: [
        { taxon:'rgnavus',   drug:'sertraline',   type:'gus', strength:0.80 },
        { taxon:'rgnavus',   drug:'venlafaxine',  type:'gus', strength:0.90 },
        { taxon:'rgnavus',   drug:'fluoxetine',   type:'gus', strength:0.55 },
        { taxon:'efaec',     drug:'venlafaxine',  type:'gus', strength:0.72 },
        { taxon:'efaec',     drug:'sertraline',   type:'gus', strength:0.55 },
        { taxon:'efaec',     drug:'fluoxetine',   type:'cyp', strength:0.40 },
        { taxon:'efaec',     drug:'mirtazapine',  type:'cyp', strength:0.40 },
        { taxon:'bfrag',     drug:'venlafaxine',  type:'gus', strength:0.65 },
        { taxon:'bfrag',     drug:'sertraline',   type:'gus', strength:0.50 },
        { taxon:'bfrag',     drug:'mirtazapine',  type:'cyp', strength:0.35 },
        { taxon:'cscindens', drug:'mirtazapine',  type:'cyp', strength:0.42 },
        { taxon:'cscindens', drug:'venlafaxine',  type:'cyp', strength:0.38 },
        { taxon:'btheta',    drug:'sertraline',   type:'cyp', strength:0.38 },
        { taxon:'btheta',    drug:'escitalopram', type:'cyp', strength:0.38 },
        { taxon:'cbolteae',  drug:'venlafaxine',  type:'gus', strength:0.42 },
        { taxon:'cbolteae',  drug:'fluoxetine',   type:'cyp', strength:0.28 },
        { taxon:'elenta',    drug:'fluoxetine',   type:'cyp', strength:0.30 },
        { taxon:'elenta',    drug:'mirtazapine',  type:'cyp', strength:0.30 },
        { taxon:'ecoli',     drug:'sertraline',   type:'cyp', strength:0.30 },
        { taxon:'ecoli',     drug:'venlafaxine',  type:'gus', strength:0.42 },
        { taxon:'ecoli',     drug:'fluoxetine',   type:'cyp', strength:0.30 },
      ],
    },

    recommendation: {
      patient_id: 'DEMO-002',
      diagnosis: 'Post-Traumatic Stress Disorder',
      recommendation_summary: "This patient's microbiome is moderately diverse but heavily enriched in β-glucuronidase-producing taxa. Ruminococcus gnavus (11.4%), Enterococcus faecalis (9.2%), and Bacteroides fragilis (7.6%) are all confirmed strong GUS producers. Drugs with major glucuronidation elimination pathways—particularly Venlafaxine—carry the highest predicted interference. Escitalopram and Sertraline show the most favorable profiles.",
      drug_recommendations: [
        {
          drug_name: 'Escitalopram', tier: 'Recommended', metabolic_interference_score: 0.19, confidence: 'high',
          one_line_summary: 'Clean PK profile with minimal bacterial ortholog burden; low protein binding reduces displacement interactions with Prazosin.',
          detailed_explanation: "Escitalopram has the cleanest pharmacokinetic profile among SSRIs, with high SERT selectivity and only minor glucuronidation. CYP2C19 is the primary metabolizing enzyme, and while Bacteroides thetaiotaomicron (5.9%) carries a Tier 2 CYP2C19-like ortholog, the interaction is predicted to be minor. Crucially, escitalopram's 56% protein binding creates minimal interaction risk with co-prescribed Prazosin.",
          key_interactions: [{ interaction_type: 'ortholog_degradation', description: 'B. thetaiotaomicron CYP2C19-like activity (Tier 2, 5.9%) — modest, low-confidence interaction', taxa_involved: ['Bacteroides thetaiotaomicron'], evidence_tier: 2, clinical_implication: 'Minor predicted reduction in bioavailability; not clinically significant' }],
          risk_flags: ['Monitor for additive hypotension with Prazosin at treatment initiation'],
          potential_adjustments: 'Standard dosing 10–20 mg. Excellent tolerability profile supports use in PTSD with hyperarousal symptoms.'
        },
        {
          drug_name: 'Sertraline', tier: 'Recommended', metabolic_interference_score: 0.28, confidence: 'moderate',
          one_line_summary: "First-line PTSD evidence base; CYP2C19 primary pathway faces moderate ortholog burden, but active metabolite provides buffer.",
          detailed_explanation: "Sertraline has the strongest evidence base for PTSD pharmacotherapy. CYP2C19-like orthologs are present in B. thetaiotaomicron (5.9%, Tier 2) and E. coli (4.3%, Tier 2), but sertraline's desmethylsertraline metabolite provides pharmacological backup. UGT1A1 glucuronidation is a secondary pathway; the GUS burden adds modest reactivation risk but is not the dominant interaction.",
          key_interactions: [
            { interaction_type: 'ortholog_degradation', description: 'Combined CYP2C19-like activity from B. thetaiotaomicron and E. coli reduces primary pathway efficiency', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Modest reduction in bioavailability; may warrant upper-range dosing' },
            { interaction_type: 'enterohepatic_reactivation', description: 'Secondary UGT1A1 glucuronidation faces moderate GUS burden from R. gnavus and E. faecalis', taxa_involved: ['Ruminococcus gnavus', 'Enterococcus faecalis'], evidence_tier: 1, clinical_implication: 'Minor contributor to plasma level variability' }
          ],
          risk_flags: ['High protein binding (98%) — monitor Prazosin displacement at dose changes'],
          potential_adjustments: 'Start at 25–50 mg; titrate to upper therapeutic range if response suboptimal at 6–8 weeks.'
        },
        {
          drug_name: 'Mirtazapine', tier: 'Consider', metabolic_interference_score: 0.35, confidence: 'moderate',
          one_line_summary: 'Useful for PTSD nightmares and sleep disruption; moderate interference from CYP3A4/2D6 ortholog load.',
          detailed_explanation: "Mirtazapine's multi-CYP metabolism provides redundancy, but Clostridium scindens (6.8%) carries a CYP3A4-like 7α-dehydroxylase (Tier 2), and Enterococcus faecalis (9.2%) contributes CYP2D6-like activity (Tier 2). The combined ortholog burden is moderate. Mirtazapine's H1 antagonism is particularly useful for PTSD-related insomnia and nightmare disruption.",
          key_interactions: [{ interaction_type: 'ortholog_degradation', description: 'C. scindens CYP3A4-like + E. faecalis CYP2D6-like create combined primary-pathway pressure', taxa_involved: ['Clostridium scindens', 'Enterococcus faecalis'], evidence_tier: 2, clinical_implication: 'Moderate predicted reduction in bioavailability; monitor therapeutic response' }],
          risk_flags: ['Sedation may potentiate Prazosin hypotension — initiate at lowest effective dose'],
          potential_adjustments: 'Start at 7.5–15 mg nightly. Consider for augmentation when sleep and nightmares dominate.'
        },
        {
          drug_name: 'Venlafaxine', tier: 'Caution', metabolic_interference_score: 0.81, confidence: 'high',
          one_line_summary: 'Highest interference score: ODV glucuronidation is the MAJOR elimination pathway, and this patient has the most severe GUS-producer enrichment of either demo case.',
          detailed_explanation: "Venlafaxine carries the highest predicted microbiome interference score in this profile. The patient's Ruminococcus gnavus (11.4%), Enterococcus faecalis (9.2%), Clostridium scindens (6.8%), Bacteroides fragilis (7.6%), and Clostridium bolteae (5.3%) — all Tier 1 or Tier 2 GUS producers — create a combined β-glucuronidase burden predicting severe enterohepatic cycling of ODV-glucuronide. ODV plasma levels would be highly unpredictable.",
          key_interactions: [{ interaction_type: 'enterohepatic_reactivation', description: 'Five GUS-producing taxa (combined ~40% abundance) deconjugate ODV-glucuronide, causing severe enterohepatic cycling', taxa_involved: ['Ruminococcus gnavus', 'Enterococcus faecalis', 'Clostridium scindens', 'Bacteroides fragilis', 'Clostridium bolteae'], evidence_tier: 1, clinical_implication: 'Highly unpredictable ODV plasma levels — dose titration extremely difficult' }],
          risk_flags: ['ODV glucuronidation is a MAJOR pathway — critical vulnerability in this microbiome', 'Highest GUS burden of either demo case', 'Consider Escitalopram or Sertraline instead'],
          potential_adjustments: 'Avoid unless other options fail. If used, therapeutic drug monitoring is mandatory.'
        }
      ],
      microbiome_context: {
        summary: "A moderately diverse microbiome notably enriched in β-glucuronidase producers. Ruminococcus gnavus (11.4%), Enterococcus faecalis (9.2%), Clostridium scindens (6.8%), and Bacteroides fragilis (7.6%) represent the highest GUS burden across both demo profiles. Protective species are relatively preserved: Faecalibacterium prausnitzii (8.7%) and Eubacterium rectale (6.1%) contribute healthy anti-inflammatory butyrate production.",
        key_taxa_of_concern: [
          { taxon: 'Ruminococcus gnavus', concern: 'Strong GUS producer (Tier 1, 11.4%); also produces tryptamine — serotonin precursor modulation', drugs_affected: ['Venlafaxine', 'Sertraline', 'Fluoxetine'] },
          { taxon: 'Enterococcus faecalis', concern: 'CYP2D6-like activity (Tier 2) + strong GUS (Tier 1, 9.2%); tyrosine decarboxylase produces tyramine', drugs_affected: ['Venlafaxine', 'Mirtazapine', 'Fluoxetine'] },
          { taxon: 'Clostridium scindens', concern: 'CYP3A4-like 7α-dehydroxylase (Tier 2, 6.8%); affects bile acid → serotonin axis via FXR/TGR5', drugs_affected: ['Mirtazapine', 'Venlafaxine'] }
        ]
      },
      limitations_and_caveats: [
        'Sequence homology does not guarantee functional equivalence. Bacterial orthologs may not metabolize drugs identically to human enzymes.',
        'Microbiome composition is dynamic and changes with diet, antibiotics, and illness. These predictions reflect the profile at time of sampling.',
        'This analysis does not account for human pharmacogenomic variation (e.g., CYP2D6 poor/ultrarapid metabolizer status). Combining microbiome and pharmacogenomic data would substantially improve accuracy.',
        'PTSD pharmacotherapy evidence is primarily from SSRI/SNRI trials that did not stratify by microbiome. Predictions are extrapolated from pharmacomicrobiomics data developed primarily in MDD populations.',
        'Prazosin interaction analysis is limited to protein-binding displacement. Prazosin is not metabolized by enzymes in the current knowledge base.'
      ],
      disclaimer: 'This is a research/educational tool. All predictions are probabilistic and based on emerging pharmacomicrobiomics evidence. This tool does not replace clinical judgment. Microbiome-drug interactions are an active area of research and many interactions remain unvalidated.'
    }
  }
};
