const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const ChatMessage = require('../models/ChatMessage');

async function generateCompletion({ apiKey, model, messages, maxTokens }) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: maxTokens,
      messages,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const providerMessage = payload?.error?.message || 'Failed to get AI response';
    const error = new Error(providerMessage);
    error.status = response.status || 502;
    throw error;
  }

  return payload;
}

async function askQuestion(req, res, next) {
  try {
    const question = String(req.body?.question || '').trim();
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    if (question.length > 800) {
      return res.status(400).json({ message: 'Question is too long. Please keep it under 800 characters.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ message: 'AI assistant is not configured. Missing GROQ_API_KEY.' });
    }

    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    const maxTokens = Number(process.env.GROQ_MAX_TOKENS || 700);
    const systemPrompt =
      'You are an agriculture support assistant for Indian farmers. Give practical, safe, concise guidance for crops, soil, fertilizer, irrigation, pests, and weather risk. If diagnosis is uncertain, say what extra details are needed. Avoid legal/medical claims and dangerous instructions.';

    const baseMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ];

    const payload = await generateCompletion({
      apiKey,
      model,
      messages: baseMessages,
      maxTokens,
    });

    let answer = payload?.choices?.[0]?.message?.content?.trim() || '';
    const finishReason = payload?.choices?.[0]?.finish_reason;

    if (answer && finishReason === 'length') {
      const continuationPayload = await generateCompletion({
        apiKey,
        model,
        messages: [
          ...baseMessages,
          { role: 'assistant', content: answer },
          { role: 'user', content: 'Continue from exactly where you stopped. Return only the remaining continuation.' },
        ],
        maxTokens,
      });

      const continuation = continuationPayload?.choices?.[0]?.message?.content?.trim() || '';
      if (continuation) {
        answer = `${answer}\n${continuation}`.trim();
      }
    }

    if (!answer) {
      return res.status(502).json({ message: 'AI provider returned an empty response' });
    }

    if (req.user?.id) {
      await ChatMessage.create({
        user: req.user.id,
        question,
        answer,
        model: payload?.model || model,
      });
    }

    return res.json({
      answer,
      model: payload?.model || model,
    });
  } catch (err) {
    if (err?.status) {
      return res.status(err.status).json({ message: err.message || 'Failed to get AI response' });
    }
    return next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const records = await ChatMessage.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const messages = records
      .reverse()
      .map((record) => ({
        question: record.question,
        answer: record.answer,
        model: record.model,
        createdAt: record.createdAt,
      }));

    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
}

module.exports = { askQuestion, getHistory };