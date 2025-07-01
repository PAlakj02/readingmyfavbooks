# 🧠 AI-Powered Reading & Watching Tracker — readingmyfavbooks

**readingmyfavbooks** is a full-stack system that helps you **automatically track, summarize, and store** your online reading and watching activity.

It includes:
- ✅ A Chrome Extension to scrape and summarize articles/videos
- ✅ A Node.js + Express backend for auth and data storage
- ✅ A Python-based local LLM (LLaMA.cpp) backend to generate summaries

---

## 🚀 Features

### 🌐 Chrome Extension
- 🔐 Login/Register with JWT
- 🌍 Scrape articles or YouTube video metadata
- 🧠 Send content to a local Python LLaMA backend for summarization
- 📌 JWT auto-login for seamless usage

### ⚙️ Node.js Backend (Express + Prisma)
- **Auth (`/api/auth`)**
  - `POST /register` — Create new account
  - `POST /login` — Login with JWT
- **Items (`/api/items`)**
  - `GET /` — Fetch saved summaries
  - `POST /` — Save new summarized content
- **Token verification via middleware**

### 🧠 Python Backend (Flask + llama-cpp)
- **POST /scrape**
  - Accepts: `text`, `title`, `url`
  - Returns: Bullet-point summary generated using a local LLaMA model
  - Model: `gemma-2-2b-it.q4_k_m.gguf` (runs on CPU with low memory)
- **Note**: We tested this endpoint in Postman using `/scrape` on port 8080, which matches our current `app.py`. We have  optionally added an `/api/summarize` alias for consistency with the Express backend.

---

## 🧰 Tech Stack

| Layer             | Stack                                             |
|------------------|---------------------------------------------------|
| Frontend (Web)    | React, Tailwind CSS, Vite                        |
| Extension         | JavaScript (Manifest v3), Chrome APIs            |
| Backend (Auth)    | Node.js, Express, PostgreSQL, JWT, Prisma        |
| Backend (LLM)     | Python, Flask, llama-cpp-python                  |
| Model             | `gemma-2-2b-it.q4_k_m.gguf` (Quantized GGUF)     |

---

## 🧪 Postman API Testing Summary

| Endpoint         | Description                      | Tested? ✅ |
|------------------|----------------------------------|-----------|
| `POST /api/auth/register` | Register new user         | ✅        |
| `POST /api/auth/login`    | Login and get JWT         | ✅        |
| `GET /api/items`          | Fetch saved summaries     | ✅        |
| `POST /api/items`         | Save summarized item      | ✅        |
| `POST /scrape` (on port 8080) | Trigger LLM summary      | ✅        |

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+
- PostgreSQL
- Chrome browser for extension testing

### Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/PAlakj02/readingmyfavbooks.git
   cd readingmyfavbooks
