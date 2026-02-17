"""
FastAPI server for LegalDraft AI document generation.

Provides REST API endpoints for generating, managing, and exporting legal documents.
"""

import json
import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Import document generator
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
from generate import LegalDocumentGenerator
from utils.pdf_export import PDFExporter


load_dotenv()


# Pydantic models
class GenerateRequest(BaseModel):
    """Request model for document generation."""
    document_type: str
    variables: dict
    enhance: bool = True


class ExportPDFRequest(BaseModel):
    """Request model for PDF export."""
    content: str
    filename: str = "document.pdf"


class TemplateInfo(BaseModel):
    """Information about a template."""
    name: str
    description: str
    required_variables: list
    optional_variables: list


# Initialize FastAPI app
app = FastAPI(
    title="LegalDraft AI API",
    description="AI-powered legal document generation API",
    version="1.0.0"
)

# Initialize components
try:
    doc_generator = LegalDocumentGenerator()
    pdf_exporter = PDFExporter()
except Exception as e:
    print(f"Initialization error: {e}")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "LegalDraft AI",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "/generate",
            "/templates",
            "/export-pdf",
            "/docs"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "api_connected": bool(doc_generator.api_key),
        "templates_available": len(doc_generator.SUPPORTED_TYPES)
    }


@app.get("/templates", response_model=dict)
async def list_templates():
    """
    Get list of available templates.
    
    Returns:
        Dictionary with template information
    """
    templates = {}
    try:
        for doc_type in doc_generator.SUPPORTED_TYPES:
            template = doc_generator.load_template(doc_type)
            templates[doc_type] = {
                "name": template.get("name"),
                "description": template.get("description"),
                "required_variables": template.get("required_variables", []),
                "optional_variables": template.get("optional_variables", [])
            }
        return {"templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate")
async def generate_document(request: GenerateRequest):
    """
    Generate a legal document.
    
    Args:
        request: GenerateRequest with document type, variables, and options
        
    Returns:
        Generated document with metadata
    """
    try:
        result = doc_generator.generate(
            doc_type=request.document_type,
            variables=request.variables,
            enhance=request.enhance
        )
        return {
            "success": True,
            "type": result["type"],
            "jurisdiction": result["jurisdiction"],
            "content": result["content"],
            "variables_used": result["variables_used"]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.post("/export-pdf")
async def export_to_pdf(request: ExportPDFRequest):
    """
    Export document content to PDF.
    
    Args:
        request: ExportPDFRequest with content and filename
        
    Returns:
        PDF file
    """
    try:
        pdf_path = pdf_exporter.create_pdf(request.content, request.filename)
        
        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename=request.filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")


@app.post("/validate-variables")
async def validate_variables(document_type: str, variables: dict):
    """
    Validate that required variables are present.
    
    Args:
        document_type: Type of document
        variables: Dictionary of variables to validate
        
    Returns:
        Validation result
    """
    try:
        doc_generator.validate_variables(document_type, variables)
        return {
            "valid": True,
            "message": "All required variables present"
        }
    except ValueError as e:
        return {
            "valid": False,
            "error": str(e)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/document-types")
async def get_document_types():
    """Get list of supported document types."""
    return {
        "types": doc_generator.SUPPORTED_TYPES,
        "count": len(doc_generator.SUPPORTED_TYPES)
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__}
    )


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
