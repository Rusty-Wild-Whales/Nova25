import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-accent">CivicLens</p>
      <h1 className="text-4xl font-semibold text-primary dark:text-white md:text-5xl">
        Decode legislation with AI-powered civic briefings.
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-200">
        CivicLens distills complex policy language into everyday insights, so residents can stay informed, build
        advocacy momentum, and act on the issues that matter most.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
        <Link
          to="/feed"
          className="rounded-full bg-accent px-8 py-3 font-semibold text-slate-900 shadow hover:brightness-110 dark:text-slate-900"
        >
          Explore Policies
        </Link>
        <Link to="/profile" className="rounded-full border border-primary px-8 py-3 text-primary dark:text-white">
          Personalize my feed
        </Link>
      </div>
      <div className="grid gap-4 pt-8 md:grid-cols-3">
        {["Summaries", "Context", "Recommendations"].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-accent">{item}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">
              Mock AI pipelines show how CivicLens can surface what matters and point to actions you can take.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPage;
