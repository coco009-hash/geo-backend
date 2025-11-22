const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.text({ type: "*/*" }));

// === Client Groq (avec ta variable GEO_OPTIMIZER) ===
const aiClient = new OpenAI({
  apiKey: process.env.GEO_OPTIMIZER,   // ← CHANGÉ ICI
  baseURL: "https://api.groq.com/openai/v1",
});

// === Test route ===
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    api: "GEO-optimizer",
    message: "GEO-optimizer backend (Groq) is live",
  });
});

// === Optimize route ===
app.post("/api/optimize", async (req, res) => {
  try {
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: "Corps de requête JSON invalide." });
      }
    }

    const text = body?.text;
    const language = body?.language || "fr";
    const tone = body?.tone || "neutral";
    const goal = body?.goal || "generic";

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Le champ 'text' est obligatoire." });
    }

    const systemPrompt = `
Tu es l'expert de GEO-optimizer, un moteur d'optimisation GEO.
Répond STRICTEMENT en JSON :
{
  "optimizedText": "",
  "score": { "clarity": 0, "semanticRichness": 0, "structure": 0, "geoOverall": 0 },
  "explanation": "",
  "suggestedMetadata": { "title": "", "summary": "", "keywords": [] }
}
`;

    const userPrompt =
      "API : GEO-optimizer\n" +
      "Langue : " + language + "\n" +
      "Ton : " + tone + "\n" +
      "Objectif : " + goal + "\n\n" +
      "Texte à optimiser :\n" +
      "\"\"\"" + text + "\"\"\"";

    const completion = await aiClient.chat.completions.create({
      model: "llama3-70b-8192",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    return res.json(parsed);
  } catch (err) {
    console.error("Erreur dans /api/optimize :", err);
    return res.status(500).json({ error: "Erreur serv
