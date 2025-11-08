import { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import RecommendationList from "../components/RecommendationList";
import ProfileSummary, { ProfileSuggestions } from "../components/ProfileSummary";
import { getRecommendations } from "../utils/api";
import type { Bill, UserProfile } from "../types";

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Bill[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("civiclens-profile");
    if (stored) {
      const parsed = JSON.parse(stored) as UserProfile;
      setProfile(parsed);
      refreshRecommendations(parsed);
    }
  }, []);

  const refreshRecommendations = async (newProfile: UserProfile) => {
    try {
      const recs = await getRecommendations(newProfile);
      setRecommendations(recs);
    } catch (error) {
      console.error("recommendations failed", error);
    }
  };

  const handleSubmit = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem("civiclens-profile", JSON.stringify(newProfile));
    window.dispatchEvent(new Event("civiclens-profile-updated"));
    refreshRecommendations(newProfile);
  };

  const timeline = [
    { label: "Monitor", detail: "Track committee hearings aligned with your interests." },
    { label: "Engage", detail: "Share simplified summaries with local coalitions." },
    { label: "Act", detail: "Set reminders for floor votes and public comment periods." }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">Profile cockpit</p>
        <h1 className="text-3xl font-semibold text-primary dark:text-white">Tune your CivicLens experience</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Everything you share here stays in your browser for this demo. Update anytime to refresh recommendations.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <section className="space-y-6">
          <ProfileForm initialProfile={profile} onSubmit={handleSubmit} />
          <ProfileSummary profile={profile} />
        </section>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-800/80">
            <h2 className="text-xl font-semibold text-primary dark:text-white">Recommendations</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Updated instantly as you tweak your inputs.
            </p>
            <div className="mt-4">
              <RecommendationList bills={recommendations} />
            </div>
          </div>
          <ProfileSuggestions />
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-lg font-semibold text-primary dark:text-white">Action loop</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-200">
              {timeline.map((item) => (
                <li key={item.label} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-wide text-accent">{item.label}</p>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
