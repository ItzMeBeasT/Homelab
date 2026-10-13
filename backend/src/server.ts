import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const server = app.listen(port, host, () => {
  console.log(`Homelab API listening on ${host}:${port}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received; shutting down...`);

  server.close((error) => {
    if (error) {
      console.error("Shutdown failed:", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
