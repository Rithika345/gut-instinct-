"""
formatter.py — Converts raw agent pipeline outputs into the structure
the frontend expects for rendering charts, graphs, and recommendations.

The frontend needs:
  taxa:          [{name, phylum, abundance, gus, cyp}]
  drug_scores:   [{name, score, components: {ortho, gus}}]
  graph:         {drug_nodes, taxa_nodes, edges}
  recommendation: Agent 4 output (passed through)
"""

import logging
import re

logger = logging.getLogger(__name__)


# --- Known GUS producers and CYP orthologs from Agent 2 knowledge base ---
# These are used as fallbacks if Agent 2 output parsing fails.
_KNOWN_GUS = {
    "Bacteroides fragilis", "Bacteroides thetaiotaomicron", "Bacteroides vulgatus",
    "Clostridium scindens", "Clostridium bolteae", "Enterococcus faecalis",
    "Ruminococcus gnavus", "Escherichia coli", "Klebsiella pneumoniae",
}

_KNOWN_CYP = {
    "Bacteroides fragilis":         "CYP2D6",
    "Bacteroides thetaiotaomicron": "CYP2C19",
    "Bacteroides vulgatus":         "CYP3A4",
    "Clostridium scindens":         "CYP3A4",
    "Clostridium bolteae":          "CYP2D6",
    "Enterococcus faecalis":        "CYP2D6",
    "Ruminococcus gnavus":          None,
    "Escherichia coli":             "CYP2D6/2C19",
    "Klebsiella pneumoniae":        "CYP3A4",
    "Pseudomonas aeruginosa":       "CYP2D6",
    "Eggerthella lenta":            "CYP2D6",
    "Prevotella copri":             "CYP2C19",
    "Lactobacillus rhamnosus":      "CYP2C19",
}


def _make_node_id(name: str) -> str:
    """Create a short, deterministic node ID from a species name."""
    # E.g. "Escherichia coli" -> "ecoli", "Bacteroides fragilis" -> "bfrag"
    parts = name.lower().split()
    if len(parts) >= 2:
        genus_prefix = parts[0][0]
        species = re.sub(r"[^a-z0-9]", "", parts[1])[:6]
        return f"{genus_prefix}{species}"
    return re.sub(r"[^a-z0-9]", "", name.lower())[:8]


def _get_tier(score: float) -> str:
    """Map a numeric score to a display tier."""
    if score < 0.30:
        return "Recommended"
    elif score <= 0.60:
        return "Consider"
    else:
        return "Caution"


def _extract_gus_cyp_from_agent2(agent2_output: dict, taxon_name: str) -> tuple:
    """
    Try to extract GUS and CYP info for a taxon from Agent 2's output.
    Returns (gus: bool, cyp: str | None).
    Falls back to the hardcoded knowledge base if parsing fails.
    """
    gus = taxon_name in _KNOWN_GUS
    cyp = _KNOWN_CYP.get(taxon_name)

    try:
        interactions = agent2_output.get("drug_microbiome_interactions", [])
        for drug_interaction in interactions:
            # Check ortholog matches for CYP info
            for match in drug_interaction.get("enzyme_ortholog_matches", []):
                if match.get("bacterial_taxon") == taxon_name:
                    enzyme = match.get("human_enzyme", "")
                    if enzyme and enzyme.startswith("CYP"):
                        cyp = enzyme

            # Check GUS info
            gus_risk = drug_interaction.get("beta_glucuronidase_risk", {})
            for producer in gus_risk.get("producing_taxa", []):
                if producer.get("taxon") == taxon_name:
                    gus = True
    except Exception:
        pass  # Fall back to hardcoded knowledge base

    return gus, cyp


def format_for_frontend(
    microbiome_profile: dict,
    agent2_output: dict,
    agent3_output: dict,
    agent4_output: dict,
) -> dict:
    """
    Convert raw pipeline outputs into the structure the frontend expects.

    Returns a dict with keys: status, taxa, drug_scores, graph, recommendation.
    """

    # ── 1. Build taxa list ───────────────────────────────────────────────
    taxa = []
    for t in microbiome_profile.get("taxa", []):
        taxon_name = t.get("taxon", "")
        gus, cyp = _extract_gus_cyp_from_agent2(agent2_output, taxon_name)
        taxa.append({
            "name": taxon_name,
            "phylum": t.get("phylum", "Unknown"),
            "abundance": t.get("relative_abundance_pct", 0),
            "gus": gus,
            "cyp": cyp,
        })

    # Sort by abundance descending
    taxa.sort(key=lambda x: x["abundance"], reverse=True)

    # ── 2. Build drug_scores ─────────────────────────────────────────────
    drug_scores = []
    raw_scores = agent3_output.get("drug_scores", [])

    for ds in raw_scores:
        name = ds.get("drug_name", "")
        score = ds.get("metabolic_interference_score", 0)
        components = ds.get("score_components", {})
        ortho = components.get("ortholog_degradation_risk", 0)
        gus_risk = components.get("enterohepatic_reactivation_risk", 0)

        drug_scores.append({
            "name": name,
            "score": round(score, 2),
            "components": {
                "ortho": round(ortho, 2),
                "gus": round(gus_risk, 2),
            },
        })

    # Sort by score ascending (best first)
    drug_scores.sort(key=lambda x: x["score"])

    # ── 3. Build graph ───────────────────────────────────────────────────
    # The frontend expects a bipartite graph: taxa_nodes ↔ drug_nodes
    # with edges typed as 'cyp' or 'gus'.

    # Drug nodes from drug_scores
    drug_nodes = []
    for ds in drug_scores:
        drug_id = ds["name"].lower()
        drug_nodes.append({
            "id": drug_id,
            "label": ds["name"],
            "tier": _get_tier(ds["score"]),
        })

    # Taxa nodes — only include taxa that have CYP orthologs or GUS activity
    taxa_with_activity = [t for t in taxa if t["gus"] or t["cyp"]]
    taxa_nodes = []
    taxon_id_map = {}  # name -> id for edge building
    for t in taxa_with_activity:
        node_id = _make_node_id(t["name"])
        taxon_id_map[t["name"]] = node_id
        taxa_nodes.append({
            "id": node_id,
            "label": _abbreviate_name(t["name"]),
            "phylum": t["phylum"],
            "abundance": t["abundance"],
        })

    # Build edges from Agent 3's graph
    edges = []
    raw_graph = agent3_output.get("graph", {})
    raw_edges = raw_graph.get("edges", [])

    # Map Agent 3 node IDs to names for lookup
    node_id_to_name = {}
    for node in raw_graph.get("nodes", []):
        node_id_to_name[node.get("id", "")] = node.get("label", "")

    for edge in raw_edges:
        source_id = edge.get("source", "")
        target_id = edge.get("target", "")
        relationship = edge.get("relationship", "")
        confidence = edge.get("confidence_weight", 0.5)

        source_name = node_id_to_name.get(source_id, source_id)
        target_name = node_id_to_name.get(target_id, target_id)

        # Determine if this is a taxon→drug edge
        taxon_name = None
        drug_name = None
        edge_type = None

        if relationship in ("produces_ortholog", "metabolizes"):
            # These edges connect taxa/enzymes to drugs
            # We need to trace through: taxon → bacterial_enzyme → human_enzyme → drug
            # For simplicity, look for edges where one end is a taxon and the other
            # is or connects to a drug
            pass

        if relationship == "reactivates":
            edge_type = "gus"

        # Try to identify taxon and drug from node types
        for node in raw_graph.get("nodes", []):
            if node.get("id") == source_id and node.get("type") == "taxon":
                taxon_name = node.get("label", "")
            if node.get("id") == target_id and node.get("type") == "drug":
                drug_name = node.get("label", "").capitalize()

    # If Agent 3's graph is too complex to parse into the bipartite format,
    # fall back to building edges from Agent 2's interaction data
    if len(edges) < 3:
        edges = _build_edges_from_agent2(
            agent2_output, taxa_with_activity, drug_scores, taxon_id_map
        )

    graph = {
        "drug_nodes": drug_nodes,
        "taxa_nodes": taxa_nodes,
        "edges": edges,
    }

    # ── 4. Pass through recommendation ───────────────────────────────────
    recommendation = agent4_output

    return {
        "status": "success",
        "taxa": taxa,
        "drug_scores": drug_scores,
        "graph": graph,
        "recommendation": recommendation,
    }


def _abbreviate_name(full_name: str) -> str:
    """'Escherichia coli' -> 'E. coli'"""
    parts = full_name.split()
    if len(parts) >= 2:
        return f"{parts[0][0]}. {' '.join(parts[1:])}"
    return full_name


def _build_edges_from_agent2(
    agent2_output: dict,
    taxa_with_activity: list,
    drug_scores: list,
    taxon_id_map: dict,
) -> list:
    """
    Build bipartite edges from Agent 2's drug_microbiome_interactions.
    This is the reliable path since Agent 3's graph uses a more complex
    node structure that doesn't map 1:1 to the frontend's bipartite format.
    """
    edges = []
    seen = set()

    drug_names_lower = {ds["name"].lower(): ds["name"] for ds in drug_scores}

    for interaction in agent2_output.get("drug_microbiome_interactions", []):
        drug_name = interaction.get("drug_name", "")
        drug_id = drug_name.lower()

        if drug_id not in drug_names_lower:
            continue

        # CYP ortholog edges
        for match in interaction.get("enzyme_ortholog_matches", []):
            taxon_name = match.get("bacterial_taxon", "")
            taxon_id = taxon_id_map.get(taxon_name)
            if not taxon_id:
                continue

            abundance = match.get("taxon_abundance_pct", 0)
            tier = match.get("evidence_tier", 3)
            tier_weight = {1: 1.0, 2: 0.5, 3: 0.2}.get(tier, 0.2)
            strength = round(min(tier_weight * (abundance / 15), 1.0), 2)

            edge_key = (taxon_id, drug_id, "cyp")
            if edge_key not in seen:
                edges.append({
                    "taxon": taxon_id,
                    "drug": drug_id,
                    "type": "cyp",
                    "strength": strength,
                })
                seen.add(edge_key)

        # GUS edges
        gus_risk = interaction.get("beta_glucuronidase_risk", {})
        if gus_risk.get("at_risk"):
            for producer in gus_risk.get("producing_taxa", []):
                taxon_name = producer.get("taxon", "")
                taxon_id = taxon_id_map.get(taxon_name)
                if not taxon_id:
                    continue

                abundance = producer.get("abundance_pct", 0)
                tier = producer.get("evidence_tier", 2)
                tier_weight = {1: 1.0, 2: 0.5, 3: 0.2}.get(tier, 0.2)
                strength = round(min(tier_weight * (abundance / 12), 1.0), 2)

                edge_key = (taxon_id, drug_id, "gus")
                if edge_key not in seen:
                    edges.append({
                        "taxon": taxon_id,
                        "drug": drug_id,
                        "type": "gus",
                        "strength": strength,
                    })
                    seen.add(edge_key)

    return edges
