// main.js — entry point. Wires state + render + events + storage together and
// defines the core loop: change state -> render(resume) -> save(resume).

// main.js — entry point

// main.js — entry point.

// main.js — debug version

import { render } from "./render.js";
import { setupEvents } from "./events.js";
import { loadResume } from "./storage.js";

console.log("main.js loaded");

try {
  console.log("loading resume...");
  loadResume();
  console.log("resume loaded");

  console.log("rendering preview...");
  render();
  console.log("preview rendered");

  console.log("setting up events/editor...");
  setupEvents();
  console.log("events/editor setup complete");
} catch (error) {
  console.error("App crashed:", error);
}