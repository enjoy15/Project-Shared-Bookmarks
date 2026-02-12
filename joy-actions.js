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