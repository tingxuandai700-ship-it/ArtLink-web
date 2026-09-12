"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function ProfilePage() {
  const [openToCollaborate, setOpenToCollaborate] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [status, setStatus] = useState("Loading profile...");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("Sign in to manage your collaboration settings.");
        return;
      }

      setProfileId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("open_to_collaborate")
        .eq("id", user.id)
        .single();

      if (error) {
        setStatus(error.message);
        return;
      }

      setOpenToCollaborate(data.open_to_collaborate);
      setStatus("");
    }

    void loadProfile();
  }, []);

  async function saveSetting() {
    if (!profileId) return;

    setSaving(true);
    setStatus("");

    const { error } = await supabase
      .from("profiles")
      .update({ open_to_collaborate: openToCollaborate })
      .eq("id", profileId);

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Collaboration setting saved.");
    }

    setSaving(false);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Profile settings</h1>

      <section className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold">Collaboration</h2>

        <label className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={openToCollaborate}
            onChange={(event) => setOpenToCollaborate(event.target.checked)}
            disabled={!profileId}
          />
          <span>Open to collaborate</span>
        </label>

        <p className="mt-2 text-sm text-gray-600">
          When enabled, your published profile can appear on the collaborate page.
        </p>

        <button
          type="button"
          onClick={saveSetting}
          disabled={!profileId || saving}
          className="mt-5 rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save setting"}
        </button>

        {status ? (
          <p className="mt-4 text-sm text-gray-600" aria-live="polite">
            {status}
          </p>
        ) : null}
      </section>
    </main>
  );
}
