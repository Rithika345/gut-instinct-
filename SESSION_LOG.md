# Session Log — 2026-05-22 (MedX Hackathon)

Branch: `feature/alphafold-structural`
Author: Rithika + Claude (Opus 4.7)
Window: 8:08 AM – snapshot point at ~10:35 AM (judging at 4:00 PM)

This log captures everything done in this session: what was changed, why, with
citations for every new scientific claim, plus what still needs to happen
before the demo.

---

## 1. Headline changes

1. **Knowledge-base corrections** to align with the revised fact-checked plan
   (Aparna's audit). The pipeline no longer claims native CYP450 orthologs for
   E. coli, B. fragilis, E. faecalis, or E. lenta. E. faecalis is no longer
   classified as a drug-reactivating β-glucuronidase producer. The "CYP
   ortholog degradation" mechanism is renamed to **Enzymatic degradation** in
   user-facing labels; the internal JSON field name `ortholog_degradation_risk`
   is retained for backwards compatibility, and Agent 3's new prompt also
   accepts `enzymatic_degradation_risk`.

2. **Tightened evidence tier definitions** in Agent 2 / Agent 3. Tier 1 is now
   reserved for direct in vitro / in vivo experimental evidence of the
   *specific* drug-microbe pair. Most existing claims are now Tier 2 (enzyme
   present + drug class is substrate, but specific pair not directly tested).

3. **New `backend/structural/` module** that runs TM-align on
   human/bacterial enzyme pairs. Three β-glucuronidase comparisons are
   pre-computed and committed. The work plan's other-narrative comparisons
   (human GUSB vs bacterial, and the E. coli-AlphaFold sanity check) were dropped
   from the manifest per the revised plan but their cached PDBs are still
   on disk (gitignored).

4. **Static structural bundle** at `frontend/structures.js` (1.6 MB) that
   inlines the three superposed PDB files plus the TM-align numbers, so the
   forthcoming Structural Evidence tab will work whether the backend is
   reachable or you opened `index.html` directly.

5. **Infrastructure fixes:**
   - `.env.example` had an unresolved git merge conflict between an
     `ANTHROPIC_API_KEY` branch and a `GEMINI_API_KEY` branch — resolved to
     `ANTHROPIC_API_KEY` only (the orchestrator only uses Anthropic).
   - Orchestrator's `_MODEL_NAME` bumped from `claude-sonnet-4-20250514`
     (~12 months old, deprecation risk) to `claude-sonnet-4-6` (current).
   - Orchestrator's `max_tokens` bumped from 8192 → 16384. Agent 2 under the
     revised KB emits enough structured output to hit the 8192 limit
     mid-stream; this was masquerading as a JSON parse failure.

---

## 2. Scientific decisions, with citations

### 2.1 Why we removed "CYP ortholog" claims for E. coli and B. fragilis

- **E. coli:** Most E. coli K-12 strains do not carry endogenous CYP450 genes.
  The drug-metabolizing activity that *is* documented runs through
  oxidoreductases, nitroreductases, azoreductases, and acetyltransferases
  (Zimmermann et al., *Nature* 570:462, 2019; PMID 31158845). The
  literature support for "E. coli CYP2D6-like reductase, Tier 1" in the
  earlier KB was based on confusion between recombinant CYP expression in
  E. coli (a lab technique) and endogenous E. coli CYP activity (which is
  not established).

- **B. fragilis:** No validated CYP2D6-like or CYP3A4-like ortholog in
  B. fragilis at clinically relevant identity. The earlier "~45% identity"
  number was unsourceable and has been dropped.

### 2.2 Why E. faecalis was removed from the GUS producer list

UniProt's annotated extracellular glycosidase activity for E. faecalis is
β-galactosidase, not β-glucuronidase. The earlier "Tier 1 GUS producer"
classification was a misattribution. E. faecalis's clinically relevant
metabolic activity is tyrosine decarboxylase (Maini Rekdal et al.,
*Science* 364:eaau6323, 2019; van Kessel et al., *Nat Commun* 10:310,
2019), which converts L-DOPA to dopamine in the gut. Tyrosine
decarboxylase does not act on SSRI / SNRI / NDRI substrates, so E.
faecalis's contribution to our six-antidepressant scoring is now near zero.

### 2.3 Why R. gnavus gets a 0.5× efficiency multiplier

Biernat KA, Pellock SJ, Bhatt AP, et al. "Structure, function, and
inhibition of drug reactivating human gut microbial β-glucuronidases."
*Sci Rep* 9:825 (2019). PMID 30696850. DOI 10.1038/s41598-018-36069-w.
Key finding: R. gnavus, L. rhamnosus, and F. prausnitzii all carry the L1
active-site loop architecture (same as E. coli GUS), but the new L1 GUS
enzymes process small drug-glucuronide substrates LESS EFFICIENTLY than
E. coli GUS. We encode this as a 0.5× efficiency multiplier on the
R. gnavus contribution to the enterohepatic reactivation risk.

### 2.4 E. lenta is Cgr2, not "CYP2D6-like"

Haiser HJ, Gootenberg DB, Chatman K, et al. "Predicting and manipulating
cardiac drug inactivation by the human gut bacterium Eggerthella lenta."
*Science* 341:295 (2013). PMID 23869020. The enzyme is **cardiac glycoside
reductase Cgr2** — a flavin-dependent reductase, NOT a CYP450. The
previous "CYP2D6-like reductase, Tier 1" label conflated mechanism
families. The renamed label in `formatter.py` is now `Cgr2`. UniProt
accession for cgr2 is **C8WLM1**; AlphaFold prediction available
(pLDDT 86.9) and downloaded into the cache for future use.

### 2.5 PDB structures used in the comparison

| Code | Organism | Source | Citation |
|---|---|---|---|
| **3LPF** | E. coli β-GUS | RCSB crystal (apo + inhibitor) | Wallace BD et al., *Science* 330:831 (2010). PMID 21051639. Resolution 2.26 Å. Chains A/B both reference UniProt **P05804**. |
| **5Z1A** | B. fragilis β-GUS | RCSB crystal (with uronic isofagomine) | Dashnyam P et al., 2017 deposit (publication pending). Chain A references UniProt **Q5LIC7**. We chose 5Z1A over the plan's first-choice 3CMG because 5Z1A's PDB header explicitly identifies the protein as β-glucuronidase, whereas 3CMG is misannotated in the PDB as "putative β-galactosidase" (both reference the same UniProt entry; the underlying protein is the same). |
| **Q6W7J7** | R. gnavus β-GUS | AlphaFold v6, pLDDT 96.1 | UniProt: *Mediterraneibacter gnavus* (= R. gnavus). |
| **C8WLM1** | E. lenta Cgr2 | AlphaFold v6, pLDDT 86.9 | Downloaded but not yet used in a TM-align pair (future digoxin / risperidone work). |

Also cached on disk but excluded from the demo manifest per the revised
plan: 2F9Q (human CYP2D6), 4GQS (human CYP2C19), 1TQN (human CYP3A4),
1BHG (human GUSB), P05804 AlphaFold, P08236 (human GUSB AlphaFold).

### 2.6 TM-score interpretation thresholds

We retained 4-tier verdicts: > 0.7 high-confidence match, 0.5 – 0.7 same
fold, 0.3 – 0.5 partial, < 0.3 no match. Only the 0.5 threshold is
literature-supported (Zhang & Skolnick, *Nucl Acids Res* 33:2302, 2005,
doi:10.1093/nar/gki524). The 0.7 and 0.3 thresholds are our editorial
heuristics; if a judge cites Zhang & Skolnick the appropriate answer is
"we are aware only the 0.5 same-fold threshold is formally supported;
0.7 / 0.3 are visual hierarchy choices."

### 2.7 Score modulation multipliers

For Tier 2 ortholog claims modulated by TM-score: TM > 0.7 → 1.2×, 0.5
– 0.7 → 1.0×, 0.3 – 0.5 → 0.7×, < 0.3 → 0.4×. These multipliers are
our heuristics, not from any published calibration. Disclose if asked.

---

## 3. Structural comparison results (locked in this session)

All three plan-mandated pairs, executed against TM-align 20220412 (compiled
from source on macOS arm64 in this session).

| Pair | TM-score | RMSD | Aligned | Seq ID | Verdict |
|---|---|---|---|---|---|
| E. coli GUS (3LPF crystal) **vs** B. fragilis GUS (5Z1A crystal) | **0.838** | 2.63 Å | 529/590 | 26.1 % | high-confidence match |
| E. coli GUS (3LPF crystal) **vs** R. gnavus GUS (AlphaFold Q6W7J7) | **0.949** | 1.73 Å | 577/590 | 38.5 % | high-confidence match |
| B. fragilis GUS (5Z1A crystal) **vs** R. gnavus GUS (AlphaFold Q6W7J7) | **0.838** | 2.59 Å | 538/603 | 25.1 % | high-confidence match |

Headline demo narrative: **the GUS fold is conserved across taxa even at
~25 % sequence identity**, validating Tier 2 ortholog-existence claims
structurally. The Biernat 2019 finding (R. gnavus L1 loop is conserved
but less efficient at drug-glucuronide processing) is the nuance: same
fold, same loop architecture, different catalytic kinetics.

Superposed PDBs (chains A = first input in original frame, B = second
input rotated into A's frame) committed under
`backend/structural/cache/superposed/<id>` (the no-suffix variant for
each pair) and bundled inline into `frontend/structures.js`.

---

## 4. Files changed

### Modified
- `.env.example` — merge conflict resolved
- `.gitignore` — extended for structural cache, build artifacts, .DS_Store
- `backend/agents/agent2_prompt.txt` — KB rewritten for B. fragilis, E.
  coli, E. faecalis, R. gnavus, E. lenta. Added strict tier definitions.
- `backend/agents/agent3_prompt.txt` — broader description of
  ortholog_degradation_risk (any drug-metabolizing enzyme ortholog, not
  just CYP); GUS efficiency factor; whitelist of confirmed GUS producers.
- `backend/agents/agent4_prompt.txt` — added 2 new mandatory limitations
  (non-CYP pathways + no prospective clinical validation).
- `backend/formatter.py` — _KNOWN_GUS reduced to E. coli / B. fragilis /
  R. gnavus only. _KNOWN_CYP cleared for E. coli, B. fragilis, E.
  faecalis. E. lenta marker changed to "Cgr2". `format_for_frontend`
  accepts both `enzymatic_degradation_risk` and `ortholog_degradation_risk`
  from Agent 3 and emits `components.ortho` to the frontend (the demo
  schema stays stable).
- `backend/orchestrator.py` — model bumped to claude-sonnet-4-6;
  max_tokens bumped to 16384 (root cause for live-pipeline failures
  observed earlier in this session).

### Added
- `backend/structural/__init__.py`
- `backend/structural/pdb_fetcher.py` — RCSB + AlphaFold fetcher with
  automatic version discovery via the AlphaFold prediction API (the work
  plan's hardcoded `v4` URL pattern returns 404; current model version is v6).
- `backend/structural/tmalign_runner.py` — wraps the TM-align binary,
  parses TM-score / RMSD / aligned-length / sequence identity, returns
  the superposed PDB path.
- `backend/structural/comparator.py` — high-level (human enzyme,
  bacterial enzyme) → StructuralComparison flow; verdict + score
  modulation logic.
- `backend/structural/bin/TMalign.cpp` — TM-align source, with macOS-
  compatible `<stdlib.h>` patch instead of Linux-only `<malloc.h>`.
- `backend/structural/cache/structural_manifest.json` — the three
  plan-mandated comparisons.
- `backend/structural/cache/superposed/{ecoli_xtal_vs_bfrag_5z1a,
  ecoli_xtal_vs_rgnav_af_v2, bfrag_5z1a_vs_rgnav_af}` — superposed PDBs
  (CA-only, ~90 KB each).
- `frontend/structures.js` — 1.6 MB inlined bundle of the three full
  superposed PDB files + TM-align metadata, designed to feed a future
  Structural Evidence tab in `results.jsx`.

### Not committed (gitignored)
- `.env` — your API key.
- `.venv/` — local Python 3.12 venv.
- `backend/structural/bin/TMalign` — built locally per machine.
- `backend/structural/cache/rcsb_*.pdb`, `cache/af_*.pdb`,
  `cache/superposed/*_atm`, `*_all`, `*_all_atm_lig`, `*.pml` — bulky
  downloaded / intermediate files. The authoritative artifacts (the
  three plan-mandated superposed PDBs and the manifest) ARE committed.

---

## 5. What still needs to happen before 4 PM

In rough priority order. Items marked **BLOCKING** stop the demo from
showing the new feature; items marked **NICE-TO-HAVE** ship the science
even if missing.

1. **BLOCKING — Re-run live pipeline against patient 1 and patient 2.**
   Both runs in this session failed because Agent 2 hit the 8192 max_tokens
   limit mid-output. That's now fixed. Re-run, capture Agent 3 outputs,
   plug the new scores into `frontend/demo-data.js`.

2. **BLOCKING — Update `frontend/demo-data.js` to match the revised KB.**
   Specifically:
   - `taxa[*].cyp` — drop labels for E. coli, B. fragilis, E. faecalis.
     Change E. lenta to `'Cgr2'`.
   - `taxa[*].gus` — flip E. faecalis to `false`.
   - `recommendation.drug_recommendations[*].key_interactions` — drop
     the "CYP2D6-like" claims for E. coli / B. fragilis / E. faecalis;
     rephrase to generic "drug-metabolizing enzyme ortholog" language.
   - `recommendation.microbiome_context.key_taxa_of_concern` — same.
   - `recommendation.recommendation_summary` — drop "well-documented
     CYP2D6-like orthologs" wording.
   - `drug_scores[*]` — replace with the locked numbers from the live
     pipeline run (item 1 above).

3. **BLOCKING — Add the Structural Evidence tab to `frontend/results.jsx`.**
   Reads `STRUCTURAL_DATA` from `structures.js`. Renders:
   - Dropdown of the three comparison pairs
   - 3Dmol.js viewer (chain A blue, chain B red, L1 loop residues highlighted)
   - TM-score / RMSD / aligned-length / seq-ID / verdict text
   - Biernat 2019 / Wallace 2010 / Dashnyam 2017 citation footer
   Also add `<script src="https://3Dmol.org/build/3Dmol-min.js"></script>` and
   `<script src="structures.js"></script>` to `index.html`.

4. **BLOCKING — Update the chart legend label in `results.jsx`** from "CYP
   ortholog degradation" → "Enzymatic degradation" (and the chart subtitle
   on the Drug Scores tab).

5. **NICE-TO-HAVE — Wire structural score modulation into the orchestrator.**
   After Agent 3 outputs scores, multiply `ortholog_degradation_risk` and
   `enterohepatic_reactivation_risk` by the TM-score-derived modulation
   factor for any taxon that has a comparison in the manifest. Re-cap at
   1.0. Right now `score_modulation` is computed but not applied.

6. **NICE-TO-HAVE — Backend endpoint to serve the manifest** at
   `/structural_evidence`. The static `structures.js` bundle already lets
   the frontend work without a backend; this would be the live-API path
   the user toggled for during the design discussion.

7. **NICE-TO-HAVE — Aparna's drug-by-drug glucuronidation verification.**
   The plan's Priority 4: which of the six antidepressants actually undergo
   meaningful glucuronidation. Until verified, the conservative interpretation
   is "Venlafaxine ODV is the only well-established case; the other drugs
   need direct citation or de-weighting in the scoring."

---

## 6. Known caveats / what to say if a judge asks

- **TM-align is Cα-only.** High TM-score does not by itself prove shared
  substrate specificity — it proves shared backbone topology. Active site
  residue conservation would need separate analysis. The Biernat 2019
  finding (R. gnavus L1 loop is conserved but kinetically slower) is
  exactly this distinction.
- **AlphaFold predicts apo (ligand-free) states.** 3LPF and 5Z1A are
  inhibitor-bound crystals. Comparing them to apo AlphaFold predictions
  is fine for global fold but the local active-site geometry is biased
  toward the bound conformation.
- **The 0.7 and 0.3 verdict thresholds are not literature-supported.**
  Only the 0.5 same-fold threshold is. Disclose if pressed.
- **Score modulation multipliers (1.2×, 1.0×, 0.7×, 0.4×) are heuristic.**
  Not calibrated to clinical outcome data. They cannot be — no prospective
  trial of microbiome-guided psychiatric prescribing has been run.
- **The 0.5× R. gnavus efficiency factor** is *informed by* Biernat 2019
  but the specific 0.5 number is our choice. Biernat showed
  "less efficient than E. coli GUS"; they did not quantify a single
  multiplier we can cite.
- **No prospective clinical trial has yet demonstrated that
  microbiome-guided psychiatric prescribing improves patient outcomes.**
  This is now mandatory text in every Agent 4 output.

---

## 7. Reproducing the structural pipeline

```bash
# From repo root
python3.12 -m venv .venv && .venv/bin/pip install -r backend/requirements.txt

# Build TM-align (one-time)
cd backend/structural/bin
curl -O https://zhanggroup.org/TM-align/TMalign.cpp
sed -i.bak 's|#include <malloc.h>|#include <stdlib.h>|' TMalign.cpp   # macOS
clang++ -O3 -ffast-math -o TMalign TMalign.cpp && rm TMalign.cpp.bak

# Run the three plan pairs
cd ../../..
.venv/bin/python -c "
from backend.structural.comparator import compare_pair
for hn, hi, hs, taxon, bi, bs, label in [
    ('E. coli GUS','3LPF','rcsb','Bacteroides fragilis','5Z1A','rcsb','ecoli_xtal_vs_bfrag_5z1a'),
    ('E. coli GUS','3LPF','rcsb','Ruminococcus gnavus','Q6W7J7','alphafold','ecoli_xtal_vs_rgnav_af_v2'),
    ('B. fragilis GUS','5Z1A','rcsb','Ruminococcus gnavus','Q6W7J7','alphafold','bfrag_5z1a_vs_rgnav_af'),
]:
    r = compare_pair(hn, hi, hs, taxon, 'β-glucuronidase', bi, bs, output_label=label)
    print(label, r.to_dict() if hasattr(r,'to_dict') else r)
"
```

---

## 8. Key file paths to know

| What | Where |
|---|---|
| Revised plan (input to this session) | `revised_plan_for_rithika.md` (provided inline) |
| Original work plan | `hackathon_work_plan.md` (provided inline) |
| This log | `SESSION_LOG.md` |
| Agent prompts (edited) | `backend/agents/agent{2,3,4}_prompt.txt` |
| Structural module | `backend/structural/` |
| Structural results | `backend/structural/cache/structural_manifest.json` |
| Static frontend bundle | `frontend/structures.js` |
| Existing demo (still working as-is) | `frontend/index.html` (open directly in browser) |

---

End of session log.
