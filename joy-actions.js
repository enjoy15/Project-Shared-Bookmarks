import { getData, setData } from "./storage.js";

export function getBookmarksForUser(userId) {
  const savedData = getData(userId);
  const bookmarks = Array.isArray(savedData) ? savedData : [];
  let shouldSave = false;

  // Keep old data safe for like/copy buttons.
  for (let i = 0; i < bookmarks.length; i += 1) {
    if (!bookmarks[i].id) {
      bookmarks[i].id = makeId();
      shouldSave = true;
    }

    if (typeof bookmarks[i].likes !== "number") {
      bookmarks[i].likes = 0;
      shouldSave = true;
    }
  }

  if (shouldSave) {
    setData(userId, bookmarks);
  }

  return bookmarks;
}

// Read form values, validate, add new bookmark, and save.
export function addBookmarkFromForm(userId, formElement) {
  const formData = new FormData(formElement);
  const url = String(formData.get("url") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!url || !title || !description) {
    return {
      ok: false,
      message: "Please fill all form fields.",
    };
  }

  if (!isValidUrl(url)) {
    return {
      ok: false,
      message: "Please enter a valid URL.",
    };
  }

  const bookmarks = getBookmarksForUser(userId);
  bookmarks.push({
    id: makeId(),
    url,
    title,
    description,
    createdAt: new Date().toISOString(),
    likes: 0,
  });
  setData(userId, bookmarks);
  formElement.reset();

  return {
    ok: true,
    message: "Bookmark added.",
  };
}

// Copy one bookmark URL to clipboard.
export async function copyBookmarkUrl(userId, bookmarkId) {
  const bookmarks = getBookmarksForUser(userId);
  const bookmark = findBookmarkById(bookmarks, bookmarkId);

  if (!bookmark) {
    return {
      ok: false,
      message: "Bookmark not found.",
    };
  }

  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    return {
      ok: false,
      message: "Clipboard is not available in this browser.",
    };
  }

  try {
    await navigator.clipboard.writeText(bookmark.url);
    return {
      ok: true,
      message: "URL copied.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not copy URL.",
    };
  }
}

// Add one like to one bookmark and save data.
export function likeBookmark(userId, bookmarkId) {
  const bookmarks = getBookmarksForUser(userId);
  const bookmark = findBookmarkById(bookmarks, bookmarkId);

  if (!bookmark) {
    return {
      ok: false,
      message: "Bookmark not found.",
    };
  }

  bookmark.likes += 1;
  setData(userId, bookmarks);

  return {
    ok: true,
    message: "Like added.",
  };
}

// Find one bookmark by id.
function findBookmarkById(bookmarks, bookmarkId) {
  return bookmarks.find((bookmark) => bookmark.id === bookmarkId);
}

// Check if text is a valid URL.
function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Create a simple unique id string.
function makeId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
