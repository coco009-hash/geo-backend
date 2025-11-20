const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Client OpenAI initialisé avec ta clé dans les variables d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json()); // important pour parser le JSON

// Route de test
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "GEO backend up and running" });
});

// Route principale d'optimisation
app.post("/api/optimize", async (req, res) => {
  try {
    // 🔎 DEBUG : voir ce qui arrive vraiment
    console.log("REQ BODY BRUT :", req.body);

    // Certains environnements envoient le body comme string au lieu d'objet
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("Erreur de parsing du body string :", e, body);
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
    } = body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Le champ 'text' est obligatoire." });
    }

    const systemPrompt = `
Tu es un expert en "Generative Engine Optimization" (GEO).
Ton rôle :
1) Analyser un texte et estimer sa "visibilité" dans les moteurs d'IA générative (ChatGPT, Perplexity, etc.).
2) Réécrire le texte pour maximiser cette visibilité.
3) Renvoyer la réponse STRICTEMENT au format JSON, sans texte autour.

Le JSON doit suivre ce schéma :
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
    "summary": "string",
    "keywords": ["string"]
  }
}
`;

    const userPrompt = `
Langue cible : ${language}
Ton souhaité : ${tone}
Objectif du texte : ${goal}

Voici le texte à analyser et optimiser :
"""${text}"""
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // tu peux changer de modèle si besoin
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Erreur de parsing JSON :", e, "Réponse brute :", raw);
      return res.status(500).json({ error: "Erreur interne : réponse IA illisible." });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Erreur dans /api/optimize :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur GEO lancé sur le port ${port}`);
});

