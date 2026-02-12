import { getUserIds } from "./storage.js";
import {
  addUsersToDropdown,
  showStartBookmarksMessage,
} from "./hadi-render.js";
import { addUsersToDropdown } from "./hadi-render.js";
import {
  getBookmarksForUser,
  addBookmarkFromForm,
  copyBookmarkUrl,
  likeBookmark,
} from "./joy-actions.js";

const userSelect = document.querySelector("#user-select");

  addUsersToDropdown(userSelect, getUserIds());


const bookmarksSection = document.querySelector("#bookmarks-section");

  showStartBookmarksMessage(bookmarksSection);

function onUserChange(event) {
  selectedUserId = event.target.value;
  formSection.hidden = !selectedUserId;

  if (!selectedUserId) {
    showStartScreen();
    return;
  }

  refreshBookmarksView();
  setStatus(`You selected User ${selectedUserId}.`);
}

function onFormSubmit(event) {
  event.preventDefault();

  if (!selectedUserId) {
    setStatus("Please choose a user first.");
    return;
  }

  const result = addBookmarkFromForm(selectedUserId, bookmarkForm);
  setStatus(result.message);

  if (result.ok) {
    refreshBookmarksView();
  }
}  

async function onBookmarksClick(event) {
  const button = event.target.closest("button[data-action]");

  if (!button || !selectedUserId) {
    return;
  }

  const action = button.dataset.action;
  const bookmarkId = button.dataset.id;

  if (!bookmarkId) {
    return;
  }

  if (action === "copy") {
    const result = await copyBookmarkUrl(selectedUserId, bookmarkId);
    setStatus(result.message);
    return;
  }

  if (action === "like") {
    const result = likeBookmark(selectedUserId, bookmarkId);
    setStatus(result.message);

    if (result.ok) {
      refreshBookmarksView();
    }
  }
}