import { Link } from "react-router-dom";
import type { Bill } from "../types";
import TagList from "./TagList";
import { deriveTags } from "../utils/tags";

interface Props {
  bill: Bill;
}

const BillCard = ({ bill }: Props) => {
  const tags = deriveTags(bill);
  const preview = bill.excerpt ?? bill.text;
  return (
    <Link
      to={`/bill/${bill.id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/70"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
        <span className="font-semibold text-primary dark:text-white">{bill.state}</span>
        <span>{new Date(bill.dateIntroduced).toLocaleDateString()}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold leading-snug text-primary group-hover:text-accent dark:text-white">
        {bill.title}
      </h3>
      {bill.status && (
        <p className="mt-1 text-sm font-medium text-accent">Status: {bill.status}</p>
      )}
      <p className="mt-3 max-h-32 overflow-hidden text-sm leading-relaxed text-slate-600 dark:text-slate-200">
        {preview}
      </p>
      <div className="mt-4">
        <TagList tags={tags} size="sm" />
      </div>
    </Link>
  );
};

export default BillCard;
