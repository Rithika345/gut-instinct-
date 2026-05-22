"""Structural evidence module - PDB fetching, TM-align, and score modulation."""

from .comparator import (
    StructuralComparison,
    compare_pair,
    score_modulation_for_tm,
)
from .pdb_fetcher import fetch_rcsb_pdb, fetch_alphafold_pdb, fetch_alphafold_pdb_with_metadata, AlphaFoldMetadata
from .tmalign_runner import run_tmalign, TMAlignResult

__all__ = [
    "AlphaFoldMetadata",
    "StructuralComparison",
    "TMAlignResult",
    "compare_pair",
    "fetch_alphafold_pdb",
    "fetch_alphafold_pdb_with_metadata",
    "fetch_rcsb_pdb",
    "run_tmalign",
    "score_modulation_for_tm",
]
