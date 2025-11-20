// ROUTE DE DEBUG TEMPORAIRE
app.post("/api/optimize", (req, res) => {
  // On renvoie exactement ce que le serveur reçoit
  return res.json({
    receivedBody: req.body,
    bodyType: typeof req.body,
    headers: req.headers
  });
});

