const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "simple GEO backend is live" });
});

// Route POST qui renvoie juste ce qu'elle reçoit
app.post("/api/optimize", (req, res) => {
  res.json({
    message: "OK (version simple, sans IA)",
    receivedBody: req.body,
  });
});

// Lancement du serveur
app.listen(port, () => {
  console.log("🚀 Simple GEO backend running on port " + port);
});

