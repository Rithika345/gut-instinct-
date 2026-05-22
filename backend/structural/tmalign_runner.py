"""
tmalign_runner.py — Thin wrapper around the TMalign binary.

Runs TMalign on a pair of PDB files, parses TM-score / RMSD / aligned length /
sequence identity from stdout, and returns the path to the superposed PDB
(both structures in one coordinate frame, suitable for 3Dmol.js).
"""

from __future__ import annotations

import logging
import re
import subprocess
from dataclasses import asdict, dataclass
from pathlib import Path

logger = logging.getLogger(__name__)

_BASE_DIR = Path(__file__).resolve().parent
TMALIGN_BIN = _BASE_DIR / "bin" / "TMalign"
SUPERPOSED_DIR = _BASE_DIR / "cache" / "superposed"
SUPERPOSED_DIR.mkdir(parents=True, exist_ok=True)


class TMAlignError(RuntimeError):
    """TMalign failed or stdout could not be parsed."""


@dataclass
class TMAlignResult:
    """Parsed TMalign output."""

    tm_score_norm_chain1: float       # TM-score normalized by length of chain 1
    tm_score_norm_chain2: float       # TM-score normalized by length of chain 2
    tm_score: float                   # Max of the two (commonly reported)
    rmsd: float                       # Angstroms
    aligned_length: int               # Number of aligned residues
    seq_identity: float               # Fraction (0-1) over aligned region
    chain1_length: int
    chain2_length: int
    superposed_pdb_path: str          # Combined superposed structure (chain A + B)
    raw_stdout: str                   # Full TMalign stdout for debugging

    def to_dict(self) -> dict:
        return asdict(self)


# Stdout patterns we need to parse. TMalign output is stable across versions.
_RE_LEN1 = re.compile(r"Length of Chain_1:\s*(\d+)")
_RE_LEN2 = re.compile(r"Length of Chain_2:\s*(\d+)")
_RE_ALIGNED = re.compile(r"Aligned length=\s*(\d+),\s*RMSD=\s*([\d.]+),\s*Seq_ID=n_identical/n_aligned=\s*([\d.]+)")
_RE_TMSCORE_C1 = re.compile(r"TM-score=\s*([\d.]+)\s*\(if normalized by length of Chain_1")
_RE_TMSCORE_C2 = re.compile(r"TM-score=\s*([\d.]+)\s*\(if normalized by length of Chain_2")


def _parse_stdout(stdout: str) -> dict:
    """Extract TM-score, RMSD, etc. from TMalign stdout."""
    fields: dict = {}

    if m := _RE_LEN1.search(stdout):
        fields["chain1_length"] = int(m.group(1))
    if m := _RE_LEN2.search(stdout):
        fields["chain2_length"] = int(m.group(1))
    if m := _RE_ALIGNED.search(stdout):
        fields["aligned_length"] = int(m.group(1))
        fields["rmsd"] = float(m.group(2))
        fields["seq_identity"] = float(m.group(3))
    if m := _RE_TMSCORE_C1.search(stdout):
        fields["tm_score_norm_chain1"] = float(m.group(1))
    if m := _RE_TMSCORE_C2.search(stdout):
        fields["tm_score_norm_chain2"] = float(m.group(1))

    required = {
        "chain1_length", "chain2_length", "aligned_length", "rmsd",
        "seq_identity", "tm_score_norm_chain1", "tm_score_norm_chain2",
    }
    missing = required - fields.keys()
    if missing:
        raise TMAlignError(
            f"TMalign stdout missing fields {missing}. Raw output:\n{stdout}"
        )

    fields["tm_score"] = max(
        fields["tm_score_norm_chain1"], fields["tm_score_norm_chain2"]
    )
    return fields


def run_tmalign(pdb1: Path, pdb2: Path, output_label: str) -> TMAlignResult:
    """
    Run TMalign on the given pair and return parsed results.

    Parameters
    ----------
    pdb1, pdb2
        PDB file paths. Order matters: pdb1 is the "query", pdb2 is the
        "template". TMalign reports TM-score normalized by either chain.
    output_label
        Stem used to name the superposed PDB output, e.g.
        "cyp2d6_vs_ecoli". The combined-structure file ends up at
        cache/superposed/<output_label>.pdb.

    Raises
    ------
    TMAlignError
        If the binary exits non-zero or its stdout cannot be parsed.
    """
    if not TMALIGN_BIN.exists():
        raise TMAlignError(
            f"TMalign binary not found at {TMALIGN_BIN}. "
            "Build it from backend/structural/bin/TMalign.cpp."
        )

    output_prefix = SUPERPOSED_DIR / output_label
    cmd = [
        str(TMALIGN_BIN),
        str(pdb1),
        str(pdb2),
        "-o", str(output_prefix),
    ]

    logger.info("Running TMalign: %s", " ".join(cmd))
    proc = subprocess.run(
        cmd, capture_output=True, text=True, timeout=120, check=False
    )
    if proc.returncode != 0:
        raise TMAlignError(
            f"TMalign exited {proc.returncode}.\nstderr: {proc.stderr}"
        )

    parsed = _parse_stdout(proc.stdout)

    # TMalign's -o flag writes several files; the combined superposed PDB
    # (suitable for loading into 3Dmol.js as a single file with both chains)
    # is the one without a suffix.
    superposed_path = output_prefix
    if not superposed_path.exists():
        # Some TMalign versions append .pdb; check that variant too.
        alt = output_prefix.with_suffix(".pdb")
        if alt.exists():
            superposed_path = alt
        else:
            raise TMAlignError(
                f"TMalign did not produce expected superposed file at {output_prefix}"
            )

    return TMAlignResult(
        superposed_pdb_path=str(superposed_path),
        raw_stdout=proc.stdout,
        **parsed,
    )
