"""
orchestrator.py - Core pipeline engine that chains 4 Anthropic-powered agents sequentially.

Each agent receives its .txt prompt as the system instruction and structured JSON as
the user message.  Outputs are parsed as JSON and fed forward to the next agent.
"""

import json
import logging
import os
import re
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

_BASE_DIR = Path(__file__).resolve().parent
_AGENTS_DIR = _BASE_DIR / "agents"
_MODEL_NAME = "claude-sonnet-4-20250514"


def _configure_client() -> Anthropic:
    """Load .env and return a configured Anthropic client."""
    load_dotenv(dotenv_path=_BASE_DIR.parent / ".env")
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not set. "
            "Copy .env.example to .env and add your key."
        )
    return Anthropic(api_key=api_key)


def _load_prompt(filename: str) -> str:
    """Read an agent prompt .txt file and return its contents."""
    path = _AGENTS_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Agent prompt not found: {path}")
    return path.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# JSON cleanup helpers
# ---------------------------------------------------------------------------

def _clean_json_text(text: str) -> str:
    """
    Progressively clean raw LLM response text so it can be parsed as JSON.

    Steps:
      1. Strip markdown code fences (```json / ```)
      2. Remove trailing commas before } or ]
    """
    # 1 — Strip markdown code fences
    lines = text.splitlines()
    if lines and lines[0].strip().startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]
    text = "\n".join(lines)

    # 2 — Remove trailing commas before closing braces / brackets
    text = re.sub(r",\s*}", "}", text)
    text = re.sub(r",\s*]", "]", text)

    return text.strip()


def _extract_json_substring(text: str) -> str | None:
    """Find the first { and last } in *text* and return that substring."""
    first = text.find("{")
    last = text.rfind("}")
    if first != -1 and last != -1 and last > first:
        return text[first : last + 1]
    return None


def _parse_json_safe(raw_text: str) -> dict:
    """
    Attempt to parse *raw_text* as JSON using progressively aggressive cleanup.

    Raises ``json.JSONDecodeError`` only after all strategies are exhausted,
    and logs the raw text for debugging.
    """
    # Attempt 1 — clean text (fence strip + trailing-comma fix)
    cleaned = _clean_json_text(raw_text)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Attempt 2 — extract the JSON substring between first { and last }
    substring = _extract_json_substring(cleaned)
    if substring:
        try:
            return json.loads(substring)
        except json.JSONDecodeError:
            pass

    # All attempts failed — log for debugging and re-raise
    logger.error(
        "Failed to parse agent response as JSON after all cleanup attempts.\n"
        "--- RAW RESPONSE START ---\n%s\n--- RAW RESPONSE END ---",
        raw_text,
    )
    raise json.JSONDecodeError(
        "All JSON parsing strategies failed. Check logs for raw response.",
        raw_text,
        0,
    )


# ---------------------------------------------------------------------------
# Agent invocation helpers
# ---------------------------------------------------------------------------

def _call_agent(client: Anthropic, system_instruction: str, user_message: str) -> dict:
    """
    Call Claude with a system instruction and user message.

    Parses the response as JSON with robust cleanup.  If parsing fails,
    retries the API call once with an explicit JSON-only nudge.

    Returns the parsed dict.
    """
    response = client.messages.create(
        model=_MODEL_NAME,
        max_tokens=8192,
        system=system_instruction,
        messages=[{"role": "user", "content": user_message}],
    )
    raw = response.content[0].text.strip()

    try:
        return _parse_json_safe(raw)
    except json.JSONDecodeError:
        pass  # fall through to retry

    # ---- Retry once ----
    retry_message = (
        user_message
        + "\n\n[SYSTEM NOTE: Your previous response was not valid JSON. "
        "Please respond with ONLY a valid JSON object. No markdown, no explanation.]"
    )
    response = client.messages.create(
        model=_MODEL_NAME,
        max_tokens=4096,
        system=system_instruction,
        messages=[{"role": "user", "content": retry_message}],
    )
    raw = response.content[0].text.strip()

    return _parse_json_safe(raw)  # let it raise on second failure


# ---------------------------------------------------------------------------
# Public pipeline entry-point
# ---------------------------------------------------------------------------

def run_pipeline(
    diagnosis: str,
    microbiome_profile: dict,
    current_medications: list[str] | None = None,
    prior_failures: list[str] | None = None,
) -> dict:
    """
    Execute the full 4-agent Gut Instinct pipeline.

    Parameters
    ----------
    diagnosis : str
        Psychiatric diagnosis (e.g. "Major Depressive Disorder").
    microbiome_profile : dict
        Patient microbiome profile dict (loaded from a demo JSON file).
    current_medications : list[str], optional
        Medications the patient is currently taking.
    prior_failures : list[str], optional
        Medications that previously failed for this patient.

    Returns
    -------
    dict
        Keys: status, agent1_output, agent2_output, agent3_output,
        agent4_output, recommendation.
    """
    client = _configure_client()

    current_medications = current_medications or []
    prior_failures = prior_failures or []

    # Load all four agent prompts
    prompts = {
        "agent1": _load_prompt("agent1_prompt.txt"),
        "agent2": _load_prompt("agent2_prompt.txt"),
        "agent3": _load_prompt("agent3_prompt.txt"),
        "agent4": _load_prompt("agent4_prompt.txt"),
    }

    results: dict = {}

    try:
        # ── Agent 1: Pharmacokinetic Mapper ──────────────────────────────
        agent1_input = json.dumps(
            {
                "diagnosis": diagnosis,
                "specific_drugs": [],
                "current_medications": current_medications,
                "prior_failures": prior_failures,
            }
        )
        results["agent1_output"] = _call_agent(client, prompts["agent1"], agent1_input)

        # ── Agent 2: Ortholog Hunter ─────────────────────────────────────
        agent2_input = json.dumps(
            {
                "agent1_output": results["agent1_output"],
                "microbiome_profile": microbiome_profile,
            }
        )
        results["agent2_output"] = _call_agent(client, prompts["agent2"], agent2_input)

        # ── Agent 3: Graph Architect ─────────────────────────────────────
        agent3_input = json.dumps(
            {
                "agent1_output": results["agent1_output"],
                "agent2_output": results["agent2_output"],
            }
        )
        results["agent3_output"] = _call_agent(client, prompts["agent3"], agent3_input)

        # ── Agent 4: Clinical Interpreter ────────────────────────────────
        agent4_input = json.dumps(
            {
                "agent3_output": results["agent3_output"],
                "clinical_context": {
                    "diagnosis": diagnosis,
                    "current_medications": current_medications,
                    "prior_failures": prior_failures,
                    "patient_notes": microbiome_profile.get(
                        "profile_description", ""
                    ),
                },
            }
        )
        results["agent4_output"] = _call_agent(client, prompts["agent4"], agent4_input)
        results["recommendation"] = results["agent4_output"]
        results["status"] = "success"

    except Exception as exc:
        results["status"] = "error"
        results["error"] = str(exc)

    return results
