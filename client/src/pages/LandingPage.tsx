import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

const milestones = [
  { label: "Scrape", detail: "GovInfo BILLSTATUS + BILLS XML streams into CivicLens via the CLI scraper." },
  { label: "Summarize", detail: "Modal-hosted BART model distills each bill into bullet insights with a local fallback." },
  { label: "Personalize", detail: "Profile cockpit + tag filters drive AI-powered recommendations instantly." }
];

const featureCards = [
  {
    title: "Realtime status",
    body: "Track active vs. enacted bills from multiple congress sessions with clear metadata.",
    stat: "32",
    badge: "Live bills"
  },
  {
    title: "Explainable AI",
    body: "Modal summaries cite key themes while preserving full text for transparency.",
    stat: "Modal",
    badge: "Summaries"
  },
  {
    title: "Community cockpit",
    body: "Save interests, cadence, and notes locally to keep recommendations relevant without storing PII.",
    stat: "Local",
    badge: "Storage"
  }
];

const LandingPage = () => {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
      <section className="grid gap-12 rounded-[32px] border border-slate-200 bg-white/90 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.6em] text-accent">CivicLens</p>
          <h1 className="text-5xl font-semibold leading-tight text-primary dark:text-white">
            Navigate U.S. policy with AI briefings you can trust.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-200">
            CivicLens scrapes official bill text, layers on explainable summaries, and gives advocates a calm, organized
            interface for tracking what matters.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-full bg-accent px-8 py-3 font-semibold text-slate-900 shadow hover:brightness-110" to="/feed">
              Explore policy feed
            </Link>
            <Link className="rounded-full border border-primary px-8 py-3 font-semibold text-primary dark:text-white" to="/profile">
              Customize profile
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
            {milestones.map((item) => (
              <li key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs uppercase tracking-wide text-accent">{item.label}</p>
                <p className="mt-1 text-base font-medium text-primary dark:text-white">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow dark:border-white/10 dark:from-white/10 dark:to-white/5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">{card.badge}</p>
              <p className="text-4xl font-bold text-accent">{card.stat}</p>
              <h3 className="text-lg font-semibold text-primary dark:text-white">{card.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow dark:border-slate-800 dark:bg-slate-900">
        <SectionHeader
          eyebrow="FLOW"
          title="From statute text to civic action"
          description="Every step is open-source, so you can trust how insights are produced."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {milestones.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left dark:border-slate-800 dark:bg-slate-800">
              <span className="text-5xl font-extrabold text-accent">{item.label.slice(0, 1)}</span>
              <h3 className="mt-4 text-lg font-semibold text-primary dark:text-white">{item.label}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
