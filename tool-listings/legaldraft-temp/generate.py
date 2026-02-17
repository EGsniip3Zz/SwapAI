"""
LegalDraft AI - Legal Document Generator

Generates legally compliant documents using GPT-4 and customizable templates.
"""

import argparse
import json
import os
from pathlib import Path
from typing import Dict, Any, Optional

import openai
from jinja2 import Environment, FileSystemLoader, TemplateNotFound
from dotenv import load_dotenv


class LegalDocumentGenerator:
    """Generates legal documents from templates using GPT-4."""
    
    SUPPORTED_TYPES = ["nda", "employment", "saas_terms", "freelancer_contract"]
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the document generator.
        
        Args:
            api_key: OpenAI API key. If not provided, reads from environment.
        """
        load_dotenv()
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment")
        
        openai.api_key = self.api_key
        self.templates_dir = Path(__file__).parent / "templates"
        self.jinja_env = Environment(loader=FileSystemLoader(self.templates_dir))
        self.company_name = os.getenv("COMPANY_NAME", "Your Company")
        self.default_jurisdiction = os.getenv("DEFAULT_JURISDICTION", "US-CA")
    
    def load_template(self, doc_type: str) -> Dict[str, Any]:
        """
        Load a template from the templates directory.
        
        Args:
            doc_type: Type of document (nda, employment, etc.)
            
        Returns:
            Dictionary containing template configuration
        """
        if doc_type not in self.SUPPORTED_TYPES:
            raise ValueError(f"Unsupported document type: {doc_type}")
        
        template_path = self.templates_dir / f"{doc_type}.json"
        if not template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_path}")
        
        with open(template_path, 'r') as f:
            return json.load(f)
    
    def validate_variables(self, doc_type: str, variables: Dict[str, Any]) -> bool:
        """
        Validate that all required variables are provided.
        
        Args:
            doc_type: Type of document
            variables: Dictionary of provided variables
            
        Returns:
            True if all required variables present
        """
        template = self.load_template(doc_type)
        required = set(template.get("required_variables", []))
        provided = set(variables.keys())
        
        missing = required - provided
        if missing:
            raise ValueError(f"Missing required variables: {missing}")
        
        return True
    
    def render_template(self, doc_type: str, variables: Dict[str, Any]) -> str:
        """
        Render template with provided variables.
        
        Args:
            doc_type: Type of document
            variables: Dictionary of template variables
            
        Returns:
            Rendered template string
        """
        self.validate_variables(doc_type, variables)
        template = self.load_template(doc_type)
        
        # Add defaults
        variables.setdefault("company_name", self.company_name)
        variables.setdefault("jurisdiction", self.default_jurisdiction)
        
        jinja_template = self.jinja_env.from_string(template["template"])
        return jinja_template.render(**variables)
    
    def enhance_with_gpt4(self, content: str, enhancements: Optional[Dict[str, str]] = None) -> str:
        """
        Use GPT-4 to enhance or review document content.
        
        Args:
            content: Raw document content
            enhancements: Optional dict with keys like 'tone', 'length', 'specifics'
            
        Returns:
            Enhanced document content
        """
        enhancements = enhancements or {}
        tone = enhancements.get("tone", "professional and formal")
        
        prompt = f"""You are a legal document expert. Review and enhance the following document draft.
        
Ensure it:
- Maintains {tone} tone
- Includes all necessary legal clauses
- Is clear and unambiguous
- Complies with standard legal practices

Document:
{content}

Please provide the enhanced version only, without explanations."""
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert legal document reviewer and editor."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=4000
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Warning: GPT-4 enhancement failed: {e}")
            return content
    
    def generate(
        self,
        doc_type: str,
        variables: Dict[str, Any],
        enhance: bool = True
    ) -> Dict[str, Any]:
        """
        Generate a complete legal document.
        
        Args:
            doc_type: Type of document to generate
            variables: Dictionary of template variables
            enhance: Whether to use GPT-4 for enhancement
            
        Returns:
            Dictionary with generated content and metadata
        """
        # Render template
        content = self.render_template(doc_type, variables)
        
        # Enhance with GPT-4 if requested
        if enhance:
            content = self.enhance_with_gpt4(content)
        
        return {
            "type": doc_type,
            "content": content,
            "variables_used": variables,
            "jurisdiction": variables.get("jurisdiction", self.default_jurisdiction),
            "generated_by": "LegalDraft AI"
        }


def main():
    """Command-line interface for document generation."""
    parser = argparse.ArgumentParser(description="Generate legal documents with AI")
    parser.add_argument("--type", required=True, choices=LegalDocumentGenerator.SUPPORTED_TYPES,
                       help="Type of document to generate")
    parser.add_argument("--party-a", help="First party name (for contracts)")
    parser.add_argument("--party-b", help="Second party name (for contracts)")
    parser.add_argument("--effective-date", help="Effective date")
    parser.add_argument("--jurisdiction", default="US-CA", help="Jurisdiction")
    parser.add_argument("--employee-name", help="Employee name (for employment agreements)")
    parser.add_argument("--position", help="Job position")
    parser.add_argument("--salary", help="Annual salary")
    parser.add_argument("--output", help="Output file path")
    parser.add_argument("--no-enhance", action="store_true", help="Skip GPT-4 enhancement")
    
    args = parser.parse_args()
    
    try:
        generator = LegalDocumentGenerator()
        
        # Build variables dict
        variables = {}
        if args.party_a:
            variables["party_a"] = args.party_a
        if args.party_b:
            variables["party_b"] = args.party_b
        if args.effective_date:
            variables["effective_date"] = args.effective_date
        if args.jurisdiction:
            variables["jurisdiction"] = args.jurisdiction
        if args.employee_name:
            variables["employee_name"] = args.employee_name
        if args.position:
            variables["position"] = args.position
        if args.salary:
            variables["salary"] = args.salary
        
        # Generate document
        result = generator.generate(args.type, variables, enhance=not args.no_enhance)
        
        # Output
        if args.output:
            with open(args.output, 'w') as f:
                f.write(result["content"])
            print(f"Document saved to {args.output}")
        else:
            print(result["content"])
    
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
