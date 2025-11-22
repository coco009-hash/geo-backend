const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// IMPORTANT : middlewares
app.use(cors());
app.use(express.json());

// 🔎 Route de test : version DEBUG
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "GEO backend DEBUG v1" });
});

// 🔎 Route /api/optimize : DEBUG, pas d'IA, juste écho du body reçu
app.post("/api/optimize", (req, res) => {
  return res.json({
    message: "DEBUG /api/optimize",
    bodyType: typeof req.body,
    receivedBody: req.body,
    headers: req.headers
  });
});

app.listen(port, () => {
  console.log(`🚀 GEO DEBUG server running on port ${port}`);
});
