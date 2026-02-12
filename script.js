import { getUserIds } from "./storage.js";
import {
  addUsersToDropdown,
  showStartBookmarksMessage,
} from "./hadi-render.js";

const userSelect = document.querySelector("#user-select");

  addUsersToDropdown(userSelect, getUserIds());


const bookmarksSection = document.querySelector("#bookmarks-section");

  showStartBookmarksMessage(bookmarksSection);

