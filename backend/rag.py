import json
import os

import numpy as np
from dotenv import load_dotenv
from google import genai
from google.genai import types
from sentence_transformers import SentenceTransformer

load_dotenv()

# If this model name doesn't work for your key, change it to one listed in AI Studio.
MODEL = "gemini-3.5-flash"

model = SentenceTransformer("intfloat/multilingual-e5-small")
embs = np.load("index_embeddings.npy")
chunks = json.load(open("index_chunks.json", encoding="utf-8"))
llm = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Tune this using your test questions. Lower distance = closer match.
MAX_DISTANCE = 0.25

SYSTEM = """You are EquiHealth's health information assistant for older South Asian adults.
Rules:
- Answer ONLY using the provided context. If the context doesn't contain the answer, say you
  don't have that information and suggest asking their doctor or pharmacist.
- Never diagnose, and never recommend starting, stopping, or changing a medication or dose.
- Use short sentences and plain words, no medical jargon. Explain any medical term you must use.
- Keep answers under 120 words. Do not use markdown symbols like ** or #. Use plain text, and for lists put each item on its own line starting with a dash.
- Only state facts that appear in the context for the specific condition being asked about. Do not mix advice from different conditions.
- Reply in the language the user wrote in (Hindi, Telugu, Marathi, Tamil, Gujarati, or English).
- If the user describes an emergency (chest pain, trouble breathing, stroke signs, very low or
  very high blood sugar with confusion), tell them to call 911 or go to the ER immediately.
- Where relevant, suggest culturally familiar food options (e.g. millets) over foreign ones."""

FALLBACK = (
    "I don't have information on that. Please ask your doctor or pharmacist. "
    "If this is an emergency, call 911."
)


def retrieve(question, conditions=None, k=4):
    q = model.encode("query: " + question, normalize_embeddings=True)
    sims = embs @ q
    docs, dists = [], []
    for idx in np.argsort(-sims):
        if conditions and chunks[idx]["disease"] not in conditions:
            continue
        docs.append(chunks[idx]["text"])
        dists.append(1 - float(sims[idx]))
        if len(docs) == k:
            break
    return docs, dists


EMERGENCY_WORDS = [
    "chest pain", "cannot breathe", "can't breathe", "trouble breathing",
    "shortness of breath", "heart attack", "stroke", "face drooping",
    "slurred speech", "unconscious", "passed out", "fainted", "seizure",
    "severe bleeding", "overdose",
    "सीने में दर्द", "सांस नहीं", "सांस लेने में तकलीफ", "बेहोश", "दौरा",
]
SELF_HARM_WORDS = [
    "suicide", "suicidal", "kill myself", "want to die", "end my life",
    "आत्महत्या", "मरना चाहता", "मरना चाहती",
]
EMERGENCY_REPLY = (
    "This may be an emergency. Call 911 or go to the nearest emergency room right now. "
    "Do not wait. If someone is with you, ask them to help you."
)
SELF_HARM_REPLY = (
    "I am sorry you are feeling this way. You are not alone, and help is available right now. "
    "Please call or text 988 (Suicide and Crisis Lifeline in the US). "
    "If you are in danger, call 911."
)


def check_emergency(question):
    q = question.lower()
    if any(w in q for w in SELF_HARM_WORDS):
        return SELF_HARM_REPLY
    if any(w in q for w in EMERGENCY_WORDS):
        return EMERGENCY_REPLY
    if ("confus" in q or "dizzy" in q) and ("sugar" in q or "glucose" in q):
        return EMERGENCY_REPLY
    return None


def answer(question, conditions=None):
    emergency = check_emergency(question)
    if emergency:
        return {"answer": emergency, "sources": []}
    docs, dists = retrieve(question, conditions)
    print("distances:", [round(d, 3) for d in dists])

    if not docs or dists[0] > MAX_DISTANCE:
        return {"answer": FALLBACK, "sources": []}

    context = "\n\n---\n\n".join(docs)
    response = llm.models.generate_content(
        model=MODEL,
        contents=f"Context:\n{context}\n\nQuestion: {question}",
        config=types.GenerateContentConfig(system_instruction=SYSTEM),
    )
    return {"answer": response.text, "sources": docs}
