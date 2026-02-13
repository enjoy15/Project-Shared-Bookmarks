

import assert from "node:assert/strict";
import test from "node:test";
import { renderBookmarksList } from "./hadi-render.js";

function makeSection() {
  return { innerHTML: "" };
}

test("renderBookmarksList shows a clear message when there are no bookmarks", () => {
  const section = makeSection();

  renderBookmarksList(section, []);

  assert.equal(section.innerHTML, "<p>This user has no bookmarks yet.</p>");
});

test("renderBookmarksList sorts bookmarks in reverse chronological order", () => {
  const section = makeSection();

  const olderBookmark = {
    id: "old",
    url: "https://example.com/old",
    title: "Older Bookmark Title",
    description: "Older description",
    createdAt: "2024-01-01T00:00:00.000Z",
    likes: 1,
  };

  const newerBookmark = {
    id: "new",
    url: "https://example.com/new",
    title: "Newer Bookmark Title",
    description: "Newer description",
    createdAt: "2025-01-01T00:00:00.000Z",
    likes: 2,
  };

  renderBookmarksList(section, [olderBookmark, newerBookmark]);

  const newerIndex = section.innerHTML.indexOf("Newer Bookmark Title");
  const olderIndex = section.innerHTML.indexOf("Older Bookmark Title");

  assert.notEqual(newerIndex, -1);
  assert.notEqual(olderIndex, -1);
  assert.ok(newerIndex < olderIndex);
});

test("renderBookmarksList renders link, description, timestamp, likes and action buttons", () => {
  const section = makeSection();

  const bookmark = {
    id: "abc-123",
    url: "https://example.com/article",
    title: "Article Title",
    description: "Short summary",
    createdAt: "2025-02-01T10:00:00.000Z",
    likes: 7,
  };

  renderBookmarksList(section, [bookmark]);

  assert.ok(section.innerHTML.includes('href="https://example.com/article"'));
  assert.ok(section.innerHTML.includes("Article Title"));
  assert.ok(section.innerHTML.includes("Short summary"));
  assert.ok(section.innerHTML.includes("Created at:"));
  assert.ok(section.innerHTML.includes("Likes: 7"));
  assert.ok(section.innerHTML.includes('data-action="copy"'));
  assert.ok(section.innerHTML.includes('data-action="like"'));
});