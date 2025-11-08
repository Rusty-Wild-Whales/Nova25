import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="space-y-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-slate-900 to-black py-20 text-center text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="mx-auto h-full w-full max-w-4xl animate-pulse rounded-full bg-accent blur-[160px]" />
        </div>
        <div className="relative mx-auto flex max-w-4xl flex-col gap-6 px-4">
          <p className="text-xs uppercase tracking-[0.6em] text-accent">CivicLens</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Decode legislation with AI-powered civic briefings.
          </h1>
          <p className="text-lg text-white/80">
            CivicLens scrapes real bill text from GovInfo, condenses it with explainable AI, and gives you tools to track
            policies that touch your community.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
            <Link
              to="/feed"
              className="rounded-full bg-accent px-8 py-3 font-semibold text-slate-900 shadow hover:brightness-110 dark:text-slate-900"
            >
              Explore Policies
            </Link>
            <Link to="/profile" className="rounded-full border border-white/40 px-8 py-3 text-white">
              Personalize my feed
            </Link>
          </div>
          <div className="grid gap-4 pt-6 md:grid-cols-3">
            {[
              { label: "Active bills tracked", value: "60+" },
              { label: "Congress sessions", value: "117th–118th" },
              { label: "AI briefs generated", value: "Instant" }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/10 p-4 text-left">
                <p className="text-2xl font-semibold text-accent">{item.value}</p>
                <p className="text-xs uppercase tracking-wide text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-accent">Workflow</p>
          <h2 className="mt-2 text-3xl font-semibold text-primary dark:text-white">How CivicLens Works</h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-200">
            Fresh data → AI summaries → Personalized recommendations. Everything happens locally in this demo so you can
            trace each step.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Scrape",
              body: "GovInfo bulk data (BILLSTATUS + BILLS) feeds the CivicLens dataset with full text, tags, and status."
            },
            {
              title: "Simplify",
              body: "Server-side mock AI creates bullet summaries so every section reads like plain community updates."
            },
            {
              title: "Personalize",
              body: "React + Tailwind UI filters by interests, states, and tags while keeping dark-mode accessible."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="text-sm font-semibold text-accent">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
