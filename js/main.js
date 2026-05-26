// main.js — entry point. Wires state + render + events + storage together and
// defines the core loop: change state -> render(resume) -> save(resume).

// main.js — entry point

import { render } from "./render.js";
import { setupEvents } from "./events.js";
import { loadResume } from "./storage.js";

loadResume();

render();
setupEvents();