"""
comparator.py — Higher-level structural comparison interface.

Given a (human enzyme, bacterial enzyme) spec, this module fetches both
structures, runs TM-align, applies verdict logic, and returns a structured
result suitable for the pipeline and the frontend.

Score modulation: TM-score is used as a multiplier on the
ortholog_degradation_risk component of Agent 3's score. High structural
similarity boosts the risk (the bacterial enzyme really does have the same
fold and can plausibly bind the drug); low similarity downgrades it.
"""

from __future__ import annotations

import logging
from dataclasses import asdict, dataclass, field
from typing import Literal

from .pdb_fetcher import (
    StructureNotAvailable,
    fetch_alphafold_pdb,
    fetch_rcsb_pdb,
)
from .tmalign_runner import TMAlignError, TMAlignResult, run_tmalign

logger = logging.getLogger(__name__)


StructureSource = Literal["rcsb", "alphafold"]
StructuralVerdict = Literal[
    "high_confidence_structural_match",  # TM > 0.7
    "same_fold",                          # 0.5–0.7
    "partial_similarity",                 # 0.3–0.5
    "no_structural_match",                # < 0.3
]


@dataclass
class StructuralComparison:
    """Single comparison between a human enzyme and a bacterial ortholog."""

    human_enzyme: str                 # e.g. "CYP2D6", "human_beta_GUS" — display name
    human_structure_id: str           # PDB ID e.g. "3LPF"
    human_structure_source: StructureSource
    bacterial_taxon: str              # e.g. "Bacteroides fragilis"
    bacterial_enzyme: str             # e.g. "beta-glucuronidase"
    bacterial_structure_id: str       # UniProt ID e.g. "Q5LIC7"
    bacterial_structure_source: StructureSource
    tm_score: float
    rmsd: float
    aligned_length: int
    seq_identity: float
    chain1_length: int
    chain2_length: int
    coverage: float                   # aligned / min(chain1, chain2)
    verdict: StructuralVerdict
    score_modulation: float           # multiplier applied to ortholog_degradation_risk
    superposed_pdb_path: str
    interpretation: str               # 1-sentence plain-English summary
    error: str | None = None

    def to_dict(self) -> dict:
        d = asdict(self)
        if d["error"] is None:
            d.pop("error")
        return d


@dataclass
class FailedComparison:
    """Marker for a pair we tried but couldn't compute (missing structure, etc.)."""

    human_enzyme: str
    bacterial_taxon: str
    bacterial_enzyme: str
    error: str
    error_class: str = ""

    def to_dict(self) -> dict:
        return {**asdict(self), "verdict": "unavailable"}


def _verdict_from_tm(tm: float) -> StructuralVerdict:
    if tm >= 0.7:
        return "high_confidence_structural_match"
    if tm >= 0.5:
        return "same_fold"
    if tm >= 0.3:
        return "partial_similarity"
    return "no_structural_match"


def score_modulation_for_tm(tm: float) -> float:
    """
    Multiplier applied to ortholog_degradation_risk based on TM-score.

    - TM > 0.7 → 1.2 (boost — strong structural support)
    - TM 0.5–0.7 → 1.0 (neutral — same fold, sequence-only score stands)
    - TM 0.3–0.5 → 0.7 (downgrade — partial similarity)
    - TM < 0.3   → 0.4 (sharp downgrade — no structural support)

    The downstream code applies this and then re-caps the risk at 1.0.
    """
    if tm >= 0.7:
        return 1.2
    if tm >= 0.5:
        return 1.0
    if tm >= 0.3:
        return 0.7
    return 0.4


def _interpretation(verdict: StructuralVerdict, human: str, taxon: str, tm: float) -> str:
    if verdict == "high_confidence_structural_match":
        return (
            f"The {taxon} ortholog shares the same overall fold as {human} "
            f"(TM-score {tm:.2f}, well above the 0.5 same-fold threshold). "
            "Strong structural support for similar substrate binding."
        )
    if verdict == "same_fold":
        return (
            f"The {taxon} ortholog shares the same overall fold as {human} "
            f"(TM-score {tm:.2f}). Likely similar substrate binding capability."
        )
    if verdict == "partial_similarity":
        return (
            f"The {taxon} ortholog shows partial structural similarity to "
            f"{human} (TM-score {tm:.2f}). Sequence-based ortholog claim is "
            "weakly supported by structure."
        )
    return (
        f"The {taxon} ortholog does NOT share the {human} fold "
        f"(TM-score {tm:.2f}). Sequence similarity is unlikely to imply "
        "shared function — this ortholog claim is structurally downgraded."
    )


def _fetch(structure_id: str, source: StructureSource):
    if source == "rcsb":
        return fetch_rcsb_pdb(structure_id)
    if source == "alphafold":
        return fetch_alphafold_pdb(structure_id)
    raise ValueError(f"Unknown structure source: {source}")


def compare_pair(
    human_enzyme: str,
    human_structure_id: str,
    human_structure_source: StructureSource,
    bacterial_taxon: str,
    bacterial_enzyme: str,
    bacterial_structure_id: str,
    bacterial_structure_source: StructureSource,
    output_label: str | None = None,
) -> StructuralComparison | FailedComparison:
    """
    Fetch both structures, run TMalign, return a structured comparison.

    On any failure (structure unavailable, TMalign error), returns a
    FailedComparison instead of raising — callers should treat structural
    evidence as best-effort, not a hard requirement.
    """
    label = output_label or f"{human_structure_id}_vs_{bacterial_structure_id}"

    try:
        human_path = _fetch(human_structure_id, human_structure_source)
        bacterial_path = _fetch(bacterial_structure_id, bacterial_structure_source)
    except StructureNotAvailable as exc:
        logger.warning("Structure fetch failed for %s: %s", label, exc)
        return FailedComparison(
            human_enzyme=human_enzyme,
            bacterial_taxon=bacterial_taxon,
            bacterial_enzyme=bacterial_enzyme,
            error=str(exc),
            error_class="StructureNotAvailable",
        )

    try:
        tm: TMAlignResult = run_tmalign(human_path, bacterial_path, label)
    except TMAlignError as exc:
        logger.warning("TMalign failed for %s: %s", label, exc)
        return FailedComparison(
            human_enzyme=human_enzyme,
            bacterial_taxon=bacterial_taxon,
            bacterial_enzyme=bacterial_enzyme,
            error=str(exc),
            error_class="TMAlignError",
        )

    verdict = _verdict_from_tm(tm.tm_score)
    min_len = min(tm.chain1_length, tm.chain2_length) or 1
    coverage = tm.aligned_length / min_len

    return StructuralComparison(
        human_enzyme=human_enzyme,
        human_structure_id=human_structure_id,
        human_structure_source=human_structure_source,
        bacterial_taxon=bacterial_taxon,
        bacterial_enzyme=bacterial_enzyme,
        bacterial_structure_id=bacterial_structure_id,
        bacterial_structure_source=bacterial_structure_source,
        tm_score=round(tm.tm_score, 3),
        rmsd=round(tm.rmsd, 2),
        aligned_length=tm.aligned_length,
        seq_identity=round(tm.seq_identity, 3),
        chain1_length=tm.chain1_length,
        chain2_length=tm.chain2_length,
        coverage=round(coverage, 3),
        verdict=verdict,
        score_modulation=score_modulation_for_tm(tm.tm_score),
        superposed_pdb_path=tm.superposed_pdb_path,
        interpretation=_interpretation(verdict, human_enzyme, bacterial_taxon, tm.tm_score),
    )
