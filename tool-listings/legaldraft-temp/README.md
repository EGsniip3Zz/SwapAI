# LegalDraft AI - AI Contract & Legal Document Generator

LegalDraft AI uses GPT-4 to automatically generate legally compliant contract and legal documents from customizable templates.

## Features

- **Multiple Document Types**: NDA, Employment Agreements, SaaS Terms, Freelancer Contracts
- **Template Customization**: JSON-based templates with variable placeholders
- **PDF Export**: Automatically convert documents to professional PDFs
- **Compliance Notes**: Built-in compliance checks for various jurisdictions
- **REST API**: Full API for integration with your applications

## System Requirements

- Python 3.8+
- OpenAI API key (GPT-4 model access required)
- 512MB RAM minimum
- Internet connection for API calls

## Installation

1. Clone or extract the project files
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key and settings
   ```

## Usage

### Command Line
```bash
python generate.py --type nda --party-a "Company A Inc" --party-b "Contractor" --jurisdiction "US-CA"
```

### API Server
```bash
python -m uvicorn api.server:app --reload
```

Visit `http://localhost:8000/docs` for interactive API documentation.

### API Endpoints

- **POST /generate** - Generate document from template
  - Request: `{"document_type": "nda", "variables": {...}}`
  - Response: Generated document text and metadata

- **GET /templates** - List available templates

- **POST /export-pdf** - Convert document to PDF
  - Request: `{"content": "...", "filename": "..."}`
  - Response: PDF file

## Template Customization

Templates use Jinja2 syntax with variable placeholders:

```json
{
  "name": "NDA",
  "variables": ["party_a", "party_b", "effective_date", "jurisdiction"],
  "template": "This Non-Disclosure Agreement ('Agreement') is entered into as of {{ effective_date }} between {{ party_a }} and {{ party_b }}..."
}
```

## Compliance Notes

- NDA templates comply with US, UK, and EU standards
- Employment agreements follow FLSA guidelines (US focus)
- SaaS terms include GDPR compliance sections for EU customers
- All templates include jurisdiction-specific clauses
- Always have a legal professional review before use

## Security

- API keys are never logged or stored
- Documents are processed server-side only
- No data retention on servers (configure your OpenAI data policy)
- HTTPS required for production deployment

## Troubleshooting

**"OpenAI API key not found"**
- Ensure .env file exists and OPENAI_API_KEY is set
- Check API key validity at https://platform.openai.com

**"Rate limit exceeded"**
- OpenAI has usage limits; wait before retrying
- Consider upgrading API tier for higher limits

**"PDF export failed"**
- Ensure reportlab is installed: `pip install reportlab`
- Check document content for special characters

## Support

For issues, check the templates directory structure and ensure all required fields are populated.

## License

Commercial License - See LICENSE file
