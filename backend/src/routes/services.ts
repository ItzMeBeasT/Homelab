
import { Router } from "express";
import pool from "../db/pool.js";

const router = Router();

const validStatuses = [
  "online",
  "offline",
  "maintenance",
  "unknown",
] as const;

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, description, url, status,
              created_at, updated_at
       FROM services
       ORDER BY id ASC`
    );

    res.status(200).json({
      count: result.rowCount ?? 0,
      services: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.post("/", async (req, res) => {
  const { name, category, description = "", url = null, status = "unknown" } =
    req.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    typeof category !== "string" ||
    !category.trim() ||
    category.trim().length > 50 ||
    typeof description !== "string" ||
    (url !== null && typeof url !== "string") ||
    typeof status !== "string" ||
    !validStatuses.includes(status as (typeof validStatuses)[number])
  ) {
    res.status(400).json({ error: "Invalid service data" });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO services (name, category, description, url, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, category, description, url, status,
                 created_at, updated_at`,
      [name.trim(), category.trim(), description, url, status]
    );

    res.status(201).json({ service: result.rows[0] });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      res.status(409).json({ error: "A service with this name already exists" });
      return;
    }

    console.error("Failed to create service:", error);
    res.status(500).json({ error: "Failed to create service" });
  }
});

export default router;
