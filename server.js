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

    // ... tout le reste
