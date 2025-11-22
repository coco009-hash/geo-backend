const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// === Middlewares ===
app.use(cors());
app.use(express.text({ type: "*/*" })); // on parse tout comme texte

// === Client IA (Groq, compatible OpenAI) ===
// Clé à mettre dans Render : GROQ_API_KEY = ta clé Groq
const aiClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// === Route de test ===
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    api: "GEO-optimizer",
    message: "GEO-optimizer backend (Groq) is live",
  });
});

// === Route principale : optimisation GEO ===
app.post("/api/optimize", async (req, res) => {
  try {
    let body = req.body;

    // Parse du JSON
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("Erreur JSON.parse sur le body :", e);
        return res
          .status(400)
          .json({ error: "Corps de requête JSON invalide." });
      }
    }

    const {
      text,
      language = "fr",
      tone = "neutral",
      goal = "generic",
    } = body || {};

    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ error: "Le champ 'text' est obligatoire." });
    }

    // === PROMPTS ===
    const systemPrompt = `
Tu es l'expert de GEO-optimizer, un moteur d'optimisation GEO (Generative Engine Optimization).

Ton rôle :
1) Analyser le texte fourni et estimer sa "visibilité" dans les moteurs d'IA générative (ChatGPT, Perplexity, Gemini, Claude, etc.).
2) Réécrire ce texte pour maximiser son impact et sa visibilité.
3) Renvoyer **UNIQUEMENT** un JSON strict.

FORMAT JSON OBLIGATOIRE :
{
  "optimizedText": "string",
  "score": {
    "clarity": number,
    "semanticRichness": number,
    "structure": number,
    "geoOverall": number
  },
  "explanation": "string",
  "suggestedMetadata": {
    "title": "string",
