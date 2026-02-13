import { getUserIds } from "./storage.js";
import {
  addUsersToDropdown,
  showStartBookmarksMessage,
  renderBookmarksList,
} from "./hadi-render.js";
import {
  getBookmarksForUser,
  addBookmarkFromForm,
  copyBookmarkUrl,
  likeBookmark,
} from "./joy-actions.js";

// Shared file: keep this file small to reduce merge conflicts.
const userSelect = document.querySelector("#user-select");
const formSection = document.querySelector("#form-section");
const bookmarkForm = document.querySelector("#bookmark-form");
const bookmarksSection = document.querySelector("#bookmarks-section");
const statusMessage = document.querySelector("#status-message");

let selectedUserId = "";

startApp();

function startApp() {
  addUsersToDropdown(userSelect, getUserIds());

  userSelect.addEventListener("change", onUserChange);
  bookmarkForm.addEventListener("submit", onFormSubmit);
  bookmarksSection.addEventListener("click", onBookmarksClick);

  showStartScreen();
}

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

function refreshBookmarksView() {
  const bookmarks = getBookmarksForUser(selectedUserId);
  renderBookmarksList(bookmarksSection, bookmarks);
}

function showStartScreen() {
  formSection.hidden = true;
  showStartBookmarksMessage(bookmarksSection);
  setStatus("");
}

function setStatus(text) {
  if (statusMessage) {
    statusMessage.textContent = text;
  }
}
