import express from "express";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "homelab-command-center-api",
    timestamp: new Date().toISOString()
  });
});

export default app;
