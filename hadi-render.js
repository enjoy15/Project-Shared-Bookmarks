
//  populate the user dropdown
const userSelect = document.querySelector("#user-select");
const userIds = getUserIds();

for (const userId of userIds) {
  const option = document.createElement("option");
  option.value = userId;
  option.textContent = `User ${userId}`;
  userSelect.appendChild(option);
}
