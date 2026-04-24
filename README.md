# Gut Instinct

<<<<<<< HEAD
**Pharmacomicrobiomics clinical decision support — a 4-agent AI pipeline that maps gut microbiome composition to psychiatric drug recommendations.**

Built overnight by [Rithika Krishna](https://github.com/Rithika345) and Aparna as part of the wAIve project.

---

## What it does

Standard psychiatric prescribing ignores the gut microbiome entirely. Gut Instinct addresses one specific failure mode: gut bacteria can metabolize psychiatric drugs before they reach the bloodstream (via CYP450-like orthologs) or reactivate already-excreted drugs by cleaving glucuronic acid tags (β-glucuronidase). Both mechanisms alter effective drug levels in ways that are entirely invisible to standard pharmacogenomics.

Gut Instinct takes a patient's microbiome composition and psychiatric diagnosis, runs a 4-agent AI pipeline, and outputs ranked drug recommendations with per-drug interference scores, an interaction network, and clinical reasoning.

**Demo — try it in your browser right now:** open `frontend/index.html` directly. No server needed. Pre-validated demo data loads automatically.

---

## Architecture

```
Patient Input (diagnosis + microbiome profile)
    │
    ▼
Agent 1 — Pharmacokinetic Mapper
    Diagnosis → candidate drugs with metabolizing enzymes,
    half-lives, glucuronidation flags (PharmGKB / KEGG / DrugBank)
    │
    ▼
Agent 2 — Ortholog Hunter
    Patient microbiome × drug PK data → bacterial enzyme matches
    (18 species, 5 phyla; sources: Zimmermann 2019, CYPED, Haiser 2013)
    Evidence tiers: Confirmed / Inferred / Predicted
    │
    ▼
Agent 3 — Graph Architect
    Builds drug–microbe interaction graph, computes interference scores
    CYP ortholog degradation (45%) + enterohepatic reactivation (35%)
    – metabolic pathway redundancy – active metabolite buffer
    │
    ▼
Agent 4 — Clinical Interpreter
    Tiered recommendations: Recommended (<0.30) · Consider (0.30–0.60) · Caution (>0.60)
    Per-drug clinical reasoning, key interactions, risk flags, limitations
```

Each agent has a curated domain knowledge base embedded directly in its system prompt (RAG-style grounding). Agents are prevented from using knowledge outside the curated base, required to cite sources, and cross-check each other's outputs for consistency.

---

## Demo profiles

| Profile | Diagnosis | Key feature |
|---|---|---|
| `patient1_mdd_dysbiosis` | Major Depressive Disorder | Post-antibiotic dysbiosis; high *E. coli* (18.5%) drives CYP2D6 + β-GUS interference. Prior failure: Sertraline. |
| `patient2_ptsd_glucuronidase` | Post-Traumatic Stress Disorder | High β-glucuronidase load (*R. gnavus* 11.4%, *E. faecalis* 9.2%). Current med: Prazosin. |

---

## Quickstart — frontend only (no backend required)

The frontend ships with pre-validated pipeline results for both demo profiles. To see the full UI and visualizations, just open the file in your browser:

```
frontend/index.html
```

Open it in Chrome, Firefox, or Safari directly from the filesystem. The app will detect that `localhost:8000` is unreachable and load the demo data automatically. All visualizations — drug interference charts, interaction networks, clinical recommendations — are fully functional.

---

## Running the full pipeline (with live API calls)

### 1. Clone the repo

```bash
git clone https://github.com/Rithika345/gut-instinct-
cd gut-instinct-
```

### 2. Install backend dependencies

Requires Python 3.11+.

```bash
cd backend
pip install -r requirements.txt
```

### 3. Set up your API key

```bash
cp ../.env.example ../.env
# Edit .env and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-...
```

You can get a key at [console.anthropic.com](https://console.anthropic.com). A single demo run costs roughly **$0.01–0.02** (4 agents × ~6K tokens each on claude-sonnet).

### 4. Start the backend

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 5. Open the frontend

Open `frontend/index.html` in your browser. Select a demo profile and click **Run Pipeline**. The frontend will call your local backend and display live results.

---

## API reference

### `POST /analyze`

```json
{
  "diagnosis": "Major Depressive Disorder",
  "patient_profile_id": "patient1_mdd_dysbiosis",
  "current_medications": [],
  "prior_failures": ["Sertraline"]
}
```

**Response:**
```json
{
  "status": "success",
  "agent1_output": { ... },
  "agent2_output": { ... },
  "agent3_output": { ... },
  "agent4_output": { ... },
  "recommendation": { ... }
}
```

**Available `patient_profile_id` values:**
- `patient1_mdd_dysbiosis`
- `patient2_ptsd_glucuronidase`

---

## Curl examples

```bash
# Patient 1 — MDD with post-antibiotic dysbiosis
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"diagnosis": "Major Depressive Disorder", "patient_profile_id": "patient1_mdd_dysbiosis", "current_medications": [], "prior_failures": ["Sertraline"]}'

# Patient 2 — PTSD with high β-glucuronidase load
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"diagnosis": "Post-Traumatic Stress Disorder", "patient_profile_id": "patient2_ptsd_glucuronidase", "current_medications": ["Prazosin"], "prior_failures": []}'
```

---

## Project structure

```
gut-instinct/
├── backend/
│   ├── agents/
│   │   ├── agent1_prompt.txt      # Pharmacokinetic Mapper (curated PK data for 6 drugs)
│   │   ├── agent2_prompt.txt      # Ortholog Hunter (18 taxa, 5 phyla, evidence tiers)
│   │   ├── agent3_prompt.txt      # Graph Architect (scoring formula + graph construction)
│   │   └── agent4_prompt.txt      # Clinical Interpreter (tiering rules + clinical language)
│   ├── demo_profiles/
│   │   ├── patient1_mdd_dysbiosis.json
│   │   └── patient2_ptsd_glucuronidase.json
│   ├── main.py                    # FastAPI app
│   ├── orchestrator.py            # Agent chaining, JSON parsing, retry logic
│   ├── models.py                  # Pydantic request/response schemas
│   └── requirements.txt
├── frontend/
│   ├── index.html                 # Main app (React via CDN, self-contained)
│   ├── app.jsx                    # Root component + pipeline runner
│   ├── landing.jsx                # Profile selector
│   ├── results.jsx                # Results renderer (charts, network, recommendations)
│   ├── demo-data.js               # Pre-validated demo results (fallback)
│   └── index-print.html           # Print-friendly output
├── .env.example
├── .gitignore
└── README.md
```

---

## Knowledge base sources

| Agent | Sources |
|---|---|
| Agent 1 (PK) | PharmGKB, KEGG, DrugBank — 6 antidepressants |
| Agent 2 (Orthologs) | Zimmermann et al. 2019 (*Nature*), CYPED database, Haiser et al. 2013, Koppel et al. 2017 |
| Agent 3 (Scoring) | Derived scoring formula; inter-agent consistency validation |
| Agent 4 (Clinical) | Evidence-tiered interpretation with mandatory limitations disclosure |

---

## Limitations

This is a research/educational tool. All predictions are probabilistic and based on emerging pharmacomicrobiomics evidence. Key caveats:

1. **Sequence homology ≠ functional equivalence.** Bacterial orthologs may not metabolize drugs identically to human enzymes.
2. **Microbiome composition is dynamic.** Predictions reflect the profile at time of sampling only.
3. **Human pharmacogenomics not included.** CYP2D6 poor/ultrarapid metabolizer status would substantially change predictions.
4. **Knowledge base is limited to 6 antidepressants.** Tricyclics, MAOIs, and augmentation agents are outside scope.
5. **Dose–response not modeled.** Predictions address relative metabolic interference, not therapeutic equivalence.

This tool does not replace clinical judgment.

---

## Built by

Rithika Krishna and Aparna — co-founders of [wAIve](https://github.com/Rithika345).

Built at the intersection of agentic AI and pharmacomicrobiomics. Agent prompt engineering, knowledge base curation, demo profile design, pipeline QA, and frontend were all co-developed.
=======
<!-- TODO: Add project description, setup instructions, and usage documentation. -->
>>>>>>> 06c2c928af4ab2f384b6c942c59bde2998fb386e
