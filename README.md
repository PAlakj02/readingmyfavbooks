# 🧠 AI-Powered Reading & Watching Tracker

**readingmyfavbooks** is a cross-platform system that helps you **automatically log, summarize, and organize** your reading and watching history. It combines a powerful **Chrome extension**, an **Express.js authentication backend**, and a **Python LLaMA.cpp-based summarization engine**, all tied together with a **React + Tailwind frontend**.


---

## 🚀 Features

### ✅ Chrome Extension
- 🔐 **Login/Register with JWT**
- 📰 **Scrape** web content or YouTube video details
- 🧠 **Summarize** using local LLaMA model via Python backend
- 📌 **Auto-login support** with stored JWT


### ✅ Node.js Backend (Express)
- Auth (`/api/auth`)
  - `POST /register`
  - `POST /login`
- Summarization trigger (`/api/summarize`)
- Summary retrieval, user data 
- JWT authentication middleware

### ✅ Python Backend (LLaMA.cpp)
- `POST /summarize`
  - Accepts `title`, `url`, `text`
  - Uses `llama-cpp-python` to generate summaries using **gemma-2-2b-it.q4_k_m.gguf**

---

## 🧠 Technologies Used

| Part            | Stack                                                                 |
|-----------------|-----------------------------------------------------------------------|
| Frontend        | React, Tailwind CSS, Vite                                             |
| Extension       | JavaScript, Manifest v3, Chrome APIs                                  |
| Auth Backend    | Node.js, Express.js, PostgreSQL, JWT                                  |
| Summarization   | Python, FastAPI (or Flask), llama-cpp-python, GGUF model              |
| LLM Model       | `gemma-2-2b-it.q4_k_m.gguf`                                            |

---





