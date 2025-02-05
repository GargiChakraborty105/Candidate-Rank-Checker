# Candidate Ranking API

## Overview
This FastAPI-based application ranks job candidates by comparing their resumes against a given job description (JD). It utilizes Natural Language Processing (NLP) techniques to extract candidate names from resumes and computes similarity scores using Sentence Transformers. The results include ranked candidates with their confidence scores and resume links.

## Features
- Accepts a JD PDF and multiple resume PDFs as input.
- Extracts text from PDFs using `PyPDF2`.
- Embeds text using `SentenceTransformers` (`all-MiniLM-L6-v2` model).
- Computes cosine similarity between the JD and resumes.
- Uses `spaCy` Named Entity Recognition (NER) to extract candidate names.
- Ranks candidates based on similarity scores.
- Returns structured JSON output with names, resume links, confidence scores, and ranks.

## Installation
### Prerequisites
- Python 3.8+
- Virtual environment (optional but recommended)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/candidate-ranking-app.git
   cd candidate-ranking-app
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Download the spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

## Running the Application
Start the FastAPI server:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoint
### Rank Candidates
**Endpoint:** `POST /rank-candidates/`

**Request:**
- `jd`: Job Description PDF file (Required)
- `resumes`: List of resume PDF files (Required)

**Example (Postman Request Form-Data):**
- `jd`: `job_description.pdf`
- `resumes`: `resume1.pdf`, `resume2.pdf`

**Response Format:**
```json
{
    "candidates": [
        {
            "Name": "Debojyoti Bhuinya",
            "Resume": "/uploads/Debojyoti_Bhuinya_Resume.pdf",
            "Confidence Score": 0.654,
            "Rank": 1
        },
        {
            "Name": "Gargi Chakraborty",
            "Resume": "/uploads/RESUME.pdf",
            "Confidence Score": 0.5622,
            "Rank": 2
        }
    ]
}
```

## Dependencies
- `fastapi`
- `uvicorn`
- `sentence-transformers`
- `PyPDF2`
- `spaCy`

## License
This project is licensed under the MIT License.

## Author
Your Name - [Your GitHub](https://github.com/yourusername)

