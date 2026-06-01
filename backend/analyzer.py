import os
import io
import json
import numpy as np
import faiss
from pypdf import PdfReader
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ── Helper: extract text from PDF ──────────────────────────────────────────
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()

# ── Helper: call GPT ────────────────────────────────────────────────────────
def ask_gpt(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()

# ── Helper: get embedding ───────────────────────────────────────────────────
def get_embedding(text: str) -> list:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text[:8000],  # stay within token limit
    )
    return response.data[0].embedding

# ── Analyze Resume ──────────────────────────────────────────────────────────
def analyze_resume(pdf_bytes: bytes) -> dict:
    resume_text = extract_text_from_pdf(pdf_bytes)
    if not resume_text:
        return {"error": "Could not extract text from PDF."}

    prompt = f"""
You are an expert resume analyzer and career coach.
Analyze the following resume and return a JSON object with exactly these fields:
- name: candidate full name (string)
- summary: 2-3 sentence professional summary (string)
- skills: list of top 8 technical skills (list of strings)
- experience_years: estimated years of experience (number)
- strengths: list of 3 strengths (list of strings)
- weaknesses: list of 2 areas to improve (list of strings)
- score: resume quality score out of 100 (number)
- suggestions: list of 3 specific actionable suggestions to improve the resume (list of strings)

Resume:
{resume_text}

Return ONLY valid JSON. No markdown, no explanation, no code blocks.
"""
    raw = ask_gpt(prompt)

    # Clean up if GPT wraps in markdown
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    
    try:
        analysis = json.loads(raw.strip())
    except Exception:
        analysis = {"raw_response": raw}

    analysis["resume_text"] = resume_text
    return analysis


# ── Sample Job Descriptions ─────────────────────────────────────────────────
JOBS = [
    {
        "title": "AI Engineer",
        "company": "Google",
        "description": "Build and deploy LLM-based applications. Experience with Python, LangChain, RAG pipelines, OpenAI APIs, and cloud platforms required. React and REST APIs are a plus."
    },
    {
        "title": "Full Stack Developer",
        "company": "Amazon",
        "description": "Develop scalable web applications using React, Node.js, and Spring Boot. Experience with AWS services like Lambda, S3, and API Gateway is essential."
    },
    {
        "title": "ML Engineer",
        "company": "Meta",
        "description": "Design and train deep learning models using PyTorch and TensorFlow. Strong background in NLP, model deployment with Docker and Kubernetes, and MLOps practices."
    },
    {
        "title": "Backend Engineer",
        "company": "Netflix",
        "description": "Build microservices using Java and Spring Boot. Experience with Apache Kafka, distributed systems, PostgreSQL, and CI/CD pipelines required."
    },
    {
        "title": "GenAI Developer",
        "company": "Microsoft",
        "description": "Build generative AI solutions using Azure OpenAI, LangChain, and vector databases. Full-stack experience with Python and React preferred."
    },
    {
        "title": "Data Engineer",
        "company": "Uber",
        "description": "Design data pipelines using Apache Spark and Hadoop. Strong SQL skills, experience with Snowflake, MongoDB, and Python scripting required."
    },
]

# ── Match Jobs using FAISS ──────────────────────────────────────────────────
def match_jobs(resume_text: str) -> dict:
    # Embed resume
    resume_vec = np.array([get_embedding(resume_text)], dtype="float32")

    # Embed all jobs
    job_texts = [f"{j['title']} at {j['company']}: {j['description']}" for j in JOBS]
    job_vecs = np.array([get_embedding(t) for t in job_texts], dtype="float32")

    # FAISS cosine similarity
    dimension = resume_vec.shape[1]
    index = faiss.IndexFlatIP(dimension)
    faiss.normalize_L2(resume_vec)
    faiss.normalize_L2(job_vecs)
    index.add(job_vecs)

    distances, indices = index.search(resume_vec, k=3)

    matches = []
    for rank, (dist, idx) in enumerate(zip(distances[0], indices[0])):
        job = JOBS[idx]
        score = round(float(dist) * 100, 1)

        prompt = f"""
You are a career advisor. Based on this resume and job description, respond in JSON with:
- "match_reason": 1 sentence why this is a good match
- "skill_gap": 1 sentence on what skill is missing (or "No major gaps identified.")

Resume (excerpt):
{resume_text[:600]}

Job: {job['title']} at {job['company']}
Description: {job['description']}

Return ONLY valid JSON. No markdown.
"""
        try:
            raw = ask_gpt(prompt)
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            explanation = json.loads(raw.strip())
        except Exception:
            explanation = {
                "match_reason": "Strong skill alignment detected.",
                "skill_gap": "No major gaps identified."
            }

        matches.append({
            "rank": rank + 1,
            "title": job["title"],
            "company": job["company"],
            "match_score": score,
            "match_reason": explanation.get("match_reason", ""),
            "skill_gap": explanation.get("skill_gap", ""),
        })

    return {"matches": matches}
