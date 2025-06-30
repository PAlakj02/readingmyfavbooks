from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import os
import re
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# === Load LLaMA Model ===
LLAMA_MODEL_PATH = os.getenv("MODEL_PATH")
if not LLAMA_MODEL_PATH:
    raise ValueError("❌ MODEL_PATH not set in .env")

print("🔁 Loading model...")
try:
    llm = Llama(
        model_path=LLAMA_MODEL_PATH,
        n_ctx=2048,
        n_threads=8,
        use_mmap=False  # Keep your Windows fix
    )
    print("✅ Model loaded!")
except Exception as e:
    print(f"❌ Model load failed: {e}")
    raise

# === Text Cleaner (Keep exactly as you had it) ===
def clean_text(text):
    text = re.sub(r"\[\d+\]", "", text)  # Your Wikipedia citation remover
    text = re.sub(r"\s+", " ", text)     # Your whitespace fix
    return text.strip()

# === Prompt Builder (Unchanged) ===
def build_prompt(text):
    cleaned = clean_text(text[:4000])  # Your truncation logic
    return f"""You are a helpful assistant.

Read the following article and summarize it in exactly 3 to 5 bullet points.

Only return bullet points, no explanations or intros.

Article:
\"\"\"
{cleaned}
\"\"\"
"""

# === Bullet Extractor (Keep your working version) ===
def extract_bullets(raw_output):
    bullets = re.findall(r'^\* .*', raw_output, re.MULTILINE)
    return "\n".join(bullets).strip() if bullets else raw_output.strip()

# === API Endpoint (Only critical fixes) ===
@app.route("/scrape", methods=["POST"])
def receive_scraped_data():
    # Your original input check (just made more explicit)
    if not request.json or 'text' not in request.json or 'title' not in request.json or 'url' not in request.json:
        return jsonify({"success": False, "error": "Missing text/title/url"}), 400

    try:
        # Your original summarization flow
        prompt = build_prompt(request.json['text'])
        result = llm(
            prompt,
            max_tokens=444,
            temperature=0.7,
            top_p=0.9,
            top_k=40,
            stop=["</s>"]
        )
        raw_output = result["choices"][0]["text"]
        summary = extract_bullets(raw_output)  # Your bullet extractor stays!

        return jsonify({
            "success": True,
            "summary": summary,
            "meta": {
                "title": request.json['title'],
                "url": request.json['url'],
                "length": len(request.json['text'])
            }
        })

    except Exception as e:
        print(f"🔥 Error: {e}")
        return jsonify({"success": False, "error": "Summary failed"}), 500

if __name__ == "__main__":
    app.run(port=8080)