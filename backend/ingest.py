import glob, json, os, re
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("intfloat/multilingual-e5-small")

def chunk(text):
    parts = re.split(r"\n(?=## )", text)
    return [p.strip() for p in parts if len(p.strip()) > 50]

chunks = []
for path in glob.glob("data/diseases/*.md"):
    disease = os.path.basename(path).replace(".md", "")
    text = open(path, encoding="utf-8").read()
    for c in chunk(text):
        chunks.append({"disease": disease, "text": c})
    print("Read", disease)

embs = model.encode(["passage: " + c["text"] for c in chunks], normalize_embeddings=True)
np.save("index_embeddings.npy", embs)
json.dump(chunks, open("index_chunks.json", "w"), ensure_ascii=False)
print("Total chunks:", len(chunks))
