// events.js — listens for user actions.
// Flow: user edits/clicks -> update state -> save -> render preview.

import { resume, createEntry } from "./state.js";
import { render } from "./render.js";
import { saveResume, clearSavedResume } from "./storage.js";
import { requireElement } from "./utils/dom.js";
import { showSaveStatus } from "./ui/status.js";
import { updatePageWarning } from "./ui/pageWarning.js";
import { renderAllEditors } from "./editor/editorRender.js";

function saveRenderAndShowStatus() {
  saveResume();
  render();
  updatePageWarning();
  showSaveStatus();
}

function refreshAfterStructureChange() {
  saveResume();
  render();
  renderAllEditors();
  updatePageWarning();
  showSaveStatus();
}

function handleInput(event) {
  const input = event.target;

  if (input.matches(".basics-input")) {
    const field = input.dataset.field;

    if (!field) {
      throw new Error("A basics input is missing its data-field attribute.");
    }

    resume.basics[field] = input.value;
    saveRenderAndShowStatus();
    return;
  }

  if (input.matches(".array-input")) {
    const section = input.dataset.section;
    const index = Number(input.dataset.index);
    const field = input.dataset.field;

    if (!section || Number.isNaN(index) || !field) {
      throw new Error(
        "An array input is missing data-section, data-index, or data-field."
      );
    }

    resume[section][index][field] = input.value;
    saveRenderAndShowStatus();
    return;
  }

  if (input.matches(".bullet-input")) {
    const section = input.dataset.section;
    const index = Number(input.dataset.index);
    const bulletIndex = Number(input.dataset.bulletIndex);

    if (!section || Number.isNaN(index) || Number.isNaN(bulletIndex)) {
      throw new Error(
        "A bullet input is missing data-section, data-index, or data-bullet-index."
      );
    }

    resume[section][index].bullets[bulletIndex] = input.value;
    saveRenderAndShowStatus();
  }
}

function handleClick(event) {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const section = button.dataset.section;
  const index = Number(button.dataset.index);
  const bulletIndex = Number(button.dataset.bulletIndex);

  if (action === "export-pdf") {
    window.print();
    return;
  }

  if (action === "reset-resume") {
    clearSavedResume();
    showSaveStatus("Resetting...");
    window.location.reload();
    return;
  }

  if (action === "add-entry") {
    resume[section].push(createEntry(section));
    refreshAfterStructureChange();
    return;
  }

  if (action === "remove-entry") {
    resume[section].splice(index, 1);
    refreshAfterStructureChange();
    return;
  }

  if (action === "add-bullet") {
    resume[section][index].bullets.push("New bullet.");
    refreshAfterStructureChange();
    return;
  }

  if (action === "remove-bullet") {
    resume[section][index].bullets.splice(bulletIndex, 1);
    refreshAfterStructureChange();
  }
}

export function setupEvents() {
  const editor = requireElement("#editor");

  renderAllEditors();
  updatePageWarning();

  editor.addEventListener("input", handleInput);
  editor.addEventListener("click", handleClick);
}