import { getUserIds } from "./storage.js";
import { addUsersToDropdown } from "./hadi-render.js";
import { getBookmarksForUser} from "./joy-actions.js";

const userSelect = document.querySelector("#user-select");

addUsersToDropdown(userSelect, getUserIds());
