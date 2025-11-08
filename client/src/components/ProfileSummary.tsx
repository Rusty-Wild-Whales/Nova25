import type { UserProfile } from "../types";
import TagList from "./TagList";

interface Props {
  profile: UserProfile | null;
}

const placeholderInsights = [
  "Add your policy focus to unlock deeper recommendations.",
  "Turn on urgent alerts to follow key votes in real time.",
  "Pick at least two interests to diversify your feed."
];

const ProfileSummary = ({ profile }: Props) => {
  if (!profile) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
        Save your civic profile to generate insights, alerts, and custom recommendations.
      </div>
    );
  }

  const tags = [...profile.interests];
  if (profile.policyFocus) tags.unshift(profile.policyFocus);
  const alertsStatus = profile.sendAlerts ? "Enabled" : "Disabled";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-slate-700 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Snapshot</p>
        <h3 className="mt-2 text-2xl font-semibold text-primary dark:text-white">{profile.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          {profile.state || "--"} · {profile.newsFrequency ?? "weekly"} briefings · alerts {alertsStatus}
        </p>
        <div className="mt-4">
          <TagList tags={tags.slice(0, 8)} size="sm" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Policy focus</p>
          <p className="mt-1 text-base font-semibold text-primary dark:text-white">
            {profile.policyFocus || "Add a priority"}
          </p>
          <p className="mt-2 text-xs">
            Helps CivicLens surface long-form bills and hearings aligned with your agenda.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Community notes</p>
          <p className="mt-1 text-base font-semibold text-primary dark:text-white">
            {profile.notes?.slice(0, 120) || "Add notes about your coalition, district, or campaign."}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ProfileSuggestions = () => {
  return (
    <ul className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
      {placeholderInsights.map((tip) => (
        <li key={tip} className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  );
};

export default ProfileSummary;
