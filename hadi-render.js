
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
