import React, { useState } from "react";
import type { UserProfile } from "../types";

const interestOptions = ["Environment", "Health", "Education", "Economy", "Infrastructure", "Justice", "Housing"];
const frequencyOptions: UserProfile["newsFrequency"][] = ["daily", "weekly", "monthly"];
const contactOptions: UserProfile["contactPreference"][] = ["email", "sms", "none"];

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
      interests: [],
      email: "",
      policyFocus: "",
      newsFrequency: "weekly",
      contactPreference: "email",
      sendAlerts: true,
      notes: ""
    }
  );

  const handleChange = (field: keyof UserProfile, value: string | number | boolean) => {
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow focus-within:ring-2 focus-within:ring-accent dark:bg-slate-800"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="profile-name">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={formState.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="profile-email">
            Email (optional)
          </label>
          <input
            id="profile-email"
            type="email"
            value={formState.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-semibold" htmlFor="profile-age">
            Age
          </label>
          <input
            id="profile-age"
            type="number"
            value={formState.age}
            onChange={(e) => handleChange("age", Number(e.target.value))}
            min={16}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="profile-state">
            State (abbrev.)
          </label>
          <input
            id="profile-state"
            type="text"
            value={formState.state}
            onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
            maxLength={2}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 uppercase tracking-wide dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="profile-policy-focus">
            Top policy focus
          </label>
          <input
            id="profile-policy-focus"
            type="text"
            value={formState.policyFocus ?? ""}
            onChange={(e) => handleChange("policyFocus", e.target.value)}
            placeholder="e.g. Water infrastructure"
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Newsletter cadence</label>
          <select
            value={formState.newsFrequency ?? "weekly"}
            onChange={(e) => handleChange("newsFrequency", e.target.value as UserProfile["newsFrequency"])}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
          >
            {frequencyOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Preferred contact</label>
          <select
            value={formState.contactPreference ?? "email"}
            onChange={(e) => handleChange("contactPreference", e.target.value as UserProfile["contactPreference"])}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 capitalize dark:border-slate-700 dark:bg-slate-900"
          >
            {contactOptions.map((option) => (
              <option key={option} value={option}>
                {option === "none" ? "No notifications" : option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <p className="font-semibold text-primary dark:text-white">Send me urgent alerts</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Includes major votes, signings, and committee deadlines. Stored locally in this demo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleChange("sendAlerts", !(formState.sendAlerts ?? true))}
          className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${
            formState.sendAlerts ? "bg-primary text-white" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-white"
          }`}
        >
          {formState.sendAlerts ? "Enabled" : "Disabled"}
        </button>
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
                aria-pressed={active}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold" htmlFor="profile-notes">
          Notes / community context
        </label>
        <textarea
          id="profile-notes"
          value={formState.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          placeholder="Add coalition affiliations, local campaigns, or issues to spotlight."
          className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
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
