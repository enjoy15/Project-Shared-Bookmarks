
//  populate the user dropdown
export function addUsersToDropdown(userSelect, userIds) {
  for (const userId of userIds) {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  }
}