# 🤖 AI Resume Analyzer & Job Matcher

An AI-powered web app that analyzes your resume and matches you with top jobs using **OpenAI GPT-4o-mini**, **FAISS vector search**, **FastAPI**, and **React**.

## 🚀 Features
- Upload resume (PDF)
- AI resume score out of 100
- Strengths, weaknesses & improvement tips
- Top 3 job matches with match % using semantic search

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Python, FastAPI |
| AI / LLM | OpenAI GPT-4o-mini |
| Vector Search | FAISS |
| Embeddings | OpenAI text-embedding-3-small |
| PDF Parsing | PyPDF |

## ⚙️ Setup

### Step 1 — Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```
Open `backend/.env` and paste your key:
```
OPENAI_API_KEY=sk-your-key-here
```
Run backend:
```bash
python main.py
```

### Step 2 — Frontend
```bash
cd frontend
npm install
npm start
```

Open browser at `http://localhost:3000` ✅

## 🔒 Note
Never push your `.env` file to GitHub — it's already in `.gitignore`
