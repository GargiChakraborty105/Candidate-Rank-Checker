from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
import numpy as np
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI app
app = FastAPI()
# Add middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load a pre-trained model for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_text_from_pdf(pdf_file) -> str:
    """Extract text from an uploaded PDF file."""
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def calculate_similarity(jd_embedding, resume_embeddings):
    """Calculate cosine similarity between JD embedding and resume embeddings."""
    similarities = np.dot(resume_embeddings, jd_embedding) / (
        np.linalg.norm(resume_embeddings, axis=1) * np.linalg.norm(jd_embedding)
    )
    return similarities

@app.post("/rank-candidates/")
async def rank_candidates(
    jd: UploadFile = File(...),
    resumes: List[UploadFile] = File(...)
):
    try:
        # Validate inputs
        if jd.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Job description file must be a PDF.")

        for resume in resumes:
            if resume.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail=f"Resume file '{resume.filename}' must be a PDF.")

        # Extract text from JD
        jd_text = extract_text_from_pdf(jd.file)
        jd_embedding = model.encode(jd_text, convert_to_tensor=True)

        candidates = []
        resume_embeddings = []

        # Process each resume
        for resume in resumes:
            resume_text = extract_text_from_pdf(resume.file)
            resume_embedding = model.encode(resume_text, convert_to_tensor=True)
            resume_embeddings.append(resume_embedding)

            candidates.append({
                "Name": resume.filename.rsplit('.', 1)[0],  # Use filename as candidate name
                "Resume": resume.filename
            })

        resume_embeddings = np.array(resume_embeddings)
        similarity_scores = calculate_similarity(jd_embedding, resume_embeddings)

        # Add similarity scores and ranks
        for i, score in enumerate(similarity_scores):
            candidates[i]["Confidence_Score"] = round(float(score), 4)*100

        # Rank candidates based on scores
        ranked_candidates = sorted(candidates, key=lambda x: x["Confidence_Score"], reverse=True)
        for rank, candidate in enumerate(ranked_candidates, start=1):
            candidate["Rank"] = rank
            candidate["Confidence_Score"] = f'{candidate["Confidence_Score"]}%'

        # Add URLs for resumes (assuming a predefined storage path)
        for candidate in ranked_candidates:
            candidate["Resume"] = f"/uploads/{candidate['Resume']}"
        print(ranked_candidates)
        return {"candidates": ranked_candidates}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Entry point for running the application
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
