import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBillById, getBills, simplifyBill } from "../utils/api";
import type { Bill } from "../types";
import TagList from "../components/TagList";
import { deriveTags } from "../utils/tags";

const BillDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [bill, setBill] = useState<Bill | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [related, setRelated] = useState<Bill[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getBillById(id);
        setBill(data);
        const aiSummary = await simplifyBill(data);
        setSummary(aiSummary.summary);
        const allBills = await getBills();
        setRelated(
          allBills.filter((item) => item.id !== data.id && item.category === data.category).slice(0, 3)
        );
        setStatus({ loading: false, error: "" });
      } catch (error) {
        console.error(error);
        setStatus({ loading: false, error: "Unable to load bill" });
      }
    })();
  }, [id]);

  if (status.loading) {
    return <p className="p-6 text-center text-slate-500">Fetching legislation data…</p>;
  }

  if (status.error || !bill) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{status.error || "Bill not found"}</p>
        <Link to="/feed" className="mt-4 inline-block text-primary underline dark:text-accent">
          Back to feed
        </Link>
      </div>
    );
  }

  const tags = deriveTags(bill);
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <Link to="/feed" className="text-sm text-primary underline dark:text-accent">
        ← Back to feed
      </Link>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-primary shadow dark:border-transparent dark:bg-gradient-to-r dark:from-primary dark:to-slate-900 dark:text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Bill brief</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">{bill.title}</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-600 dark:text-white/85">{bill.excerpt ?? summary}</p>
        <div className="mt-6 grid gap-4 text-sm font-semibold md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/10">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">Status</p>
            <p className="text-2xl text-accent">{bill.status ?? "Active"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/10">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">Source</p>
            <p className="text-2xl">{bill.source ?? "GovInfo"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/10">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">Introduced</p>
            <p className="text-2xl">{new Date(bill.dateIntroduced).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-6">
          <TagList tags={tags} size="sm" />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-200">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-700 dark:text-white">
            {bill.category}
          </span>
          <span>{bill.state}</span>
        </div>
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <article>
            <h2 className="text-lg font-semibold text-primary dark:text-white">Complete Bill Text</h2>
            <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-100 bg-white/70 p-4 text-sm leading-relaxed text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              <pre className="whitespace-pre-wrap">{bill.text}</pre>
            </div>
          </article>
          <article className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-primary dark:text-white">AI Simplification</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">
              {summary || "Summary coming soon"}
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Future integration point: plug in OpenAI, Claude, or custom civic NLP models for live summaries.
            </p>
          </article>
        </section>
      </div>
      {related.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-xl font-semibold text-primary dark:text-white">More in {bill.category}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">Explore similar legislation scraped this session.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/bill/${item.id}`}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-sm text-primary shadow hover:border-accent dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">{item.status}</p>
                <p className="mt-1 font-semibold">{item.title}</p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.excerpt?.slice(0, 140) ?? ""}…</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
