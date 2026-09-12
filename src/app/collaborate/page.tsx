import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Open to collaborate — Lightsquare",
};

export default async function CollaboratePage() {
  const supabase = await createSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name, bio")
    .eq("published", true)
    .eq("open_to_collaborate", true)
    .order("display_name");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Open to collaborate</h1>

      <p className="mt-3 text-gray-600">
        Find artists who are currently open to collaboration.
      </p>

      {error ? (
        <p className="mt-8 text-sm text-red-600">
          Unable to load collaboration profiles.
        </p>
      ) : profiles && profiles.length > 0 ? (
        <div className="mt-8 space-y-4">
          {profiles.map((profile) => (
            <article
              key={profile.id}
              className="rounded-lg border border-gray-200 p-5"
            >
              <h2 className="text-lg font-semibold">
                {profile.display_name}
              </h2>

              <p className="text-sm text-gray-600">
                @{profile.handle}
              </p>

              {profile.bio ? (
                <p className="mt-3 text-sm text-gray-700">
                  {profile.bio}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-600">
          No artists are currently open to collaboration.
        </p>
      )}
    </main>
  );
}
