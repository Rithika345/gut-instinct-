"""
pdb_fetcher.py — Download protein structures from RCSB PDB (experimental crystal
structures, human enzymes) and the AlphaFold EBI database (predicted structures,
bacterial enzymes). Results are cached on disk so the same structure is only
downloaded once.

For AlphaFold we hit the prediction API to discover the current model URL
rather than hardcoding a version, because the public model gets bumped (v4 →
v5 → v6) and the file under the old version disappears.
"""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)

_BASE_DIR = Path(__file__).resolve().parent
CACHE_DIR = _BASE_DIR / "cache"
CACHE_DIR.mkdir(exist_ok=True)

_RCSB_URL = "https://files.rcsb.org/download/{pdb_id}.pdb"
_ALPHAFOLD_API = "https://alphafold.ebi.ac.uk/api/prediction/{uniprot_id}"


class StructureNotAvailable(Exception):
    """Raised when a requested structure cannot be retrieved."""


@dataclass
class AlphaFoldMetadata:
    """Confidence metadata pulled alongside the structure download."""

    uniprot_id: str
    model_version: int
    mean_plddt: float                 # globalMetricValue — overall confidence (0-100)
    uniprot_description: str
    organism: str
    pdb_path: Path


def _download(url: str, dest: Path) -> Path:
    """Download *url* to *dest* atomically. Returns dest on success."""
    tmp = dest.with_suffix(dest.suffix + ".part")
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            tmp.write_bytes(response.read())
    except urllib.error.HTTPError as exc:
        raise StructureNotAvailable(f"HTTP {exc.code} for {url}") from exc
    except urllib.error.URLError as exc:
        raise StructureNotAvailable(f"Network error for {url}: {exc.reason}") from exc

    tmp.replace(dest)
    return dest


def _fetch_alphafold_metadata(uniprot_id: str) -> dict:
    """Query the AlphaFold prediction API for entry metadata."""
    url = _ALPHAFOLD_API.format(uniprot_id=uniprot_id)
    try:
        with urllib.request.urlopen(url, timeout=15) as response:
            data = json.loads(response.read())
    except urllib.error.HTTPError as exc:
        raise StructureNotAvailable(
            f"AlphaFold has no entry for {uniprot_id} (HTTP {exc.code})"
        ) from exc
    except urllib.error.URLError as exc:
        raise StructureNotAvailable(
            f"AlphaFold API network error for {uniprot_id}: {exc.reason}"
        ) from exc

    if not data:
        raise StructureNotAvailable(f"AlphaFold returned empty result for {uniprot_id}")
    return data[0]


def fetch_rcsb_pdb(pdb_id: str) -> Path:
    """
    Download a crystal structure from RCSB PDB. Returns the cached file path.

    Used for human enzymes where experimental structures exist (CYP2D6=2F9Q,
    CYP2C19=4GQS, CYP3A4=1TQN, E. coli β-GUS=3LPF).
    """
    pdb_id = pdb_id.upper()
    dest = CACHE_DIR / f"rcsb_{pdb_id}.pdb"
    if dest.exists() and dest.stat().st_size > 0:
        return dest

    url = _RCSB_URL.format(pdb_id=pdb_id)
    logger.info("Fetching RCSB structure %s", pdb_id)
    return _download(url, dest)


def fetch_alphafold_pdb(uniprot_id: str) -> Path:
    """
    Download the current AlphaFold predicted structure for a UniProt accession.

    Discovers the current model URL via the prediction API rather than
    hardcoding a version — AlphaFold periodically re-releases models and the
    old version's file is removed.
    """
    uniprot_id = uniprot_id.upper()
    dest = CACHE_DIR / f"af_{uniprot_id}.pdb"
    if dest.exists() and dest.stat().st_size > 0:
        return dest

    meta = _fetch_alphafold_metadata(uniprot_id)
    pdb_url = meta.get("pdbUrl")
    if not pdb_url:
        raise StructureNotAvailable(
            f"AlphaFold entry {uniprot_id} has no pdbUrl"
        )
    logger.info("Fetching AlphaFold structure %s (v%s)", uniprot_id, meta.get("latestVersion"))
    return _download(pdb_url, dest)


def fetch_alphafold_pdb_with_metadata(uniprot_id: str) -> AlphaFoldMetadata:
    """
    Same as fetch_alphafold_pdb, but also returns the AlphaFold metadata
    (pLDDT confidence, description, organism, version). Used when we want
    to surface confidence info in the UI alongside the TM-score.
    """
    meta = _fetch_alphafold_metadata(uniprot_id.upper())
    path = fetch_alphafold_pdb(uniprot_id)
    return AlphaFoldMetadata(
        uniprot_id=uniprot_id.upper(),
        model_version=int(meta.get("latestVersion", 0)),
        mean_plddt=float(meta.get("globalMetricValue", 0.0)),
        uniprot_description=meta.get("uniprotDescription", ""),
        organism=meta.get("organismScientificName", ""),
        pdb_path=path,
    )
