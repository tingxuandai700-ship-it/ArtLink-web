import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Open to collaborate — Lightsquare",
};

export default async function CollaboratePage() {
  const supabase = await createSupabaseServerClient();

  const [
    { data: profiles, error: profilesError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, handle, display_name, bio, category_id")
      .eq("published", true)
      .eq("open_to_collaborate", true)
      .order("display_name"),
    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order"),
  ]);

  const categoryById = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );

  const hasError = profilesError || categoriesError;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold">Open to collaborate</h1>

        <p className="mt-3 text-gray-600">
          Find artists who are currently open to collaboration.
        </p>

        {!hasError && profiles ? (
          <p className="mt-2 text-sm text-gray-500">
            {profiles.length} {profiles.length === 1 ? "artist" : "artists"} available
          </p>
        ) : null}
      </header>

      {hasError ? (
        <section className="mt-8 rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold">Unable to load artists</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please try again later.
          </p>
        </section>
      ) : profiles && profiles.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {profiles.map((profile) => (
            <article
              key={profile.id}
              className="rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {profile.display_name}
                  </h2>

                  <p className="text-sm text-gray-600">
                    @{profile.handle}
                  </p>
                </div>

                <span className="rounded-full border border-gray-300 px-3 py-1 text-xs">
                  Open to collaborate
                </span>
              </div>

              {profile.category_id ? (
                <p className="mt-4 text-sm font-medium">
                  {categoryById.get(profile.category_id) ?? "Artist"}
                </p>
              ) : null}

              <p className="mt-2 text-sm text-gray-600">
                {profile.bio?.trim()
                  ? profile.bio
                  : "This artist has not added a bio yet."}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <section className="mt-8 rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold">
            No artists are open to collaboration yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Artists who enable Open to collaborate on their profile will appear here.
          </p>
        </section>
      )}
    </main>
  );
}