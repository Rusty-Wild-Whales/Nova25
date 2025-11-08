import express from "express";
import cors from "cors";
import apiRouter from "./routes/bills";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Main API router bundles bill, summary, and recommendation endpoints.
app.use("/api", apiRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`CivicLens API running on http://localhost:${PORT}`);
});
