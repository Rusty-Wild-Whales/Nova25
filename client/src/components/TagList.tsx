interface Props {
  tags?: string[];
  size?: "sm" | "md";
}

const TagList = ({ tags = [], size = "md" }: Props) => {
  if (!tags.length) return null;
  const sizeClasses = size === "sm" ? "text-[11px] px-2 py-1" : "text-xs px-3 py-1.5";
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full border border-slate-200 bg-white/70 font-medium uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 ${sizeClasses}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagList;
