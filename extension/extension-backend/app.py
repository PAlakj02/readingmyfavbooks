from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import os
import re
from dotenv import load_dotenv
from threading import local
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging

# --- Configuration ---
load_dotenv()
LLAMA_MODEL_PATH = os.getenv("MODEL_PATH")
assert LLAMA_MODEL_PATH, "MODEL_PATH not set in .env"

app = Flask(__name__)
CORS(app)  # Configure in production: CORS(app, origins=["http://localhost:3000"])

# --- Rate Limiting ---
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# --- Logging ---
logging.basicConfig(
    filename='llm_service.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# --- Thread-Safe Model Loading ---
thread_local = local()

def get_llm():
    if not hasattr(thread_local, 'llm'):
        logging.info("Loading LLaMA model...")
        thread_local.llm = Llama(
            model_path=LLAMA_MODEL_PATH,
            n_ctx=2048,
            n_threads=4,  # Optimal for most CPUs
            use_mmap=False
        )
    return thread_local.llm

# --- Security Middleware ---
@app.before_request
def restrict_remote():
    if request.remote_addr not in ['127.0.0.1', '::1']:
        logging.warning(f"Blocked non-local request from {request.remote_addr}")
        return jsonify({"error": "Forbidden"}), 403

# --- Helper Functions ---
def clean_text(text):
    """Sanitize input text"""
    text = re.sub(r"\[\d+\]", "", text)  # Remove citations
    return re.sub(r"\s+", " ", text).strip()[:4000]  # Truncate

def build_prompt(text):
    return f"""Summarize this in 3-5 bullet points:
{clean_text(text)}

Bullets:"""

# --- API Endpoint ---
@app.route("/scrape", methods=["POST"])
@limiter.limit("10/minute")
def handle_scrape():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"success": False, "error": "Missing 'text' field"}), 400

        llm = get_llm()
        result = llm(
            build_prompt(data['text']),
            max_tokens=512,
            temperature=0.7,
            stop=["</s>"]
        )
        
        summary = result["choices"][0]["text"].strip()
        logging.info(f"Summarized: {data.get('title', 'Untitled')}")
        
        return jsonify({
            "success": True,
            "summary": summary,
            "meta": {
                "title": data.get('title', ''),
                "url": data.get('url', ''),
                "chars": len(data['text'])
            }
        })

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

# --- Startup ---
if __name__ == "__main__":
    port = int(os.getenv("PYTHON_PORT", 8080))
    app.run(host="127.0.0.1", port=port, threaded=True)