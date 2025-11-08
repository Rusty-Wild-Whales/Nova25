import { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import RecommendationList from "../components/RecommendationList";
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

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <section>
        <h1 className="text-3xl font-semibold text-primary dark:text-white">Your Civic Profile</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Provide basic context so CivicLens can surface relevant legislation. Only stored locally within this demo.
        </p>
        <div className="mt-6">
          <ProfileForm initialProfile={profile} onSubmit={handleSubmit} />
        </div>
      </section>
      <aside>
        <h2 className="text-xl font-semibold text-primary dark:text-white">Recommendations</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Updated instantly as you tweak your inputs.
        </p>
        <div className="mt-4">
          <RecommendationList bills={recommendations} />
        </div>
      </aside>
    </div>
  );
};

export default Profile;
