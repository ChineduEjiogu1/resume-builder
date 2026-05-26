// storage.js — saves and loads resume data from localStorage.

// storage.js — saves and loads resume data from localStorage.

import { resume, replaceResume } from "./state.js";

const STORAGE_KEY = "resume-builder-data-v1";

export function saveResume() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
}

export function loadResume() {
  const savedResume = localStorage.getItem(STORAGE_KEY);

  if (!savedResume) {
    return;
  }

  try {
    const parsedResume = JSON.parse(savedResume);
    replaceResume(parsedResume);
  } catch (error) {
    console.error("Could not load saved resume:", error);
  }
}

export function clearSavedResume() {
  localStorage.removeItem(STORAGE_KEY);
}