"""
models.py - Pydantic models for Gut Instinct API request and response schemas.
"""

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    """Request body for the /analyze endpoint."""

    diagnosis: str = Field(
        ..., description="Psychiatric diagnosis, e.g. 'Major Depressive Disorder'"
    )
    patient_profile_id: str = Field(
        ...,
        description="ID of a demo profile to load from demo_profiles/, e.g. 'patient1_mdd_dysbiosis'",
    )
    current_medications: list[str] = Field(
        default_factory=list, description="List of current medications"
    )
    prior_failures: list[str] = Field(
        default_factory=list, description="List of previously failed medications"
    )


class AnalyzeResponse(BaseModel):
    """Response body returned by the /analyze endpoint."""

    status: str = Field(..., description="Pipeline execution status")
    agent1_output: dict | None = Field(
        None, description="Pharmacokinetic Mapper output"
    )
    agent2_output: dict | None = Field(None, description="Ortholog Hunter output")
    agent3_output: dict | None = Field(None, description="Graph Architect output")
    agent4_output: dict | None = Field(
        None, description="Clinical Interpreter output"
    )
    recommendation: dict | None = Field(
        None, description="Final clinical recommendation (same as agent4_output)"
    )
    # Frontend-compatible fields (formatted from raw agent outputs)
    taxa: list | None = Field(None, description="Microbiome taxa with GUS/CYP annotations")
    drug_scores: list | None = Field(None, description="Drug interference scores for charts")
    graph: dict | None = Field(None, description="Bipartite interaction graph for network viz")
    error: str | None = Field(None, description="Error message if pipeline failed")
