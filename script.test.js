import assert from "node:assert";
import test from "node:test";
import { JSDOM } from "jsdom";

// Set up a DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

// Import the function to test
import { createBookmarkElement } from "./script.js";

test("createBookmarkElement creates correct HTML structure", () => {
  const bookmark = {
    url: "https://example.com",
    title: "Example Site",
    description: "A test bookmark",
    timestamp: 1234567890000,
    likes: 5
  };
  
  const element = createBookmarkElement(bookmark, 0);
  
  // Check that it's an article element
  assert.equal(element.tagName, "ARTICLE");
  assert.equal(element.className, "bookmark");
  
  // Check that it contains a link with the correct URL and title
  const link = element.querySelector("a");
  assert.ok(link, "Should contain a link");
  assert.equal(link.href, "https://example.com/");
  assert.equal(link.textContent, "Example Site");
  
  // Check that it contains the description
  const description = element.querySelector("p");
  assert.ok(description, "Should contain a description");
  assert.equal(description.textContent, "A test bookmark");
  
  // Check that it contains a timestamp
  const timestamp = element.querySelector("time");
  assert.ok(timestamp, "Should contain a time element");
  
  // Check that it contains copy and like buttons
  const buttons = element.querySelectorAll("button");
  assert.equal(buttons.length, 2, "Should contain two buttons");
  assert.ok(buttons[0].textContent.includes("Copy"), "First button should be copy button");
  assert.ok(buttons[1].textContent.includes("5"), "Second button should show like count");
});

test("createBookmarkElement handles bookmarks with zero likes", () => {
  const bookmark = {
    url: "https://test.com",
    title: "Test",
    description: "Test description",
    timestamp: Date.now(),
    likes: 0
  };
  
  const element = createBookmarkElement(bookmark, 0);
  const likeButton = element.querySelectorAll("button")[1];
  
  assert.ok(likeButton.textContent.includes("0"), "Like button should show 0 likes");
});

test("createBookmarkElement handles bookmarks without likes property", () => {
  const bookmark = {
    url: "https://test.com",
    title: "Test",
    description: "Test description",
    timestamp: Date.now()
  };
  
  const element = createBookmarkElement(bookmark, 0);
  const likeButton = element.querySelectorAll("button")[1];
  
  assert.ok(likeButton.textContent.includes("0"), "Like button should default to 0 likes");
});
