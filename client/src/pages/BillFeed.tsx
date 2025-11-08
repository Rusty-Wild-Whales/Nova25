import { useEffect, useMemo, useState } from "react";
import BillCard from "../components/BillCard";
import RecommendationList from "../components/RecommendationList";
import TagList from "../components/TagList";
import SectionHeader from "../components/SectionHeader";
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
        setStatus({ loading: false, error: null });
      } catch (error) {
        console.error(error);
        setStatus({ loading: false, error: "Unable to load policies" });
      }
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
    () => Array.from(new Set(bills.flatMap((bill) => deriveTags(bill)))).slice(0, 12),
    [bills]
  );

  const statusOptions = useMemo(() => {
    const set = new Set<string>(["All"]);
    bills.forEach((bill) => bill.status && set.add(bill.status));
    return Array.from(set);
  }, [bills]);

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

  const activeCount = bills.filter((bill) => (bill.status ?? "").toLowerCase() !== "enacted").length;
  const enactedCount = bills.length - activeCount;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow dark:border-slate-800 dark:bg-slate-900">
        <SectionHeader
          eyebrow="Live briefings"
          title="Personalized policy feed"
          description="Search, filter, and explore legislation scraped directly from GovInfo. Tap a card to open the full text and AI simplification."
          align="left"
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Active bills</p>
            <p className="text-3xl font-bold text-accent">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Recently enacted</p>
            <p className="text-3xl font-bold text-accent">{enactedCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Tags</p>
            <p className="text-3xl font-bold text-accent">{spotlightTags.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Recs ready</p>
            <p className="text-3xl font-bold text-accent">{recommendations.length}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input
            type="search"
            placeholder="Search bills by title, topic, or text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-primary placeholder:text-slate-500 focus:border-accent focus:outline-none dark:border-white/40 dark:bg-white/10 dark:text-white"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-primary focus:border-accent focus:outline-none dark:border-white/40 dark:bg-white/10 dark:text-white"
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
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-primary focus:border-accent focus:outline-none dark:border-white/40 dark:bg-white/10 dark:text-white"
          >
            {["All", ...spotlightTags].map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        {spotlightTags.length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">Spotlight tags</p>
            <div className="mt-2">
              <TagList tags={spotlightTags} size="sm" />
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_0.9fr]">
        <section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
        <aside className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-primary dark:text-white">Recommended for you</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">Tailored using your saved profile preferences.</p>
          <RecommendationList bills={recommendations} />
        </aside>
      </div>
    </div>
  );
};

export default BillFeed;
