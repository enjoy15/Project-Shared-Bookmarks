import { getUserIds, getData, setData } from "./storage.js";

let currentUserId = null;

/**
 * Initialize the application when the page loads
 */
export function initializeApp() {
  populateUserDropdown();
  setupEventListeners();
}

// Initialize on load if we're in a browser environment
if (typeof window !== "undefined") {
  window.onload = initializeApp;
}

/**
 * Populate the user dropdown with available users
 */
function populateUserDropdown() {
  const userSelect = document.getElementById("user-select");
  const userIds = getUserIds();
  
  userIds.forEach(userId => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
  const userSelect = document.getElementById("user-select");
  const bookmarkForm = document.getElementById("bookmark-form");
  
  userSelect.addEventListener("change", handleUserChange);
  bookmarkForm.addEventListener("submit", handleFormSubmit);
}

/**
 * Handle user selection change
 */
function handleUserChange(event) {
  currentUserId = event.target.value;
  
  if (currentUserId) {
    document.getElementById("add-bookmark-section").style.display = "block";
    displayBookmarks(currentUserId);
  } else {
    document.getElementById("add-bookmark-section").style.display = "none";
    document.getElementById("bookmarks-list").innerHTML = "";
  }
}

/**
 * Display bookmarks for a given user
 * @param {string} userId - The user ID to display bookmarks for
 */
function displayBookmarks(userId) {
  const bookmarksList = document.getElementById("bookmarks-list");
  const bookmarks = getData(userId) || [];
  
  if (bookmarks.length === 0) {
    bookmarksList.innerHTML = "<p>No bookmarks yet. Add your first bookmark above!</p>";
    return;
  }
  
  // Sort bookmarks in reverse chronological order
  const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
  
  bookmarksList.innerHTML = "";
  sortedBookmarks.forEach((bookmark, index) => {
    const bookmarkElement = createBookmarkElement(bookmark, index);
    bookmarksList.appendChild(bookmarkElement);
  });
}

/**
 * Create a bookmark HTML element
 * @param {Object} bookmark - The bookmark object
 * @param {number} index - The index of the bookmark
 * @returns {HTMLElement} The created bookmark element
 */
export function createBookmarkElement(bookmark, index) {
  const article = document.createElement("article");
  article.className = "bookmark";
  
  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = bookmark.url;
  link.textContent = bookmark.title;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  title.appendChild(link);
  
  const description = document.createElement("p");
  description.textContent = bookmark.description;
  
  const timestamp = document.createElement("time");
  timestamp.dateTime = new Date(bookmark.timestamp).toISOString();
  timestamp.textContent = `Created: ${new Date(bookmark.timestamp).toLocaleString()}`;
  
  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy URL to Clipboard";
  copyButton.setAttribute("aria-label", `Copy URL for ${bookmark.title}`);
  copyButton.addEventListener("click", () => copyToClipboard(bookmark.url, copyButton));
  
  const likeButton = document.createElement("button");
  likeButton.textContent = `👍 ${bookmark.likes || 0}`;
  likeButton.setAttribute("aria-label", `Like ${bookmark.title}. Current likes: ${bookmark.likes || 0}`);
  likeButton.addEventListener("click", () => handleLike(index));
  
  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(timestamp);
  article.appendChild(copyButton);
  article.appendChild(likeButton);
  
  return article;
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @param {HTMLElement} button - The button element to provide feedback
 */
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const originalText = button.textContent;
    button.textContent = "Copied!";
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    alert("Failed to copy to clipboard");
  }
}

/**
 * Handle like button click
 * @param {number} index - The index of the bookmark to like
 */
function handleLike(index) {
  if (!currentUserId) return;
  
  const bookmarks = getData(currentUserId) || [];
  const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
  
  // Find the original index in the unsorted array
  const bookmarkToLike = sortedBookmarks[index];
  const originalIndex = bookmarks.findIndex(b => b.timestamp === bookmarkToLike.timestamp);
  
  if (originalIndex !== -1) {
    bookmarks[originalIndex].likes = (bookmarks[originalIndex].likes || 0) + 1;
    setData(currentUserId, bookmarks);
    displayBookmarks(currentUserId);
  }
}

/**
 * Handle form submission to add a new bookmark
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  if (!currentUserId) return;
  
  const formData = new FormData(event.target);
  const newBookmark = {
    url: formData.get("url"),
    title: formData.get("title"),
    description: formData.get("description"),
    timestamp: Date.now(),
    likes: 0
  };
  
  // Get existing bookmarks and add the new one
  const bookmarks = getData(currentUserId) || [];
  bookmarks.push(newBookmark);
  setData(currentUserId, bookmarks);
  
  // Clear the form
  event.target.reset();
  
  // Display updated bookmarks
  displayBookmarks(currentUserId);
}
