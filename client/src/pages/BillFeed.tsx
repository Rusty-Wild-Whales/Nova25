import { useEffect, useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");

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

  const spotlightTags = useMemo(
    () => Array.from(new Set(bills.flatMap((bill) => deriveTags(bill)))).slice(0, 10),
    [bills]
  );

  const statusOptions = useMemo(() => {
    const set = new Set<string>(["All"]);
    bills.forEach((bill) => bill.status && set.add(bill.status));
    return Array.from(set);
  }, [bills]);

  const activeCount = bills.filter((bill) => (bill.status ?? "").toLowerCase() !== "enacted").length;
  const enactedCount = bills.length - activeCount;

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchesQuery =
        !query ||
        bill.title.toLowerCase().includes(query.toLowerCase()) ||
        bill.category.toLowerCase().includes(query.toLowerCase()) ||
        bill.text.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = selectedStatus === "All" || bill.status === selectedStatus;
      const tags = deriveTags(bill);
      const matchesTag = selectedTag === "All" || tags.includes(selectedTag);
      return matchesQuery && matchesStatus && matchesTag;
    });
  }, [bills, query, selectedStatus, selectedTag]);

  if (status.loading) {
    return <p className="p-6 text-center text-slate-500">Loading policy briefs…</p>;
  }

  if (status.error) {
    return <p className="p-6 text-center text-red-500">{status.error}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="space-y-6 rounded-3xl bg-gradient-to-r from-primary to-slate-900 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent">Live briefings</p>
            <h2 className="mt-2 text-3xl font-semibold">Personalized Policy Feed</h2>
            <p className="mt-1 text-sm text-white/80">
              Search, filter, and explore legislation scraped directly from GovInfo. Tap a card to open the full text and
              AI simplification.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-white/70">Active bills</p>
              <p className="text-3xl font-bold text-accent">{activeCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-white/70">Recently enacted</p>
              <p className="text-3xl font-bold text-accent">{enactedCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-white/70">Tags</p>
              <p className="text-3xl font-bold text-accent">{spotlightTags.length}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="search"
            placeholder="Search bills by title, topic, or text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-2xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-accent focus:outline-none"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-2xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-2xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
          >
            {["All", ...spotlightTags].map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        {spotlightTags.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-white/70">Spotlight tags</p>
            <div className="mt-2">
              <TagList tags={spotlightTags} size="sm" />
            </div>
          </div>
        )}
      </section>
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <section>
          <div className="grid gap-6">
            {filteredBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
            {!filteredBills.length && (
              <p className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
                No bills match these filters yet. Try clearing your search or expanding the tag selection.
              </p>
            )}
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
