import { Link } from "react-router-dom";
import type { Bill } from "../types";
import TagList from "./TagList";
import { deriveTags } from "../utils/tags";

interface Props {
  bill: Bill;
}

const BillCard = ({ bill }: Props) => {
  const tags = deriveTags(bill);
  const summaryLines = (bill.excerpt ?? bill.text)
    .split(/\n|•|- /)
    .map((line) => line.trim())
    .filter(Boolean);
  const intro = summaryLines[0] ?? "This bill currently lacks a summary.";
  const supporting = summaryLines.slice(1, 4);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
        <span className="font-semibold text-primary dark:text-white">{bill.state}</span>
        <span>{new Date(bill.dateIntroduced).toLocaleDateString()}</span>
        {bill.status && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-white">
            {bill.status}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-2xl font-semibold leading-tight text-primary dark:text-white">{bill.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-200">{intro}</p>
      {supporting.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-slate-500 dark:text-slate-300">
          {supporting.map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden="true" className="mt-1 h-1 w-1 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <TagList tags={tags} size="sm" />
        <Link
          to={`/bill/${bill.id}`}
          className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white dark:border-white/40 dark:text-white hover:dark:bg-white hover:dark:text-primary"
        >
          Read briefing
        </Link>
      </div>
    </article>
  );
};

export default BillCard;
