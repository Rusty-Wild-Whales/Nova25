interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeader = ({ eyebrow, title, description, align = "center" }: Props) => {
  return (
    <div className={`space-y-3 ${align === "center" ? "text-center" : "text-left"}`}>
      <p className="text-xs uppercase tracking-[0.5em] text-accent">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-primary dark:text-white">{title}</h2>
      {description && <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>}
    </div>
  );
};

export default SectionHeader;
