from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from analyzer import analyze_resume, match_jobs

app = FastAPI(title="AI Resume Analyzer & Job Matcher")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobMatchRequest(BaseModel):
    resume_text: str

@app.get("/")
def root():
    return {"message": "Resume Analyzer API is running!"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    contents = await file.read()
    result = analyze_resume(contents)
    return result

@app.post("/match")
async def match(request: JobMatchRequest):
    result = match_jobs(request.resume_text)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
