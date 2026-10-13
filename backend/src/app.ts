import express from "express";
import pool from "./db/pool.js";
import servicesRouter from "./routes/services.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use("/api/services", servicesRouter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "homelab-command-center-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ready",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "not_ready",
      database: "unavailable",
    });
  }
});

export default app;
