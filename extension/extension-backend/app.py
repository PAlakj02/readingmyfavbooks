from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import os
import re
from dotenv import load_dotenv
import os

load_dotenv()

LLAMA_MODEL_PATH = os.getenv("MODEL_PATH")

app = Flask(__name__)
CORS(app)


# === Load LLaMA Model ===
print("🔁 Loading model... This may take a minute.")
try:
    llm = Llama(
        model_path=LLAMA_MODEL_PATH,
        n_ctx=2048,
        n_threads=8,
        use_mmap=False  # Needed for Windows (bypasses PrefetchVirtualMemory)
    )
    print("✅ Model loaded!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    raise

# === Text Cleaner (optional) ===
def clean_text(text):
    text = re.sub(r"\[\d+\]", "", text)  # remove Wikipedia-style citations [1], [12]
    text = re.sub(r"\s+", " ", text)     # collapse whitespace
    return text.strip()

# === Prompt Builder ===
def build_prompt(text):
    cleaned = clean_text(text[:4000])  # truncate safely within context window
    return f"""You are a helpful assistant.

Read the following article and summarize it in exactly 3 to 5 bullet points.

Only return bullet points, no explanations or intros.

Article:
\"\"\"
{cleaned}
\"\"\"
"""

# === Bullet Extractor (optional post-processing) ===
def extract_bullets(raw_output):
    bullets = re.findall(r'^\* .*', raw_output, re.MULTILINE)
    return "\n".join(bullets).strip() if bullets else raw_output.strip()

# === API Endpoint ===
@app.route("/scrape", methods=["POST"])
def receive_scraped_data():
    data = request.get_json()

    if not data or 'text' not in data or 'title' not in data or 'url' not in data:
        return jsonify({
            "success": False,
            "error": "Missing fields: 'text', 'title', or 'url'."
        }), 400

    text = data['text']
    prompt = build_prompt(text)

    print(f"🧠 Summarizing: {data['title']} ({len(text)} chars)")

    try:
        result = llm(
            prompt,
            max_tokens=512,
            temperature=0.7,
            top_p=0.9,
            top_k=40,
            stop=["</s>"]
        )
        raw_output = result["choices"][0]["text"]
        summary = extract_bullets(raw_output)
    except Exception as e:
        print(f"🔥 LLM error: {e}")
        return jsonify({
            "success": False,
            "summary": "",
            "error": f"LLM failed: {str(e)}"
        }), 500

    return jsonify({
        "success": True,
        "summary": summary,
        "meta": {
            "title": data['title'],
            "url": data['url'],
            "length": len(text)
        }
    })

# === Run Server ===
if __name__ == "__main__":
    app.run(port=8080)
