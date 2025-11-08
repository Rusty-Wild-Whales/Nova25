import { Router } from "express";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { summarize, recommend } from "../utils/ai";
import type { Bill, SummaryResponse, UserProfile } from "../types";

const router = Router();

const billsPath = join(__dirname, "../bills.json");
// Swap this file for a database or civic data API ingestion when ready.
const bills: Bill[] = JSON.parse(readFileSync(billsPath, "utf-8"));

router.get("/bills", (_req, res) => {
  res.json(bills);
});

router.get("/bills/:id", (req, res) => {
  const id = Number(req.params.id);
  const bill = bills.find((b) => b.id === id);
  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }
  return res.json(bill);
});

router.post("/simplify", (req, res) => {
  const { billId, text, category } = req.body ?? {};
  if (!text || !category) {
    return res.status(400).json({ message: "Missing bill text or category" });
  }

  // TODO: Replace mock summary generation with a real AI provider.
  // const summary = await civicAiClient.summarize({ text, category });
  const summary = summarize(text as string, category as string);
  const response: SummaryResponse = {
    billId: billId ?? 0,
    summary
  };
  return res.json(response);
});

router.post("/recommend", (req, res) => {
  const profile = req.body as UserProfile;
  if (!profile || !profile.name) {
    return res.status(400).json({ message: "Profile with name is required" });
  }

  // TODO: Plug in a richer recommendation engine (vector search, collaborative filtering, etc.).
  // const matches = policyMatcher.findBest(profile);
  const matches = recommend(bills, profile);
  res.json({ recommendations: matches });
});

export default router;
