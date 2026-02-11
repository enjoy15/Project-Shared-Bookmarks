import { getUserIds } from "./storage.js";
import { addUsersToDropdown } from "./hadi-render.js";


const userSelect = document.querySelector("#user-select");

addUsersToDropdown(userSelect, getUserIds());
