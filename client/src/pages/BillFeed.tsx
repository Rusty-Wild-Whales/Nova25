import { useEffect, useState } from "react";
import BillCard from "../components/BillCard";
import RecommendationList from "../components/RecommendationList";
import TagList from "../components/TagList";
import { getBills, getRecommendations } from "../utils/api";
import { deriveTags } from "../utils/tags";
import type { Bill, UserProfile } from "../types";

const BillFeed = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [recommendations, setRecommendations] = useState<Bill[]>([]);
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({ loading: true, error: null });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await getBills();
        setBills(response);
      } catch (error) {
        console.error(error);
        setStatus({ loading: false, error: "Unable to load policies" });
        return;
      }
      setStatus({ loading: false, error: null });
    };
    fetchBills();
  }, []);

  useEffect(() => {
    const loadRecommendations = () => {
      const storedProfile = localStorage.getItem("civiclens-profile");
      if (!storedProfile) {
        setRecommendations([]);
        return;
      }
      const profile: UserProfile = JSON.parse(storedProfile);
      getRecommendations(profile)
        .then((recs) => setRecommendations(recs))
        .catch((error) => console.error("Failed to load recommendations", error));
    };

    loadRecommendations();
    const handler = () => loadRecommendations();
    window.addEventListener("civiclens-profile-updated", handler);
    return () => window.removeEventListener("civiclens-profile-updated", handler);
  }, []);

  const spotlightTags = Array.from(
    new Set(bills.flatMap((bill) => deriveTags(bill)))
  ).slice(0, 8);

  const activeCount = bills.filter((bill) => (bill.status ?? "").toLowerCase() !== "enacted").length;
  const enactedCount = bills.length - activeCount;

  if (status.loading) {
    return <p className="p-6 text-center text-slate-500">Loading policy briefs…</p>;
  }

  if (status.error) {
    return <p className="p-6 text-center text-red-500">{status.error}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="rounded-3xl bg-gradient-to-r from-primary to-slate-900 p-8 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">Live briefings</p>
        <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Personalized Policy Feed</h2>
            <p className="mt-2 text-sm text-white/80">
              AI distillations of federal + state legislation. Tap a card to see full context and simplified language.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-center text-sm">
            <div>
              <p className="text-white/70">Active bills</p>
              <p className="text-3xl font-bold text-accent">{activeCount}</p>
            </div>
            <div>
              <p className="text-white/70">Recently enacted</p>
              <p className="text-3xl font-bold text-accent">{enactedCount}</p>
            </div>
          </div>
        </div>
        {spotlightTags.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-white/70">Spotlight tags</p>
            <div className="mt-2">
              <TagList tags={spotlightTags} size="sm" />
            </div>
          </div>
        )}
      </section>
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <section>
          <div className="grid gap-6 sm:grid-cols-2">
            {bills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-lg font-semibold text-primary dark:text-white">Recommended for you</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Tailored using your saved profile preferences.
            </p>
            <div className="mt-4">
              <RecommendationList bills={recommendations} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BillFeed;
