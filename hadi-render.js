
//  populate the user dropdown
export function addUsersToDropdown(userSelect, userIds) {
  for (const userId of userIds) {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  }
}

// show start message, when no user is selected.
export function showStartBookmarksMessage(bookmarksSection) {
  bookmarksSection.innerHTML =
   "<p>Please choose a user to view bookmarks.</p>";
}

// Draw bookmarks list for one user.
export function renderBookmarksList(bookmarksSection, bookmarks) {
  // Newest bookmarks first.
  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // If user has no bookmarks, show simple text.
  if (sortedBookmarks.length === 0) {
    bookmarksSection.innerHTML = "<p>This user has no bookmarks yet.</p>";
    return;
  }

  // Build one HTML string for all cards.
  let listHtml = "<ul>";

  for (const bookmark of sortedBookmarks) {
    listHtml += createBookmarkHtml(bookmark);
  }

  listHtml += "</ul>";
  bookmarksSection.innerHTML = listHtml;
}

// Create HTML for one bookmark card.
function createBookmarkHtml(bookmark) {
  const likes = typeof bookmark.likes === "number" ? bookmark.likes : 0;

  return `
    <li>
      <article>
        <h3>
          <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer">
            ${bookmark.title}
          </a>
        </h3>
        <p>${bookmark.description}</p>
        <p>Created at: ${formatDate(bookmark.createdAt)}</p>
        <p>Likes: ${likes}</p>
        <button type="button" data-action="copy" data-id="${bookmark.id}">Copy URL</button>
        <button type="button" data-action="like" data-id="${bookmark.id}">Like +1</button>
      </article>
    </li>
  `;
}

// Convert ISO date text to readable local date.
function formatDate(dateText) {
  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString();
}
