import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  appBase,
  createUser,
  startApp,
  type TestUser,
} from "../auth/_harness";

let artist: TestUser;
let handle: string;
let app: { close: () => Promise<void> };

async function browseHtml(label: string): Promise<string> {
  const response = await fetch(
    `${appBase()}/collaborate?state=${encodeURIComponent(label)}`,
    { cache: "no-store" },
  );

  expect(response.status).toBe(200);
  return response.text();
}

beforeAll(async () => {
  artist = await createUser("collaboration");

  const { data: profile, error } = await artist.client
    .from("profiles")
    .update({
      category_id: 1,
      published: true,
      open_to_collaborate: false,
    })
    .eq("id", artist.userId)
    .select("handle")
    .single();

  if (error || !profile) {
    throw new Error(
      `failed to prepare collaboration profile: ${error?.message ?? "no profile"}`,
    );
  }

  handle = profile.handle;
  app = await startApp();
}, 30_000);

afterAll(async () => {
  if (app) {
    await app.close();
  }
}, 15_000);

describe("C6 — Open to Collaborate browse workflow", () => {
  it("shows an artist only while Open to collaborate is enabled", async () => {
    const closedBefore = await browseHtml("closed-before");
    expect(closedBefore).not.toContain(handle);

    const openResult = await artist.client
      .from("profiles")
      .update({ open_to_collaborate: true })
      .eq("id", artist.userId);

    expect(openResult.error).toBeNull();

    const open = await browseHtml("open");
    expect(open).toContain(handle);
    expect(open).toContain("Open to collaborate");

    const closeResult = await artist.client
      .from("profiles")
      .update({ open_to_collaborate: false })
      .eq("id", artist.userId);

    expect(closeResult.error).toBeNull();

    const closedAfter = await browseHtml("closed-after");
    expect(closedAfter).not.toContain(handle);
  });
});