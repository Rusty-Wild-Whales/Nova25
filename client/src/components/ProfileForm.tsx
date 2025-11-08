import React, { useState } from "react";
import type { UserProfile } from "../types";

const interestOptions = ["Environment", "Health", "Education", "Economy", "Infrastructure"];

interface Props {
  initialProfile?: UserProfile | null;
  onSubmit: (profile: UserProfile) => void;
}

const ProfileForm = ({ initialProfile, onSubmit }: Props) => {
  const [formState, setFormState] = useState<UserProfile>(
    initialProfile ?? {
      name: "",
      age: 18,
      state: "",
      interests: []
    }
  );

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormState((prev) => {
      const exists = prev.interests.includes(interest);
      const interests = exists
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow dark:bg-slate-800">
      <div>
        <label className="text-sm font-semibold">Name</label>
        <input
          type="text"
          value={formState.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Age</label>
          <input
            type="number"
            value={formState.age}
            onChange={(e) => handleChange("age", Number(e.target.value))}
            min={16}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">State (abbrev.)</label>
          <input
            type="text"
            value={formState.state}
            onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
            maxLength={2}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 uppercase tracking-wide dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">Policy interests</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {interestOptions.map((interest) => {
            const active = formState.interests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`rounded-full px-4 py-2 text-sm ${
                  active
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-100"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-accent py-3 font-semibold text-slate-900 shadow hover:brightness-110 dark:text-slate-900"
      >
        Save Preferences
      </button>
    </form>
  );
};

export default ProfileForm;
