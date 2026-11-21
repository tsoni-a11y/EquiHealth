from fastapi import FastAPI
from pydantic import BaseModel

from rag import answer

app = FastAPI()


class Ask(BaseModel):
    question: str
    conditions: list[str] | None = None  # e.g. ["diabetes", "hypertension"]


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/ask")
def ask(body: Ask):
    return answer(body.question, body.conditions)
