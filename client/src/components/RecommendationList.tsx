import type { Bill } from "../types";
import TagList from "./TagList";
import { deriveTags } from "../utils/tags";

interface Props {
  bills: Bill[];
}

const RecommendationList = ({ bills }: Props) => {
  if (!bills.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
        Add interests or a state to see personalized policies.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {bills.map((bill) => {
        const tags = deriveTags(bill);
        const preview = bill.excerpt ?? bill.text;
        return (
          <li key={bill.id} className="rounded-2xl bg-white/90 p-5 shadow dark:bg-slate-800/80">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
              <span>{bill.state}</span>
              <span>{bill.category}</span>
            </div>
            <p className="mt-1 text-base font-semibold text-primary dark:text-white">{bill.title}</p>
            {bill.status && <p className="text-xs font-medium text-accent">Status: {bill.status}</p>}
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-200 line-clamp-4">{preview}</p>
            <div className="mt-3">
              <TagList tags={tags} size="sm" />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RecommendationList;
