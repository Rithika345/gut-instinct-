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
 },
 {
 id: 'patient3_gad_balanced',
 label: 'DEMO-003 — GAD / Healthy Diverse Microbiome',
 badge: 'Generalized Anxiety Disorder',
 description: 'Balanced, diverse microbiome with high protective species. Demonstrates minimal microbiome interference — all drugs score favorably.',
 request: { diagnosis: 'Generalized Anxiety Disorder', patient_profile_id: 'patient3_gad_balanced', current_medications: [], prior_failures: [] }
 },
 {
 id: 'patient4_mdd_ibs_firmicutes',
 label: 'DEMO-004 — MDD + IBS / Firmicutes Dysbiosis',
 badge: 'Major Depressive Disorder',
 description: 'IBS comorbidity with Clostridium-dominant dysbiosis. Heavy enzymatic pathway pressure reverses Mirtazapine\'s usual advantage.',
 request: { diagnosis: 'Major Depressive Disorder', patient_profile_id: 'patient4_mdd_ibs_firmicutes', current_medications: [], prior_failures: [] }
 }
];

const DEMO_RESULTS = {

 // ── DEMO-001 ────────────────────────────────────────────────────────────────
 patient1_mdd_dysbiosis: {
 status: 'success',

 // ── Microbiome profile (Agent 2 input) ──────────────────────────────────
 taxa: [
  { name: 'Escherichia coli',    phylum: 'Proteobacteria', abundance: 18.5, gus: true, enzyme: 'Oxidoreductases' },
  { name: 'Bacteroides fragilis',   phylum: 'Bacteroidetes', abundance: 14.3, gus: true, enzyme: 'Nitroreductases' },
  { name: 'Bacteroides thetaiotaomicron', phylum: 'Bacteroidetes', abundance: 9.1, gus: true, enzyme: null },
  { name: 'Klebsiella pneumoniae',   phylum: 'Proteobacteria', abundance: 8.2, gus: true, enzyme: null },
  { name: 'Enterococcus faecalis',   phylum: 'Firmicutes',  abundance: 7.4, gus: false, enzyme: 'Tyr. decarboxylase' },
  { name: 'Bacteroides vulgatus',   phylum: 'Bacteroidetes', abundance: 6.7, gus: true, enzyme: null },
  { name: 'Ruminococcus gnavus',   phylum: 'Firmicutes',  abundance: 4.8, gus: true, enzyme: null },
  { name: 'Pseudomonas aeruginosa',  phylum: 'Proteobacteria', abundance: 3.1, gus: false, enzyme: 'Monooxygenases' },
  { name: 'Clostridium bolteae',   phylum: 'Firmicutes',  abundance: 3.2, gus: true, enzyme: null },
  { name: 'Eggerthella lenta',    phylum: 'Actinobacteria', abundance: 2.6, gus: false, enzyme: 'Cgr2 reductase' },
  { name: 'Faecalibacterium prausnitzii', phylum: 'Firmicutes',  abundance: 2.1, gus: false, enzyme: null },
  { name: 'Bifidobacterium longum',  phylum: 'Actinobacteria', abundance: 1.8, gus: false, enzyme: null },
  { name: 'Eubacterium rectale',   phylum: 'Firmicutes',  abundance: 1.3, gus: false, enzyme: null },
  { name: 'Prevotella copri',    phylum: 'Bacteroidetes', abundance: 1.2, gus: false, enzyme: null },
  { name: 'Akkermansia muciniphila',  phylum: 'Verrucomicrobia', abundance: 0.8, gus: false, enzyme: null },
 ],

 // ── Drug scores (Agent 3 output) ─────────────────────────────────────────
 drug_scores: [
  { name: 'Mirtazapine', score: 0.21, components: { enz: 0.14, gus: 0.03 } },
  { name: 'Bupropion',  score: 0.26, components: { enz: 0.20, gus: 0.02 } },
  { name: 'Escitalopram', score: 0.32, components: { enz: 0.18, gus: 0.08 } },
  { name: 'Fluoxetine', score: 0.44, components: { enz: 0.30, gus: 0.06 } },
  { name: 'Sertraline', score: 0.68, components: { enz: 0.28, gus: 0.24 } },
  { name: 'Venlafaxine', score: 0.74, components: { enz: 0.22, gus: 0.38 } },
 ],

 // ── Interaction network (Agent 3 graph) ───────────────────────────────────
 graph: {
  drug_nodes: [
  { id: 'fluoxetine', label: 'Fluoxetine', tier: 'Consider' },
  { id: 'sertraline', label: 'Sertraline', tier: 'Caution' },
  { id: 'escitalopram', label: 'Escitalopram', tier: 'Recommended' },
  { id: 'venlafaxine', label: 'Venlafaxine', tier: 'Caution' },
  { id: 'bupropion', label: 'Bupropion', tier: 'Recommended' },
  { id: 'mirtazapine', label: 'Mirtazapine', tier: 'Recommended' },
  ],
  taxa_nodes: [
  { id: 'ecoli',  label: 'E. coli',     phylum: 'Proteobacteria', abundance: 18.5 },
  { id: 'bfrag',  label: 'B. fragilis',    phylum: 'Bacteroidetes', abundance: 14.3 },
  { id: 'btheta', label: 'B. thetaiotaomicron',  phylum: 'Bacteroidetes', abundance: 9.1 },
  { id: 'kpneu',  label: 'K. pneumoniae',   phylum: 'Proteobacteria', abundance: 8.2 },

  { id: 'bvulg',  label: 'B. vulgatus',    phylum: 'Bacteroidetes', abundance: 6.7 },
  { id: 'rgnavus', label: 'R. gnavus',    phylum: 'Firmicutes',  abundance: 4.8 },
  { id: 'paerug', label: 'P. aeruginosa',   phylum: 'Proteobacteria', abundance: 3.1 },
  { id: 'elenta', label: 'E. lenta',     phylum: 'Actinobacteria', abundance: 2.6 },
  ],
  edges: [
  // E. coli
  { taxon:'ecoli', drug:'fluoxetine', type: 'enz', strength:0.90 },
  { taxon:'ecoli', drug:'mirtazapine', type: 'enz', strength:0.90 },
  { taxon:'ecoli', drug:'venlafaxine', type: 'enz', strength:0.90 },
  { taxon:'ecoli', drug:'sertraline', type: 'enz', strength:0.65 },
  { taxon:'ecoli', drug:'escitalopram', type: 'enz', strength:0.65 },
  { taxon:'ecoli', drug:'sertraline', type:'gus', strength:0.80 },
  { taxon:'ecoli', drug:'venlafaxine', type:'gus', strength:0.90 },
  // B. fragilis
  { taxon:'bfrag', drug:'sertraline', type:'gus', strength:0.72 },
  { taxon:'bfrag', drug:'venlafaxine', type:'gus', strength:0.80 },
  { taxon:'bfrag', drug:'fluoxetine', type: 'enz', strength:0.38 },
  { taxon:'bfrag', drug:'mirtazapine', type: 'enz', strength:0.38 },
  // B. thetaiotaomicron
  { taxon:'btheta', drug:'sertraline', type: 'enz', strength:0.42 },
  { taxon:'btheta', drug:'escitalopram', type: 'enz', strength:0.42 },
  { taxon:'btheta', drug:'sertraline', type:'gus', strength:0.42 },
  // K. pneumoniae
  { taxon:'kpneu', drug:'mirtazapine', type: 'enz', strength:0.40 },
  { taxon:'kpneu', drug:'venlafaxine', type: 'enz', strength:0.40 },
  { taxon:'kpneu', drug:'bupropion', type: 'enz', strength:0.28 },

  // B. vulgatus
  { taxon:'bvulg', drug:'mirtazapine', type: 'enz', strength:0.30 },
  { taxon:'bvulg', drug:'venlafaxine', type: 'enz', strength:0.30 },
  // R. gnavus
  { taxon:'rgnavus', drug:'sertraline', type:'gus', strength:0.35 },
  { taxon:'rgnavus', drug:'venlafaxine', type:'gus', strength:0.40 },
  // P. aeruginosa
  { taxon:'paerug', drug:'fluoxetine', type: 'enz', strength:0.22 },
  { taxon:'paerug', drug:'mirtazapine', type: 'enz', strength:0.22 },
  // E. lenta
  { taxon:'elenta', drug:'fluoxetine', type: 'enz', strength:0.20 },
  ],
 },

 // ── Agent 4 recommendation ────────────────────────────────────────────────
 recommendation: {
  patient_id: 'DEMO-001',
  diagnosis: 'Major Depressive Disorder',
  recommendation_summary: "This patient's post-antibiotic dysbiosis creates high microbiome-drug interference for several antidepressants. Elevated Proteobacteria—E. coli at 18.5% and Klebsiella at 8.2%—carry well-documented drug-metabolizing enzyme activity (oxidoreductases, nitroreductases; non-CYP per Zimmermann 2019) and β-glucuronidase activity. Mirtazapine and Bupropion show the lowest predicted interference and are preferred first-line options.",
  drug_recommendations: [
  {
   drug_name: 'Mirtazapine', tier: 'Recommended', metabolic_interference_score: 0.21, confidence: 'moderate',
   one_line_summary: 'Lowest predicted interference; multi-CYP redundancy (CYP3A4, CYP2D6, CYP1A2) buffers individual bacterial enzymatic degradation activity.',
   detailed_explanation: "Mirtazapine's three parallel CYP pathways provide substantial metabolic redundancy. E. coli and Pseudomonas aeruginosa carry oxidoreductase activity (non-CYP, Zimmermann 2019), but their interference is offset by CYP3A4 and CYP1A2 backup routes. Glucuronidation via UGT1A4 is a minor elimination pathway, so the high β-glucuronidase burden has minimal predicted impact. Its NaSSA mechanism also sidesteps serotonin-pathway interference common among SSRIs.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'E. coli oxidoreductase activity (non-CYP, Zimmermann 2019; Tier 1, 18.5%) — partial pre-absorption degradation predicted', taxa_involved: ['Escherichia coli'], evidence_tier: 1, clinical_implication: 'Minor bioavailability reduction; offset by multi-CYP redundancy' }],
   risk_flags: ['Standard therapeutic monitoring advised given bacterial drug-metabolizing enzyme burden'],
   potential_adjustments: 'Start at 15 mg nightly. No dose adjustment predicted from microbiome data alone.'
  },
  {
   drug_name: 'Bupropion', tier: 'Recommended', metabolic_interference_score: 0.26, confidence: 'moderate',
   one_line_summary: 'CYP2B6-primary metabolism avoids the heavily-colonized drug-metabolizing taxa; hydroxybupropion active metabolite provides efficacy buffer.',
   detailed_explanation: "Bupropion is primarily metabolized by CYP2B6 to hydroxybupropion — an active, equipotent metabolite for which no high-abundance bacterial enzymes are present in this patient. Klebsiella pneumoniae carries a predicted predicted xenobiotic metabolism (Tier 3, 8.2%), but this is low-confidence and clinically unlikely to be significant. The active metabolite buffer is substantial.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'Klebsiella pneumoniae predicted xenobiotic metabolism (Tier 3, 8.2%) — low-confidence prediction only', taxa_involved: ['Klebsiella pneumoniae'], evidence_tier: 3, clinical_implication: 'Predicted to be clinically insignificant' }],
   risk_flags: ['Strong CYP2D6 inhibitor — monitor any co-prescribed CYP2D6 substrates'],
   potential_adjustments: 'Standard dosing. Hydroxybupropion active metabolite provides efficacy backup against variable absorption.'
  },
  {
   drug_name: 'Escitalopram', tier: 'Recommended', metabolic_interference_score: 0.32, confidence: 'moderate',
   one_line_summary: 'Clean PK profile; CYP2C19 primary pathway faces modest enzymatic burden from B. thetaiotaomicron and E. coli.',
   detailed_explanation: "Escitalopram has the cleanest SSRI pharmacokinetic profile, with only minor glucuronidation. The CYP2C19 primary pathway faces Tier 2 enzyme activity from B. thetaiotaomicron (9.1%) and E. coli (18.5%), but evidence tier and pathway redundancy keep the predicted interference moderate. Its 56% protein binding also reduces displacement DDI risk compared to high-protein-bound SSRIs.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'B. thetaiotaomicron drug-metabolizing enzyme activity (Tier 2, 9.1%) and E. coli oxidoreductase activity (Tier 2, 18.5%)', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Modest predicted bioavailability reduction; monitor for under-response at standard doses' }],
   risk_flags: ['CYP2C19 enzymatic burden from two abundant taxa — consider upper-range dosing if response is suboptimal'],
   potential_adjustments: 'Standard dosing 10–20 mg. Consider 20 mg if response is suboptimal at 6–8 weeks.'
  },
  {
   drug_name: 'Fluoxetine', tier: 'Consider', metabolic_interference_score: 0.44, confidence: 'moderate',
   one_line_summary: "E. coli oxidoreductase activity creates moderate primary-pathway interference; norfluoxetine's ultra-long half-life provides a meaningful buffer.",
   detailed_explanation: "Fluoxetine's primary CYP2D6 pathway faces direct competition from E. coli oxidoreductases (18.5%, Tier 1; non-CYP, Zimmermann 2019) and Pseudomonas aeruginosa (3.1%, Tier 2). However, the active metabolite norfluoxetine has an unusually long half-life (4–16 days), providing a large pharmacological buffer. Glucuronidation is a minor pathway for fluoxetine, limiting GUS-related risk. Net interference is moderate.",
   key_interactions: [
   { interaction_type: 'enzymatic_degradation', description: 'E. coli oxidoreductase (non-CYP, Zimmermann 2019; Tier 1, 18.5%) — highest-confidence single-taxon interaction', taxa_involved: ['Escherichia coli', 'Pseudomonas aeruginosa'], evidence_tier: 1, clinical_implication: 'Reduced parent compound levels predicted; monitor for under-response' },
   { interaction_type: 'enterohepatic_reactivation', description: 'β-glucuronidase producers present; glucuronidation is minor pathway for fluoxetine', taxa_involved: ['Bacteroides fragilis'], evidence_tier: 2, clinical_implication: 'Low reactivation risk for this specific drug' }
   ],
   risk_flags: ['E. coli oxidoreductase activity at 18.5% — consider plasma level monitoring at 4–6 weeks', 'Strong CYP2D6 inhibitor — significant DDI potential'],
   potential_adjustments: 'May require higher-end-of-range dosing. Plasma level monitoring recommended if available.'
  },
  {
   drug_name: 'Venlafaxine', tier: 'Caution', metabolic_interference_score: 0.74, confidence: 'high',
   one_line_summary: "ODV active metabolite primarily eliminated via glucuronidation — a MAJOR pathway facing the highest β-glucuronidase load in this profile.",
   detailed_explanation: "Venlafaxine's active metabolite ODV (desvenlafaxine) is primarily eliminated via glucuronidation, making this the highest-risk drug in this microbiome context. This patient carries multiple high-abundance β-glucuronidase producers: E. coli (18.5%), Bacteroides fragilis (14.3%), and Ruminococcus gnavus (4.8%). Note: E. faecalis has beta-galactosidase, NOT beta-glucuronidase, and is excluded from GUS burden calculations. Deconjugation and re-absorption of glucuronidated ODV creates unpredictable enterohepatic cycling and erratic plasma levels.",
   key_interactions: [{ interaction_type: 'enterohepatic_reactivation', description: 'Three Tier 1 GUS producers with combined abundance >37% deconjugate ODV-glucuronide', taxa_involved: ['Escherichia coli', 'Bacteroides fragilis', 'Ruminococcus gnavus'], evidence_tier: 1, clinical_implication: 'High risk of erratic ODV plasma levels; effective dose unpredictable' }],
   risk_flags: ['ODV glucuronidation is a MAJOR elimination pathway — critical vulnerability', 'Consider Mirtazapine or Bupropion instead'],
   potential_adjustments: 'If clinically necessary, therapeutic drug monitoring is strongly advised. Avoid unless other options exhausted.'
  },
  {
   drug_name: 'Sertraline', tier: 'Caution', metabolic_interference_score: 0.68, confidence: 'high',
   one_line_summary: 'Prior failure combined with CYP2C19-enzymatic burden; microbiome interference may have contributed to non-response.',
   detailed_explanation: "Sertraline failed this patient. Microbiome analysis reveals CYP2C19-enzyme activity from Bacteroides thetaiotaomicron (9.1%, Tier 2) and E. coli (18.5%, Tier 2) that likely reduced bioavailability at the time of the prior trial. UGT1A1-mediated glucuronidation adds secondary GUS-reactivation risk. Notably, the prior failure may be microbiome-related — if the dysbiosis is treated, sertraline may be worth reconsidering.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'Combined drug-metabolizing enzyme activity burden from B. thetaiotaomicron + E. coli reduces primary pathway availability', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Reduced bioavailability predicted; may explain prior treatment failure' }],
   risk_flags: ['Prior treatment failure — consider microbiome interference as mechanism', 'CYP2C19 enzymatic burden present in two abundant taxa'],
   potential_adjustments: 'If retreating with sertraline, combine with gut microbiome restoration strategy and consider TDM.'
  }
  ],
  microbiome_context: {
  summary: "Post-antibiotic dysbiosis: Proteobacteria overgrowth (E. coli 18.5%, Klebsiella 8.2%) with Firmicutes depletion. The loss of Faecalibacterium prausnitzii (2.1%) and Eubacterium rectale (1.3%) removes protective butyrate producers that maintain gut barrier integrity. High combined β-glucuronidase burden (>40% GUS-producing taxa) creates systemic metabolite reactivation risk for glucuronidated drugs.",
  key_taxa_of_concern: [
   { taxon: 'Escherichia coli', concern: 'Oxidoreductase/nitroreductase activity (non-CYP, Zimmermann 2019; Tier 1); strong GUS producer — highest single-taxon risk at 18.5%', drugs_affected: ['Fluoxetine', 'Sertraline', 'Venlafaxine', 'Mirtazapine'] },
   { taxon: 'Bacteroides fragilis', concern: 'Nitroreductase activity (non-CYP, Zimmermann 2019) + strong β-glucuronidase producer (Tier 1, 14.3%) — major contributor to enterohepatic reactivation', drugs_affected: ['Venlafaxine', 'Sertraline'] },
   { taxon: 'Enterococcus faecalis', concern: 'Tyrosine decarboxylase (L-DOPA metabolism) — NOT a confirmed GUS producer (has beta-galactosidase, not beta-glucuronidase); no validated enzymatic degradations; tyramine production is the primary concern', drugs_affected: [] },
   { taxon: 'Faecalibacterium prausnitzii', concern: 'Severely depleted (2.1%) — loss of anti-inflammatory butyrate production increases gut permeability', drugs_affected: [] }
  ]
  },
  limitations_and_caveats: [
  'Bacterial drug-metabolizing enzymes operate through different mechanisms than human CYP450 enzymes. Functional activity predictions are based on documented in vitro metabolism (Zimmermann 2019), not sequence homology.',
  'Microbiome composition is dynamic and changes with diet, antibiotics, and illness. These predictions reflect the profile at time of sampling.',
  'This analysis does not account for human pharmacogenomic variation (e.g., CYP2D6 poor/ultrarapid metabolizer status). Combining microbiome and pharmacogenomic data would substantially improve accuracy.',
  'Most bacterial drug metabolism in the gut occurs via non-CYP enzyme families (oxidoreductases, nitroreductases, hydrolases) rather than direct CYP450 orthologs.',
  'Dose-response relationships are not modeled. Predictions address relative bioavailability and metabolic interference, not therapeutic equivalence at any specific dose.',
  'No prospective clinical trial has yet demonstrated that microbiome-guided psychiatric prescribing improves patient outcomes.'
  ],
  disclaimer: 'This is a research/educational tool. All predictions are probabilistic and based on emerging pharmacomicrobiomics evidence. This tool does not replace clinical judgment. Microbiome-drug interactions are an active area of research and many interactions remain unvalidated.'
 }
 },

 // ── DEMO-002 ────────────────────────────────────────────────────────────────
 patient2_ptsd_glucuronidase: {
 status: 'success',

 taxa: [
  { name: 'Ruminococcus gnavus',   phylum: 'Firmicutes',  abundance: 11.4, gus: true, enzyme: null },
  { name: 'Enterococcus faecalis',   phylum: 'Firmicutes',  abundance: 9.2, gus: false, enzyme: 'Tyr. decarboxylase' },
  { name: 'Faecalibacterium prausnitzii', phylum: 'Firmicutes',  abundance: 8.7, gus: false, enzyme: null },
  { name: 'Bacteroides fragilis',   phylum: 'Bacteroidetes', abundance: 7.6, gus: true, enzyme: 'Nitroreductases' },
  { name: 'Clostridium scindens',   phylum: 'Firmicutes',  abundance: 6.8, gus: true, enzyme: '7α-dehydroxylase' },
  { name: 'Eubacterium rectale',   phylum: 'Firmicutes',  abundance: 6.1, gus: false, enzyme: null },
  { name: 'Bacteroides thetaiotaomicron', phylum: 'Bacteroidetes', abundance: 5.9, gus: true, enzyme: null },
  { name: 'Clostridium bolteae',   phylum: 'Firmicutes',  abundance: 5.3, gus: true, enzyme: null },
  { name: 'Bifidobacterium longum',   phylum: 'Actinobacteria', abundance: 5.2, gus: false, enzyme: null },
  { name: 'Eggerthella lenta',    phylum: 'Actinobacteria', abundance: 4.7, gus: false, enzyme: 'Cgr2 reductase' },
  { name: 'Escherichia coli',    phylum: 'Proteobacteria', abundance: 4.3, gus: true, enzyme: 'Oxidoreductases' },
  { name: 'Akkermansia muciniphila',  phylum: 'Verrucomicrobia', abundance: 3.8, gus: false, enzyme: null },
  { name: 'Lactobacillus rhamnosus',  phylum: 'Firmicutes',  abundance: 3.4, gus: false, enzyme: null },
  { name: 'Bifidobacterium adolescentis', phylum: 'Actinobacteria', abundance: 3.1, gus: false, enzyme: null },
  { name: 'Lactobacillus reuteri',   phylum: 'Firmicutes',  abundance: 2.1, gus: false, enzyme: null },
 ],

 drug_scores: [
  { name: 'Escitalopram', score: 0.19, components: { enz: 0.12, gus: 0.04 } },
  { name: 'Sertraline', score: 0.28, components: { enz: 0.16, gus: 0.09 } },
  { name: 'Mirtazapine', score: 0.35, components: { enz: 0.24, gus: 0.06 } },
  { name: 'Fluoxetine', score: 0.41, components: { enz: 0.26, gus: 0.10 } },
  { name: 'Bupropion', score: 0.48, components: { enz: 0.30, gus: 0.10 } },
  { name: 'Venlafaxine', score: 0.81, components: { enz: 0.18, gus: 0.50 } },
 ],

 graph: {
  drug_nodes: [
  { id: 'escitalopram', label: 'Escitalopram', tier: 'Recommended' },
  { id: 'sertraline', label: 'Sertraline', tier: 'Recommended' },
  { id: 'mirtazapine', label: 'Mirtazapine', tier: 'Consider' },
  { id: 'fluoxetine', label: 'Fluoxetine', tier: 'Consider' },
  { id: 'venlafaxine', label: 'Venlafaxine', tier: 'Caution' },
  ],
  taxa_nodes: [
  { id: 'rgnavus', label: 'R. gnavus',    phylum: 'Firmicutes',  abundance: 11.4 },

  { id: 'bfrag',  label: 'B. fragilis',   phylum: 'Bacteroidetes', abundance: 7.6 },
  { id: 'cscindens', label: 'C. scindens',   phylum: 'Firmicutes',  abundance: 6.8 },
  { id: 'btheta', label: 'B. thetaiotaomicron', phylum: 'Bacteroidetes', abundance: 5.9 },
  { id: 'cbolteae', label: 'C. bolteae',    phylum: 'Firmicutes',  abundance: 5.3 },
  { id: 'elenta', label: 'E. lenta',    phylum: 'Actinobacteria', abundance: 4.7 },
  { id: 'ecoli',  label: 'E. coli',    phylum: 'Proteobacteria', abundance: 4.3 },
  ],
  edges: [
  { taxon:'rgnavus', drug:'sertraline', type:'gus', strength:0.80 },
  { taxon:'rgnavus', drug:'venlafaxine', type:'gus', strength:0.90 },
  { taxon:'rgnavus', drug:'fluoxetine', type:'gus', strength:0.55 },

  { taxon:'bfrag',  drug:'venlafaxine', type:'gus', strength:0.65 },
  { taxon:'bfrag',  drug:'sertraline', type:'gus', strength:0.50 },
  { taxon:'bfrag',  drug:'mirtazapine', type: 'enz', strength:0.35 },
  { taxon:'cscindens', drug:'mirtazapine', type: 'enz', strength:0.42 },
  { taxon:'cscindens', drug:'venlafaxine', type: 'enz', strength:0.38 },
  { taxon:'btheta', drug:'sertraline', type: 'enz', strength:0.38 },
  { taxon:'btheta', drug:'escitalopram', type: 'enz', strength:0.38 },
  { taxon:'cbolteae', drug:'venlafaxine', type:'gus', strength:0.42 },
  { taxon:'cbolteae', drug:'fluoxetine', type: 'enz', strength:0.28 },
  { taxon:'elenta', drug:'fluoxetine', type: 'enz', strength:0.30 },
  { taxon:'elenta', drug:'mirtazapine', type: 'enz', strength:0.30 },
  { taxon:'ecoli',  drug:'sertraline', type: 'enz', strength:0.30 },
  { taxon:'ecoli',  drug:'venlafaxine', type:'gus', strength:0.42 },
  { taxon:'ecoli',  drug:'fluoxetine', type: 'enz', strength:0.30 },
  ],
 },

 recommendation: {
  patient_id: 'DEMO-002',
  diagnosis: 'Post-Traumatic Stress Disorder',
  recommendation_summary: "This patient's microbiome is moderately diverse but heavily enriched in β-glucuronidase-producing taxa. Ruminococcus gnavus (11.4%) and Bacteroides fragilis (7.6%) are confirmed strong GUS producers. Note: has beta-galactosidase, NOT beta-glucuronidase. Drugs with major glucuronidation elimination pathways—particularly Venlafaxine—carry the highest predicted interference. Escitalopram and Sertraline show the most favorable profiles.",
  drug_recommendations: [
  {
   drug_name: 'Escitalopram', tier: 'Recommended', metabolic_interference_score: 0.19, confidence: 'high',
   one_line_summary: 'Clean PK profile with minimal bacterial enzyme burden; low protein binding reduces displacement interactions with Prazosin.',
   detailed_explanation: "Escitalopram has the cleanest pharmacokinetic profile among SSRIs, with high SERT selectivity and only minor glucuronidation. CYP2C19 is the primary metabolizing enzyme, and while Bacteroides thetaiotaomicron (5.9%) carries a Tier 2 drug-metabolizing enzyme activity, the interaction is predicted to be minor. Crucially, escitalopram's 56% protein binding creates minimal interaction risk with co-prescribed Prazosin.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'B. thetaiotaomicron drug-metabolizing enzyme activity (Tier 2, 5.9%) — modest, low-confidence interaction', taxa_involved: ['Bacteroides thetaiotaomicron'], evidence_tier: 2, clinical_implication: 'Minor predicted reduction in bioavailability; not clinically significant' }],
   risk_flags: ['Monitor for additive hypotension with Prazosin at treatment initiation'],
   potential_adjustments: 'Standard dosing 10–20 mg. Excellent tolerability profile supports use in PTSD with hyperarousal symptoms.'
  },
  {
   drug_name: 'Sertraline', tier: 'Recommended', metabolic_interference_score: 0.28, confidence: 'moderate',
   one_line_summary: "First-line PTSD evidence base; CYP2C19 primary pathway faces moderate enzymatic burden, but active metabolite provides buffer.",
   detailed_explanation: "Sertraline has the strongest evidence base for PTSD pharmacotherapy. drug-metabolizing enzyme activitys are present in B. thetaiotaomicron (5.9%, Tier 2) and E. coli (4.3%, Tier 2), but sertraline's desmethylsertraline metabolite provides pharmacological backup. UGT1A1 glucuronidation is a secondary pathway; the GUS burden adds modest reactivation risk but is not the dominant interaction.",
   key_interactions: [
   { interaction_type: 'enzymatic_degradation', description: 'Combined drug-metabolizing enzyme activity from B. thetaiotaomicron and E. coli reduces primary pathway efficiency', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Modest reduction in bioavailability; may warrant upper-range dosing' },
   { interaction_type: 'enterohepatic_reactivation', description: 'Secondary UGT1A1 glucuronidation faces moderate GUS burden from R. gnavus', taxa_involved: ['Ruminococcus gnavus'], evidence_tier: 1, clinical_implication: 'Minor contributor to plasma level variability' }
   ],
   risk_flags: ['High protein binding (98%) — monitor Prazosin displacement at dose changes'],
   potential_adjustments: 'Start at 25–50 mg; titrate to upper therapeutic range if response suboptimal at 6–8 weeks.'
  },
  {
   drug_name: 'Mirtazapine', tier: 'Consider', metabolic_interference_score: 0.35, confidence: 'moderate',
   one_line_summary: 'Useful for PTSD nightmares and sleep disruption; moderate interference from CYP3A4/2D6 ortholog load.',
   detailed_explanation: "Mirtazapine's multi-CYP metabolism provides redundancy, but Clostridium scindens (6.8%) carries a bile acid 7α-dehydroxylase (bai operon) (Tier 2). Note: has tyrosine decarboxylase (acts on L-DOPA, not SSRIs/SNRIs/NDRIs) and no validated enzymatic degradations. The enzymatic burden from C. scindens is moderate. Mirtazapine's H1 antagonism is particularly useful for PTSD-related insomnia and nightmare disruption.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'C. scindens bile acid 7α-dehydroxylase (bai operon) creates primary-pathway pressure', taxa_involved: ['Clostridium scindens'], evidence_tier: 2, clinical_implication: 'Moderate predicted reduction in bioavailability; monitor therapeutic response' }],
   risk_flags: ['Sedation may potentiate Prazosin hypotension — initiate at lowest effective dose'],
   potential_adjustments: 'Start at 7.5–15 mg nightly. Consider for augmentation when sleep and nightmares dominate.'
  },
  {
   drug_name: 'Venlafaxine', tier: 'Caution', metabolic_interference_score: 0.81, confidence: 'high',
   one_line_summary: 'Highest interference score: ODV glucuronidation is the MAJOR elimination pathway, and this patient has the most severe GUS-producer enrichment of either demo case.',
   detailed_explanation: "Venlafaxine carries the highest predicted microbiome interference score in this profile. The patient's Ruminococcus gnavus (11.4%), Clostridium scindens (6.8%), Bacteroides fragilis (7.6%), and Clostridium bolteae (5.3%) — all Tier 1 or Tier 2 GUS producers — create a combined β-glucuronidase burden predicting severe enterohepatic cycling of ODV-glucuronide. Note: has beta-galactosidase, NOT beta-glucuronidase, and is excluded from GUS burden calculations. ODV plasma levels would be highly unpredictable.",
   key_interactions: [{ interaction_type: 'enterohepatic_reactivation', description: 'Four GUS-producing taxa (combined ~31% abundance) deconjugate ODV-glucuronide, causing severe enterohepatic cycling', taxa_involved: ['Ruminococcus gnavus', 'Clostridium scindens', 'Bacteroides fragilis', 'Clostridium bolteae'], evidence_tier: 1, clinical_implication: 'Highly unpredictable ODV plasma levels — dose titration extremely difficult' }],
   risk_flags: ['ODV glucuronidation is a MAJOR pathway — critical vulnerability in this microbiome', 'Highest GUS burden of either demo case', 'Consider Escitalopram or Sertraline instead'],
   potential_adjustments: 'Avoid unless other options fail. If used, therapeutic drug monitoring is mandatory.'
  }
  ],
  microbiome_context: {
  summary: "A moderately diverse microbiome notably enriched in β-glucuronidase producers. Ruminococcus gnavus (11.4%), Clostridium scindens (6.8%), and Bacteroides fragilis (7.6%) represent the highest GUS burden across both demo profiles. Note: has beta-galactosidase, NOT beta-glucuronidase, and is not a GUS contributor. Protective species are relatively preserved: Faecalibacterium prausnitzii (8.7%) and Eubacterium rectale (6.1%) contribute healthy anti-inflammatory butyrate production.",
  key_taxa_of_concern: [
   { taxon: 'Ruminococcus gnavus', concern: 'Strong GUS producer (Tier 1, 11.4%); also produces tryptamine — serotonin precursor modulation', drugs_affected: ['Venlafaxine', 'Sertraline', 'Fluoxetine'] },
   { taxon: 'Enterococcus faecalis', concern: 'Tyrosine decarboxylase (L-DOPA metabolism, 9.2%) — NOT a confirmed GUS producer (has beta-galactosidase, not beta-glucuronidase); no validated enzymatic degradations; tyramine production is the primary concern', drugs_affected: [] },
   { taxon: 'Clostridium scindens', concern: 'bile acid 7α-dehydroxylase (bai operon) (Tier 2, 6.8%); affects bile acid → serotonin axis via FXR/TGR5', drugs_affected: ['Mirtazapine', 'Venlafaxine'] }
  ]
  },
  limitations_and_caveats: [
  'Bacterial drug-metabolizing enzymes operate through different mechanisms than human CYP450 enzymes. Functional activity predictions are based on documented in vitro metabolism (Zimmermann 2019), not sequence homology.',
  'Microbiome composition is dynamic and changes with diet, antibiotics, and illness. These predictions reflect the profile at time of sampling.',
  'This analysis does not account for human pharmacogenomic variation (e.g., CYP2D6 poor/ultrarapid metabolizer status). Combining microbiome and pharmacogenomic data would substantially improve accuracy.',
  'Most bacterial drug metabolism in the gut occurs via non-CYP enzyme families (oxidoreductases, nitroreductases, hydrolases) rather than direct CYP450 orthologs.',
  'PTSD pharmacotherapy evidence is primarily from SSRI/SNRI trials that did not stratify by microbiome. Predictions are extrapolated from pharmacomicrobiomics data developed primarily in MDD populations.',
  'No prospective clinical trial has yet demonstrated that microbiome-guided psychiatric prescribing improves patient outcomes.'
  ],
  disclaimer: 'This is a research/educational tool. All predictions are probabilistic and based on emerging pharmacomicrobiomics evidence. This tool does not replace clinical judgment. Microbiome-drug interactions are an active area of research and many interactions remain unvalidated.'
 }
 },

 // ── DEMO-003 ────────────────────────────────────────────────────────────────
 patient3_gad_balanced: {
 status: 'success',

 taxa: [
  { name: 'Faecalibacterium prausnitzii', phylum: 'Firmicutes',  abundance: 14.8, gus: false, enzyme: null },
  { name: 'Eubacterium rectale',   phylum: 'Firmicutes',  abundance: 9.6, gus: false, enzyme: null },
  { name: 'Bifidobacterium longum',   phylum: 'Actinobacteria', abundance: 7.9, gus: false, enzyme: null },
  { name: 'Bifidobacterium adolescentis', phylum: 'Actinobacteria', abundance: 6.2, gus: false, enzyme: null },
  { name: 'Akkermansia muciniphila',  phylum: 'Verrucomicrobia', abundance: 5.4, gus: false, enzyme: null },
  { name: 'Lactobacillus rhamnosus',  phylum: 'Firmicutes',  abundance: 4.8, gus: false, enzyme: null },
  { name: 'Bacteroides thetaiotaomicron', phylum: 'Bacteroidetes', abundance: 4.6, gus: true, enzyme: null },
  { name: 'Lactobacillus reuteri',   phylum: 'Firmicutes',  abundance: 4.1, gus: false, enzyme: null },
  { name: 'Bacteroides fragilis',   phylum: 'Bacteroidetes', abundance: 3.8, gus: true, enzyme: 'Nitroreductases' },
  { name: 'Prevotella copri',    phylum: 'Bacteroidetes', abundance: 3.5, gus: false, enzyme: null },
  { name: 'Bacteroides vulgatus',   phylum: 'Bacteroidetes', abundance: 2.8, gus: true, enzyme: null },
  { name: 'Ruminococcus gnavus',   phylum: 'Firmicutes',  abundance: 2.4, gus: true, enzyme: null },
  { name: 'Escherichia coli',    phylum: 'Proteobacteria', abundance: 2.0, gus: true, enzyme: 'Oxidoreductases' },
  { name: 'Enterococcus faecalis',   phylum: 'Firmicutes',  abundance: 1.9, gus: false, enzyme: 'Tyr. decarboxylase' },
  { name: 'Eggerthella lenta',    phylum: 'Actinobacteria', abundance: 1.4, gus: false, enzyme: 'Cgr2 reductase' },
 ],

 drug_scores: [
  { name: 'Bupropion',  score: 0.08, components: { enz: 0.04, gus: 0.02 } },
  { name: 'Mirtazapine', score: 0.10, components: { enz: 0.06, gus: 0.02 } },
  { name: 'Escitalopram', score: 0.12, components: { enz: 0.08, gus: 0.02 } },
  { name: 'Sertraline', score: 0.14, components: { enz: 0.08, gus: 0.04 } },
  { name: 'Fluoxetine', score: 0.16, components: { enz: 0.10, gus: 0.03 } },
  { name: 'Venlafaxine', score: 0.21, components: { enz: 0.06, gus: 0.10 } },
 ],

 graph: {
  drug_nodes: [
  { id: 'bupropion', label: 'Bupropion', tier: 'Recommended' },
  { id: 'mirtazapine', label: 'Mirtazapine', tier: 'Recommended' },
  { id: 'escitalopram', label: 'Escitalopram', tier: 'Recommended' },
  { id: 'sertraline', label: 'Sertraline', tier: 'Recommended' },
  { id: 'fluoxetine', label: 'Fluoxetine', tier: 'Recommended' },
  { id: 'venlafaxine', label: 'Venlafaxine', tier: 'Recommended' },
  ],
  taxa_nodes: [
  { id: 'btheta', label: 'B. thetaiotaomicron', phylum: 'Bacteroidetes', abundance: 4.6 },
  { id: 'bfrag', label: 'B. fragilis',   phylum: 'Bacteroidetes', abundance: 3.8 },
  { id: 'bvulg', label: 'B. vulgatus',   phylum: 'Bacteroidetes', abundance: 2.8 },
  { id: 'rgnavus', label: 'R. gnavus',   phylum: 'Firmicutes',  abundance: 2.4 },
  { id: 'ecoli', label: 'E. coli',    phylum: 'Proteobacteria', abundance: 2.0 },

  { id: 'elenta', label: 'E. lenta',   phylum: 'Actinobacteria', abundance: 1.4 },
  ],
  edges: [
  { taxon:'btheta', drug:'escitalopram', type: 'enz', strength:0.20 },
  { taxon:'btheta', drug:'sertraline', type: 'enz', strength:0.20 },
  { taxon:'bfrag', drug:'fluoxetine', type: 'enz', strength:0.15 },
  { taxon:'bfrag', drug:'mirtazapine', type: 'enz', strength:0.15 },
  { taxon:'bvulg', drug:'mirtazapine', type: 'enz', strength:0.10 },
  { taxon:'rgnavus', drug:'venlafaxine', type:'gus', strength:0.15 },
  { taxon:'ecoli', drug:'fluoxetine', type: 'enz', strength:0.12 },
  { taxon:'ecoli', drug:'venlafaxine', type:'gus', strength:0.15 },

  { taxon:'elenta', drug:'fluoxetine', type: 'enz', strength:0.08 },
  ],
 },

 recommendation: {
  patient_id: 'DEMO-003',
  diagnosis: 'Generalized Anxiety Disorder',
  recommendation_summary: "This patient's microbiome is healthy and diverse, with high protective species and low abundance of drug-metabolizing bacteria. All six candidate antidepressants show minimal predicted microbiome interference. The microbiome is not a significant differentiating factor in drug selection for this patient — standard clinical criteria (efficacy evidence, side effect profile, patient preference) should drive the prescribing decision.",
  drug_recommendations: [
  {
   drug_name: 'Bupropion', tier: 'Recommended', metabolic_interference_score: 0.08, confidence: 'high',
   one_line_summary: 'Lowest interference score. CYP2B6-primary metabolism encounters essentially no bacterial enzyme activity in this microbiome.',
   detailed_explanation: "Bupropion is metabolized primarily by CYP2B6, for which no high-confidence bacterial enzymes exist in this patient's gut. The only potential predicted xenobiotic metabolism in the knowledge base is from Klebsiella pneumoniae (Tier 3), which is absent from this profile. However, note that Bupropion is not first-line for GAD — it lacks anxiolytic evidence and may worsen anxiety in some patients. The low interference score reflects metabolic safety, not clinical appropriateness for GAD.",
   key_interactions: [],
   risk_flags: ['Not FDA-indicated for GAD — may exacerbate anxiety; consider SSRIs/SNRIs first'],
   potential_adjustments: 'If used for comorbid MDD, standard dosing. Not recommended as primary GAD treatment.'
  },
  {
   drug_name: 'Mirtazapine', tier: 'Recommended', metabolic_interference_score: 0.10, confidence: 'high',
   one_line_summary: 'Multi-CYP redundancy provides excellent metabolic resilience; negligible enzymatic pressure in this microbiome.',
   detailed_explanation: "Mirtazapine's parallel CYP1A2, CYP3A4, and CYP2D6 pathways face only trace enzymatic activity from B. fragilis (3.8%, nitroreductase Tier 2) and B. vulgatus (2.8%, CYP3A4 Tier 3). The abundance levels are too low for clinically meaningful interference. Mirtazapine's H1 antagonism and 5-HT2C antagonism may benefit GAD patients with insomnia or appetite loss.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'B. fragilis nitroreductase activity (non-CYP, Zimmermann 2019; Tier 2, 3.8%) — clinically insignificant at this abundance', taxa_involved: ['Bacteroides fragilis'], evidence_tier: 2, clinical_implication: 'No dose adjustment predicted' }],
   risk_flags: ['Sedation and weight gain — discuss with patient'],
   potential_adjustments: 'Standard dosing 15–45 mg. Consider for GAD with prominent insomnia.'
  },
  {
   drug_name: 'Escitalopram', tier: 'Recommended', metabolic_interference_score: 0.12, confidence: 'high',
   one_line_summary: 'First-line GAD treatment with minimal microbiome interference. CYP2C19 pathway faces only low-abundance enzyme activity.',
   detailed_explanation: "Escitalopram is first-line for GAD with strong evidence across multiple RCTs. The CYP2C19 primary pathway faces Tier 2 enzyme activity from B. thetaiotaomicron (4.6%), but at this low abundance the predicted interference is clinically negligible. Glucuronidation is a minor pathway, and the modest β-glucuronidase burden in this healthy microbiome poses no meaningful risk.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'B. thetaiotaomicron drug-metabolizing enzyme activity (Tier 2, 4.6%) — minimal predicted impact', taxa_involved: ['Bacteroides thetaiotaomicron'], evidence_tier: 2, clinical_implication: 'No dose adjustment predicted' }],
   risk_flags: ['Standard SSRI monitoring for initial activation anxiety'],
   potential_adjustments: 'Standard dosing 10–20 mg. Excellent first-line choice for this patient.'
  },
  {
   drug_name: 'Sertraline', tier: 'Recommended', metabolic_interference_score: 0.14, confidence: 'high',
   one_line_summary: 'Strong GAD evidence base with minimal microbiome interference. CYP2C19 burden negligible at these abundances.',
   detailed_explanation: "Sertraline has solid evidence for GAD, with CYP2C19 as primary metabolizing enzyme. B. thetaiotaomicron (4.6%, Tier 2) and E. coli (2.0%, Tier 2) carry drug-metabolizing enzyme activitys, but their combined abundance is too low for meaningful interference. UGT1A1 secondary glucuronidation faces minimal GUS burden. Desmethylsertraline active metabolite provides additional efficacy buffer.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'B. thetaiotaomicron + E. coli combined drug-metabolizing enzyme activity at low abundance', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Clinically insignificant' }],
   risk_flags: ['Standard SSRI monitoring'],
   potential_adjustments: 'Standard dosing 50–200 mg.'
  },
  {
   drug_name: 'Fluoxetine', tier: 'Recommended', metabolic_interference_score: 0.16, confidence: 'high',
   one_line_summary: 'CYP2D6 pathway faces only trace enzyme activity. Norfluoxetine ultra-long half-life provides additional buffer.',
   detailed_explanation: "Fluoxetine's primary CYP2D6 pathway faces minimal competition from E. coli oxidoreductases (2.0%, Tier 1; non-CYP, Zimmermann 2019) and B. fragilis nitroreductase (3.8%, Tier 2) — all at very low abundances. Note: E. faecalis has tyrosine decarboxylase (acts on L-DOPA, not SSRIs) and is not a relevant drug-metabolizing taxon here. The active metabolite norfluoxetine (half-life 4–16 days) provides a massive pharmacological buffer that would compensate even if there were moderate interference.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'E. coli oxidoreductase activity (non-CYP, Zimmermann 2019; Tier 1, 2.0%) — low abundance limits clinical significance', taxa_involved: ['Escherichia coli'], evidence_tier: 1, clinical_implication: 'No meaningful interference predicted' }],
   risk_flags: ['Strong CYP2D6 inhibitor — monitor co-prescribed substrates', 'Long washout period due to norfluoxetine half-life'],
   potential_adjustments: 'Standard dosing 20–60 mg.'
  },
  {
   drug_name: 'Venlafaxine', tier: 'Recommended', metabolic_interference_score: 0.21, confidence: 'moderate',
   one_line_summary: 'ODV glucuronidation creates inherent vulnerability to β-glucuronidase, but the GUS burden in this microbiome is low enough to stay in the Recommended range.',
   detailed_explanation: "Venlafaxine's active metabolite ODV is eliminated primarily via glucuronidation, making it structurally vulnerable to β-glucuronidase. However, this patient's GUS-producing taxa are all at low abundance: R. gnavus (2.4%), E. coli (2.0%), B. fragilis (3.8%). Note: E. faecalis has beta-galactosidase, NOT beta-glucuronidase, and is excluded from GUS burden calculations. The combined GUS burden is well below the threshold for clinically meaningful enterohepatic cycling. Venlafaxine SNRI mechanism has good evidence for GAD.",
   key_interactions: [{ interaction_type: 'enterohepatic_reactivation', description: 'Low-abundance GUS producers create minimal reactivation risk for ODV-glucuronide', taxa_involved: ['Ruminococcus gnavus', 'Escherichia coli'], evidence_tier: 1, clinical_implication: 'Low risk — standard monitoring sufficient' }],
   risk_flags: ['ODV glucuronidation remains an inherent vulnerability — monitor if microbiome changes (e.g., antibiotics)'],
   potential_adjustments: 'Standard dosing 75–225 mg. Good first-line option for GAD.'
  }
  ],
  microbiome_context: {
  summary: "A healthy, diverse microbiome dominated by protective species. Faecalibacterium prausnitzii (14.8%) and Eubacterium rectale (9.6%) provide robust butyrate production supporting gut barrier integrity. Bifidobacterium species (14.1% combined) contribute GABA production and anti-inflammatory signaling. Drug-metabolizing taxa are present but at low abundances insufficient for clinically meaningful interference. This microbiome profile does not meaningfully constrain drug selection.",
  key_taxa_of_concern: [
   { taxon: 'Faecalibacterium prausnitzii', concern: 'Protective — high abundance (14.8%) indicates healthy butyrate production and gut barrier integrity', drugs_affected: [] },
   { taxon: 'Bacteroides thetaiotaomicron', concern: 'drug-metabolizing enzyme activity (Tier 2, 4.6%) — present but at low abundance', drugs_affected: ['Escitalopram', 'Sertraline'] },
   { taxon: 'Bacteroides fragilis', concern: 'Nitroreductase activity (non-CYP, Zimmermann 2019) + β-GUS (Tier 2, 3.8%) — present but at low abundance', drugs_affected: ['Fluoxetine'] }
  ]
  },
  limitations_and_caveats: [
  'Bacterial drug-metabolizing enzymes operate through different mechanisms than human CYP450 enzymes. Functional activity predictions are based on documented in vitro metabolism (Zimmermann 2019), not sequence homology.',
  'Microbiome composition is dynamic and changes with diet, antibiotics, and illness. These predictions reflect the profile at time of sampling.',
  'This analysis does not account for human pharmacogenomic variation (e.g., CYP2D6 poor/ultrarapid metabolizer status). Combining microbiome and pharmacogenomic data would substantially improve accuracy.',
  'Most bacterial drug metabolism in the gut occurs via non-CYP enzyme families (oxidoreductases, nitroreductases, hydrolases) rather than direct CYP450 orthologs.',
  'Low interference scores do not imply efficacy. Drug selection should still prioritize clinical evidence for the diagnosis.',
  'No prospective clinical trial has yet demonstrated that microbiome-guided psychiatric prescribing improves patient outcomes.'
  ],
  disclaimer: 'This is a research/educational tool. All predictions are probabilistic and based on emerging pharmacomicrobiomics evidence. This tool does not replace clinical judgment. Microbiome-drug interactions are an active area of research and many interactions remain unvalidated.'
 }
 },

 // ── DEMO-004 ────────────────────────────────────────────────────────────────
 patient4_mdd_ibs_firmicutes: {
 status: 'success',

 taxa: [
  { name: 'Clostridium scindens',   phylum: 'Firmicutes',  abundance: 13.2, gus: true, enzyme: '7α-dehydroxylase' },
  { name: 'Ruminococcus gnavus',    phylum: 'Firmicutes',  abundance: 9.1, gus: true, enzyme: null },
  { name: 'Clostridium bolteae',    phylum: 'Firmicutes',  abundance: 8.7, gus: true, enzyme: null },
  { name: 'Bacteroides fragilis',   phylum: 'Bacteroidetes', abundance: 7.8, gus: true, enzyme: 'Nitroreductases' },
  { name: 'Enterococcus faecalis',   phylum: 'Firmicutes',  abundance: 6.2, gus: false, enzyme: 'Tyr. decarboxylase' },
  { name: 'Bacteroides thetaiotaomicron', phylum: 'Bacteroidetes', abundance: 5.4, gus: true, enzyme: null },
  { name: 'Escherichia coli',    phylum: 'Proteobacteria', abundance: 4.6, gus: true, enzyme: 'Oxidoreductases' },
  { name: 'Bacteroides vulgatus',   phylum: 'Bacteroidetes', abundance: 4.3, gus: true, enzyme: null },
  { name: 'Eggerthella lenta',    phylum: 'Actinobacteria', abundance: 3.9, gus: false, enzyme: 'Cgr2 reductase' },
  { name: 'Faecalibacterium prausnitzii', phylum: 'Firmicutes',  abundance: 3.8, gus: false, enzyme: null },
  { name: 'Klebsiella pneumoniae',   phylum: 'Proteobacteria', abundance: 3.2, gus: true, enzyme: null },
  { name: 'Eubacterium rectale',    phylum: 'Firmicutes',  abundance: 2.6, gus: false, enzyme: null },
  { name: 'Pseudomonas aeruginosa',   phylum: 'Proteobacteria', abundance: 2.1, gus: false, enzyme: 'Monooxygenases' },
  { name: 'Bifidobacterium longum',   phylum: 'Actinobacteria', abundance: 1.8, gus: false, enzyme: null },
  { name: 'Akkermansia muciniphila',   phylum: 'Verrucomicrobia', abundance: 1.4, gus: false, enzyme: null },
 ],

 drug_scores: [
  { name: 'Bupropion',  score: 0.22, components: { enz: 0.12, gus: 0.06 } },
  { name: 'Escitalopram', score: 0.36, components: { enz: 0.26, gus: 0.05 } },
  { name: 'Sertraline', score: 0.41, components: { enz: 0.22, gus: 0.14 } },
  { name: 'Mirtazapine', score: 0.52, components: { enz: 0.38, gus: 0.08 } },
  { name: 'Fluoxetine', score: 0.58, components: { enz: 0.40, gus: 0.10 } },
  { name: 'Venlafaxine', score: 0.79, components: { enz: 0.20, gus: 0.46 } },
 ],

 graph: {
  drug_nodes: [
  { id: 'bupropion', label: 'Bupropion', tier: 'Recommended' },
  { id: 'escitalopram', label: 'Escitalopram', tier: 'Consider' },
  { id: 'sertraline', label: 'Sertraline', tier: 'Consider' },
  { id: 'mirtazapine', label: 'Mirtazapine', tier: 'Consider' },
  { id: 'fluoxetine', label: 'Fluoxetine', tier: 'Consider' },
  { id: 'venlafaxine', label: 'Venlafaxine', tier: 'Caution' },
  ],
  taxa_nodes: [
  { id: 'cscindens', label: 'C. scindens',   phylum: 'Firmicutes',  abundance: 13.2 },
  { id: 'rgnavus', label: 'R. gnavus',    phylum: 'Firmicutes',  abundance: 9.1 },
  { id: 'cbolteae', label: 'C. bolteae',    phylum: 'Firmicutes',  abundance: 8.7 },
  { id: 'bfrag',  label: 'B. fragilis',   phylum: 'Bacteroidetes', abundance: 7.8 },

  { id: 'btheta', label: 'B. thetaiotaomicron', phylum: 'Bacteroidetes', abundance: 5.4 },
  { id: 'ecoli',  label: 'E. coli',    phylum: 'Proteobacteria', abundance: 4.6 },
  { id: 'bvulg',  label: 'B. vulgatus',   phylum: 'Bacteroidetes', abundance: 4.3 },
  { id: 'elenta', label: 'E. lenta',    phylum: 'Actinobacteria', abundance: 3.9 },
  { id: 'kpneu',  label: 'K. pneumoniae',   phylum: 'Proteobacteria', abundance: 3.2 },
  ],
  edges: [
  // C. scindens — 7α-dehydroxylase + GUS
  { taxon:'cscindens', drug:'mirtazapine', type: 'enz', strength:0.72 },
  { taxon:'cscindens', drug:'venlafaxine', type: 'enz', strength:0.55 },
  { taxon:'cscindens', drug:'venlafaxine', type:'gus', strength:0.70 },
  { taxon:'cscindens', drug:'sertraline', type:'gus', strength:0.45 },
  // R. gnavus — GUS
  { taxon:'rgnavus', drug:'venlafaxine', type:'gus', strength:0.72 },
  { taxon:'rgnavus', drug:'sertraline', type:'gus', strength:0.50 },
  { taxon:'rgnavus', drug:'fluoxetine', type:'gus', strength:0.30 },
  // C. bolteae — enzyme + GUS
  { taxon:'cbolteae', drug:'fluoxetine', type: 'enz', strength:0.35 },
  { taxon:'cbolteae', drug:'mirtazapine', type: 'enz', strength:0.35 },
  { taxon:'cbolteae', drug:'venlafaxine', type:'gus', strength:0.42 },
  // B. fragilis — enzyme + GUS
  { taxon:'bfrag', drug:'fluoxetine', type: 'enz', strength:0.40 },
  { taxon:'bfrag', drug:'mirtazapine', type: 'enz', strength:0.40 },
  { taxon:'bfrag', drug:'venlafaxine', type:'gus', strength:0.55 },
  { taxon:'bfrag', drug:'sertraline', type:'gus', strength:0.38 },

  // B. thetaiotaomicron — CYP2C19
  { taxon:'btheta', drug:'escitalopram', type: 'enz', strength:0.35 },
  { taxon:'btheta', drug:'sertraline', type: 'enz', strength:0.35 },
  // E. coli — CYP2D6/CYP2C19 + GUS
  { taxon:'ecoli', drug:'fluoxetine', type: 'enz', strength:0.30 },
  { taxon:'ecoli', drug:'escitalopram', type: 'enz', strength:0.25 },
  { taxon:'ecoli', drug:'venlafaxine', type:'gus', strength:0.35 },
  // B. vulgatus — CYP3A4
  { taxon:'bvulg', drug:'mirtazapine', type: 'enz', strength:0.22 },
  // E. lenta — CYP2D6
  { taxon:'elenta', drug:'fluoxetine', type: 'enz', strength:0.28 },
  { taxon:'elenta', drug:'mirtazapine', type: 'enz', strength:0.28 },
  // K. pneumoniae — CYP3A4
  { taxon:'kpneu', drug:'mirtazapine', type: 'enz', strength:0.18 },
  { taxon:'kpneu', drug:'bupropion', type: 'enz', strength:0.12 },
  ],
 },

 recommendation: {
  patient_id: 'DEMO-004',
  diagnosis: 'Major Depressive Disorder',
  recommendation_summary: "This patient's Firmicutes-dominant dysbiosis creates a distinctive interference pattern: heavy bile acid 7α-dehydroxylase pressure from Clostridium scindens (13.2%) combined with broad CYP2D6 enzyme activity and a substantial β-glucuronidase burden. Notably, Mirtazapine — the top-ranked drug in DEMO-001 — drops to fourth place here because its CYP3A4 primary pathway is directly targeted. Bupropion is the clear winner, as CYP2B6 has essentially no high-confidence bacterial enzymes in this or any documented microbiome.",
  drug_recommendations: [
  {
   drug_name: 'Bupropion', tier: 'Recommended', metabolic_interference_score: 0.22, confidence: 'high',
   one_line_summary: "CYP2B6-primary metabolism sidesteps both the CYP3A4 and CYP2D6 enzymatic pressure that dominates this microbiome.",
   detailed_explanation: "Bupropion is metabolized primarily by CYP2B6 to hydroxybupropion, an active equipotent metabolite. CYP2B6 has no confirmed bacterial enzymes in the current knowledge base. The only predicted predicted xenobiotic metabolism is from Klebsiella pneumoniae (3.2%, Tier 3) — low abundance and low confidence. Hydroxybupropion does undergo glucuronidation, and the GUS burden in this microbiome is moderate, but the active metabolite buffer is substantial enough that minor enterohepatic cycling would not meaningfully alter efficacy.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'K. pneumoniae predicted xenobiotic metabolism (Tier 3, 3.2%) — predicted only, low confidence', taxa_involved: ['Klebsiella pneumoniae'], evidence_tier: 3, clinical_implication: 'Predicted to be clinically insignificant' }],
   risk_flags: ['Strong CYP2D6 inhibitor — significant DDI potential with co-prescribed CYP2D6 substrates'],
   potential_adjustments: 'Standard dosing 150–300 mg XL. First-line choice given this microbiome profile.'
  },
  {
   drug_name: 'Escitalopram', tier: 'Consider', metabolic_interference_score: 0.36, confidence: 'moderate',
   one_line_summary: "CYP2C19 primary pathway faces moderate enzymatic burden; CYP3A4 secondary pathway is heavily targeted by C. scindens.",
   detailed_explanation: "Escitalopram uses CYP2C19 (primary) and CYP3A4 (secondary). B. thetaiotaomicron (5.4%, Tier 2) and E. coli (4.6%, Tier 2) carry drug-metabolizing enzyme activitys. More significantly, the CYP3A4 backup pathway faces heavy enzymatic pressure from C. scindens (13.2%, Tier 2). This dual-pathway interference elevates the score above the Recommended threshold. However, escitalopram's clean PK profile and low glucuronidation exposure limit the total risk.",
   key_interactions: [
   { interaction_type: 'enzymatic_degradation', description: 'B. thetaiotaomicron (5.4%) and E. coli (4.6%) carry drug-metabolizing enzyme activitys affecting the primary pathway', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Moderate predicted reduction in primary pathway capacity' },
   { interaction_type: 'enzymatic_degradation', description: 'C. scindens bile acid 7α-dehydroxylase activity (13.2%, Tier 2) compromises the secondary metabolic pathway', taxa_involved: ['Clostridium scindens'], evidence_tier: 2, clinical_implication: 'Reduced metabolic redundancy — fewer backup pathways available' }
   ],
   risk_flags: ['Both primary (CYP2C19) and secondary (CYP3A4) pathways face enzymatic pressure — reduced metabolic redundancy'],
   potential_adjustments: 'Consider starting at 10 mg and monitoring closely. May need dose adjustment based on response at 4–6 weeks.'
  },
  {
   drug_name: 'Sertraline', tier: 'Consider', metabolic_interference_score: 0.41, confidence: 'moderate',
   one_line_summary: "CYP2C19 enzymatic burden combined with moderate GUS-mediated reactivation risk from the secondary UGT1A1 pathway.",
   detailed_explanation: "Sertraline's CYP2C19 primary pathway faces interference from B. thetaiotaomicron (5.4%) and E. coli (4.6%). Additionally, sertraline's secondary UGT1A1 glucuronidation pathway is exposed to a substantial GUS burden from C. scindens (13.2%), R. gnavus (9.1%), B. fragilis (7.8%), and others. The desmethylsertraline active metabolite provides some pharmacological buffer.",
   key_interactions: [
   { interaction_type: 'enzymatic_degradation', description: 'Combined drug-metabolizing enzyme activity from B. thetaiotaomicron and E. coli', taxa_involved: ['Bacteroides thetaiotaomicron', 'Escherichia coli'], evidence_tier: 2, clinical_implication: 'Modest reduction in primary pathway bioavailability' },
   { interaction_type: 'enterohepatic_reactivation', description: 'Secondary UGT1A1 glucuronidation faces moderate GUS burden from multiple taxa', taxa_involved: ['Clostridium scindens', 'Ruminococcus gnavus', 'Bacteroides fragilis'], evidence_tier: 1, clinical_implication: 'Minor plasma level variability from enterohepatic cycling' }
   ],
   risk_flags: ['Monitor for subtherapeutic response at standard doses'],
   potential_adjustments: 'May warrant upper-range dosing (150–200 mg) if initial response is suboptimal.'
  },
  {
   drug_name: 'Mirtazapine', tier: 'Consider', metabolic_interference_score: 0.52, confidence: 'moderate',
   one_line_summary: "CYP3A4 primary pathway is directly targeted by C. scindens at 13.2% — a stark contrast to DEMO-001 where Mirtazapine ranked first.",
   detailed_explanation: "Mirtazapine relies on CYP1A2, CYP3A4, and CYP2D6. In this microbiome, C. scindens (13.2%) carries a well-documented bile acid 7α-dehydroxylase (bai operon) (Tier 2), B. fragilis (7.8%) adds nitroreductase activity (non-CYP, Zimmermann 2019), C. bolteae (8.7%) contributes drug-metabolizing enzyme activity, and E. lenta (3.9%) has Cgr2 reductase. Note: E. faecalis (6.2%) has tyrosine decarboxylase (acts on L-DOPA, not SSRIs/SNRIs/NDRIs) and no validated enzymatic degradations. Two of Mirtazapine's three metabolic pathways are under significant pressure, eroding the multi-CYP redundancy that made it the top choice for DEMO-001.",
   key_interactions: [
   { interaction_type: 'enzymatic_degradation', description: 'C. scindens bile acid 7α-dehydroxylase (bai operon) (Tier 2, 13.2%) — highest single-taxon enzymatic pressure', taxa_involved: ['Clostridium scindens'], evidence_tier: 2, clinical_implication: 'Significant predicted reduction in CYP3A4-mediated clearance' },
   { interaction_type: 'enzymatic_degradation', description: 'Combined drug-metabolizing enzyme activity from C. bolteae (8.7%), B. fragilis nitroreductase (7.8%), E. lenta Cgr2 reductase (3.9%)', taxa_involved: ['Clostridium bolteae', 'Bacteroides fragilis', 'Eggerthella lenta'], evidence_tier: 2, clinical_implication: 'CYP2D6 backup pathway also compromised — reduced metabolic redundancy' }
   ],
   risk_flags: ['CYP3A4 and CYP2D6 pathways both under pressure — only CYP1A2 remains unaffected', 'Compare: Mirtazapine scored 0.21 in DEMO-001 vs 0.52 here — same drug, different microbiome'],
   potential_adjustments: 'If used, monitor closely for altered plasma levels. Consider plasma level monitoring at 4 weeks.'
  },
  {
   drug_name: 'Fluoxetine', tier: 'Consider', metabolic_interference_score: 0.58, confidence: 'moderate',
   one_line_summary: "CYP2D6 primary pathway faces broad enzymatic pressure from multiple taxa; norfluoxetine buffer prevents escalation to Caution.",
   detailed_explanation: "Fluoxetine's primary CYP2D6 pathway is targeted by E. coli oxidoreductases (4.6%, Tier 1; non-CYP, Zimmermann 2019), C. bolteae (8.7%, Tier 3), B. fragilis nitroreductase (7.8%, Tier 2; non-CYP, Zimmermann 2019), E. lenta Cgr2 reductase (3.9%, Tier 1), and P. aeruginosa (2.1%, Tier 2). Note: E. faecalis (6.2%) has tyrosine decarboxylase (acts on L-DOPA, not SSRIs) and is excluded from drug-metabolizing burden. The combined enzymatic degradation burden exceeds 27% total abundance. However, norfluoxetine's ultra-long half-life (4–16 days) provides a substantial pharmacological buffer that prevents the score from reaching Caution tier.",
   key_interactions: [{ interaction_type: 'enzymatic_degradation', description: 'Broad drug-metabolizing enzyme pressure from 5 taxa totaling >27% abundance', taxa_involved: ['Escherichia coli', 'Clostridium bolteae', 'Bacteroides fragilis', 'Eggerthella lenta', 'Pseudomonas aeruginosa'], evidence_tier: 1, clinical_implication: 'Significant predicted bioavailability reduction; norfluoxetine buffer partially compensates' }],
   risk_flags: ['Drug-metabolizing enzyme burden from >27% combined abundance — highest enzymatic degradation pressure across all demo cases', 'Norfluoxetine buffer prevents Caution tier but close to threshold'],
   potential_adjustments: 'Higher-end dosing likely needed (40–60 mg). Plasma level monitoring recommended at 6 weeks.'
  },
  {
   drug_name: 'Venlafaxine', tier: 'Caution', metabolic_interference_score: 0.79, confidence: 'high',
   one_line_summary: "ODV glucuronidation faces the second-highest GUS burden across all demo profiles; CYP2D6 parent-compound metabolism also under heavy pressure.",
   detailed_explanation: "Venlafaxine faces a dual-mechanism assault in this microbiome. The CYP2D6 pathway for parent compound metabolism is targeted by multiple taxa (see Fluoxetine analysis). More critically, the active metabolite ODV is eliminated primarily via glucuronidation, and this patient carries a massive β-glucuronidase burden: C. scindens (13.2%), R. gnavus (9.1%), C. bolteae (8.7%), B. fragilis (7.8%), and others produce combined GUS activity exceeding 44% total abundance. Note: E. faecalis (6.2%) has beta-galactosidase, NOT beta-glucuronidase, and is excluded from GUS burden calculations. Enterohepatic cycling of ODV-glucuronide would make plasma levels highly erratic.",
   key_interactions: [{ interaction_type: 'enterohepatic_reactivation', description: 'Five high-abundance GUS producers (combined >44%) deconjugate ODV-glucuronide, driving severe enterohepatic cycling', taxa_involved: ['Clostridium scindens', 'Ruminococcus gnavus', 'Clostridium bolteae', 'Bacteroides fragilis', 'Escherichia coli'], evidence_tier: 1, clinical_implication: 'Highly unpredictable ODV plasma levels — dose titration extremely difficult' }],
   risk_flags: ['ODV glucuronidation is a MAJOR elimination pathway — critical vulnerability', 'Combined GUS-producing taxa >50% abundance', 'Consider Bupropion or Escitalopram instead'],
   potential_adjustments: 'Avoid unless other options fail. If used, therapeutic drug monitoring is mandatory.'
  }
  ],
  microbiome_context: {
  summary: "A Firmicutes-dominant dysbiosis with IBS-characteristic Clostridium overgrowth. Clostridium scindens (13.2%) provides the dominant enzymatic threat — its 7-alpha-dehydroxylase converts primary bile acids to secondary bile acids and may affect drug metabolism through bile acid-mediated pathway alterations. Combined with drug-metabolizing enzyme activity from C. bolteae (8.7%) and B. fragilis nitroreductase (7.8%; non-CYP, Zimmermann 2019), multiple metabolic pathways are under pressure. Note: E. faecalis (6.2%) has tyrosine decarboxylase (L-DOPA metabolism), not enzymatic degradations. Protective species are depleted: F. prausnitzii (3.8%) and E. rectale (2.6%) suggest compromised gut barrier integrity.",
  key_taxa_of_concern: [
   { taxon: 'Clostridium scindens', concern: 'bile acid 7α-dehydroxylase (bai operon) (Tier 2, 13.2%) — highest single-taxon enzymatic pressure across all demos; also a confirmed GUS producer', drugs_affected: ['Mirtazapine', 'Venlafaxine', 'Sertraline'] },
   { taxon: 'Clostridium bolteae', concern: 'drug-metabolizing enzyme activity (Tier 3, 8.7%) + moderate GUS — compounds the CYP2D6 burden', drugs_affected: ['Fluoxetine', 'Mirtazapine', 'Venlafaxine'] },
   { taxon: 'Ruminococcus gnavus', concern: 'Strong GUS producer (Tier 1, 9.1%); tryptamine production may modulate serotonin precursor availability', drugs_affected: ['Venlafaxine', 'Sertraline', 'Fluoxetine'] },
   { taxon: 'Faecalibacterium prausnitzii', concern: 'Depleted (3.8%) — reduced butyrate production indicates compromised gut barrier and increased permeability', drugs_affected: [] }
  ]
  },
  limitations_and_caveats: [
  'Bacterial drug-metabolizing enzymes operate through different mechanisms than human CYP450 enzymes. Functional activity predictions are based on documented in vitro metabolism (Zimmermann 2019), not sequence homology.',
  'Microbiome composition is dynamic and changes with diet, antibiotics, and illness. These predictions reflect the profile at time of sampling.',
  'This analysis does not account for human pharmacogenomic variation (e.g., CYP2D6 poor/ultrarapid metabolizer status). Combining microbiome and pharmacogenomic data would substantially improve accuracy.',
  'Most bacterial drug metabolism in the gut occurs via non-CYP enzyme families (oxidoreductases, nitroreductases, hydrolases) rather than direct CYP450 orthologs.',
  'IBS comorbidity may independently affect drug absorption via altered gut motility and pH — these pharmacokinetic factors are not modeled.',
  'No prospective clinical trial has yet demonstrated that microbiome-guided psychiatric prescribing improves patient outcomes.'
  ],
  disclaimer: 'This is a research/educational tool. All predictions are probabilistic and based on emerging pharmacomicrobiomics evidence. This tool does not replace clinical judgment. Microbiome-drug interactions are an active area of research and many interactions remain unvalidated.'
 }
 }
};
