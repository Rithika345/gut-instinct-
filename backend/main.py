"""
main.py - FastAPI entry point for the Gut Instinct backend.

Run with:  uvicorn main:app --reload
"""

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException

from models import AnalyzeRequest, AnalyzeResponse
from orchestrator import run_pipeline

app = FastAPI(
    title="Gut Instinct API",
    description="Pharmacomicrobiomics clinical-decision-support pipeline",
    version="0.1.0",
)

_DEMO_PROFILES_DIR = Path(__file__).resolve().parent / "demo_profiles"


def _load_demo_profile(profile_id: str) -> dict:
    """
    Load a demo patient profile JSON by its ID.

    The profile_id is the filename stem, e.g. "patient1_mdd_dysbiosis".
    """
    path = _DEMO_PROFILES_DIR / f"{profile_id}.json"
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Demo profile '{profile_id}' not found. "
            f"Available profiles: {[p.stem for p in _DEMO_PROFILES_DIR.glob('*.json')]}",
        )
    return json.loads(path.read_text(encoding="utf-8"))


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """Run the full 4-agent pipeline for a given diagnosis and patient profile."""
    profile = _load_demo_profile(request.patient_profile_id)

    result = run_pipeline(
        diagnosis=request.diagnosis,
        microbiome_profile=profile,
        current_medications=request.current_medications,
        prior_failures=request.prior_failures,
    )

    return AnalyzeResponse(**result)
