# FluentFlow 🎙️
## AI-Powered IELTS Speaking Simulator | Infomatrix Asia 2026

FluentFlow is a real-time, low-latency web application designed to simulate the official IELTS Speaking test. Unlike standard chatbots, FluentFlow enforces the strict 3-part structure of the IELTS exam and utilizes a network of parallel AI agents to evaluate candidates on Fluency, Lexical Resource, Grammatical Range, and Pronunciation.

🚀 Key Features
Low Latency Voice Chat: Bidirectional audio streaming via WebSockets, powered by Groq's LPU hardware, ensuring natural human-like response times (<1000ms).

Stateful Exam Logic: LangGraph state machines enforce strict exam rules, including the 1-minute prep and 2-minute speaking timer in Part 2.

Parallel AI Grading: 4 specialized AI agents run simultaneously in the background (via Celery) to analyze transcripts and generate criterion-based Band Scores (1-9) in seconds.

Comprehensive Feedback: Detailed CEFR vocabulary analysis, grammar corrections, and actionable improvement recommendations.

🧠 System Architecture
The system operates on a microservices-oriented architecture to decouple heavy AI inference from the user interface:

Client Layer: Captures audio using the MediaStream API and streams binary chunks over WebSockets.

Orchestration Layer: A highly concurrent FastAPI server manages the state graph and routes data to LLMs.

Inference Layer: Audio is transcribed by Whisper, processed by Llama 3.3 70B, and synthesized back to speech via ElevenLabs.

🛠️ Tech Stack
Frontend:

Next.js 14 (React)

TypeScript

TailwindCSS

Backend:

Python 3.10+

FastAPI & Uvicorn (Asynchronous REST & WebSockets)

Celery & Redis (Background Task Processing)

AI & Data:

LLM / ASR: Meta Llama 3.3 70B & OpenAI Whisper-large-v3 (via Groq API)

TTS: OpenAI TTS

Agent Framework: LangChain & LangGraph

Database / Storage: PostgreSQL & Cloudflare R2

