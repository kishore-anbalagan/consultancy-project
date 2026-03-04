# consultancy-project

## AI chatbot setup (Groq)

Backend uses Groq through `POST /api/chat/ask`.

Add these environment variables in `backend/.env` (and in Render backend service settings):

- `GROQ_API_KEY=your_groq_api_key`
- `GROQ_MODEL=llama-3.1-8b-instant` (optional, default already set)

Recommended free model for agriculture Q&A:

- `llama-3.1-8b-instant` (fast and reliable on free tier)