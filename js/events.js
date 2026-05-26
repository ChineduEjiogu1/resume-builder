// events.js — listens for user actions.
// Flow: generate editor -> user edits/clicks -> update state -> render preview.

import { resume, createEntry } from "./state.js";
import { render } from "./render.js";
import { saveResume, clearSavedResume } from "./storage.js";

function requireElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let saveStatusTimerId = null;

function showSaveStatus(message = "Saved locally") {
  const saveStatus = document.querySelector("#save-status");

  if (!saveStatus) {
    return;
  }

  saveStatus.textContent = message;
  saveStatus.classList.add("is-visible");

  clearTimeout(saveStatusTimerId);

  saveStatusTimerId = setTimeout(() => {
    saveStatus.classList.remove("is-visible");
  }, 1200);
}

function updatePageWarning() {
  const preview = document.querySelector("#preview");
  const pageWarning = document.querySelector("#page-warning");

  if (!preview || !pageWarning) {
    return;
  }

  const letterPageHeightPx = 11 * 96;
  const isOverflowing = preview.scrollHeight > letterPageHeightPx;

  if (isOverflowing) {
    pageWarning.textContent =
      "Warning: résumé may spill onto a second page when exported.";
    pageWarning.classList.add("is-visible");
    preview.classList.add("is-overflowing");
  } else {
    pageWarning.textContent = "";
    pageWarning.classList.remove("is-visible");
    preview.classList.remove("is-overflowing");
  }
}

function saveRenderAndShowStatus() {
  saveResume();
  render();
  updatePageWarning();
  showSaveStatus();
}

function renderArrayTextInput({
  section,
  index,
  field,
  label,
  value,
  placeholder,
}) {
  const id = `${section}-${index}-${field}`;

  return `
    <div class="form-group">
      <label for="${id}">${label}</label>
      <input
        id="${id}"
        class="array-input"
        type="text"
        data-section="${section}"
        data-index="${index}"
        data-field="${field}"
        value="${escapeHTML(value)}"
        placeholder="${escapeHTML(placeholder)}"
      />
    </div>
  `;
}

function renderArrayTextarea({
  section,
  index,
  field,
  label,
  value,
  placeholder,
  rows = 4,
}) {
  const id = `${section}-${index}-${field}`;

  return `
    <div class="form-group">
      <label for="${id}">${label}</label>
      <textarea
        id="${id}"
        class="array-input detail-textarea"
        data-section="${section}"
        data-index="${index}"
        data-field="${field}"
        placeholder="${escapeHTML(placeholder)}"
        rows="${rows}"
      >${escapeHTML(value)}</textarea>
    </div>
  `;
}

function renderBulletInputs({ section, index, bullets }) {
  return bullets
    .map((bullet, bulletIndex) => {
      const id = `${section}-${index}-bullet-${bulletIndex}`;

      return `
        <div class="form-group bullet-group">
          <label for="${id}">Bullet ${bulletIndex + 1}</label>

          <div class="inline-control">
            <textarea
              id="${id}"
              class="bullet-input"
              data-section="${section}"
              data-index="${index}"
              data-bullet-index="${bulletIndex}"
              placeholder="Resume bullet"
              rows="3"
            >${escapeHTML(bullet)}</textarea>

            <button
              type="button"
              class="editor-btn danger-btn small-btn"
              data-action="remove-bullet"
              data-section="${section}"
              data-index="${index}"
              data-bullet-index="${bulletIndex}"
            >
              Delete
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderEditorCardHeader({ title, section, index }) {
  return `
    <div class="entry-editor-header">
      <h4>${title}</h4>

      <button
        type="button"
        class="editor-btn danger-btn"
        data-action="remove-entry"
        data-section="${section}"
        data-index="${index}"
      >
        Delete
      </button>
    </div>
  `;
}

function renderEducationEditor() {
  const educationEditor = requireElement("#education-editor");

  const entriesHTML = resume.education
    .map((item, index) => {
      return `
        <div class="entry-editor">
          ${renderEditorCardHeader({
            title: `Education ${index + 1}`,
            section: "education",
            index,
          })}

          ${renderArrayTextInput({
            section: "education",
            index,
            field: "school",
            label: "School",
            value: item.school,
            placeholder: "School name",
          })}

          ${renderArrayTextarea({
            section: "education",
            index,
            field: "degree",
            label: "Degree",
            value: item.degree,
            placeholder: "Degree, concentration, GPA",
            rows: 3,
          })}

          ${renderArrayTextInput({
            section: "education",
            index,
            field: "location",
            label: "Location",
            value: item.location,
            placeholder: "City, State",
          })}

          ${renderArrayTextInput({
            section: "education",
            index,
            field: "dateRange",
            label: "Date Range",
            value: item.dateRange,
            placeholder: "Graduation Date",
          })}

          ${renderArrayTextarea({
            section: "education",
            index,
            field: "thesis",
            label: "Thesis",
            value: item.thesis,
            placeholder: "Optional thesis",
            rows: 3,
          })}

          ${renderArrayTextarea({
            section: "education",
            index,
            field: "coursework",
            label: "Relevant Coursework",
            value: item.coursework,
            placeholder: "Relevant Coursework: ...",
            rows: 4,
          })}
        </div>
      `;
    })
    .join("");

  educationEditor.innerHTML = `
    ${entriesHTML}

    <button
      type="button"
      class="editor-btn add-btn"
      data-action="add-entry"
      data-section="education"
    >
      + Add Education
    </button>
  `;
}

function renderBulletedSectionEditor({ section, label }) {
  const sectionEditor = requireElement(`#${section}-editor`);

  const entriesHTML = resume[section]
    .map((item, index) => {
      return `
        <div class="entry-editor">
          ${renderEditorCardHeader({
            title: `${label} ${index + 1}`,
            section,
            index,
          })}

          ${renderArrayTextInput({
            section,
            index,
            field: "organization",
            label: "Organization",
            value: item.organization,
            placeholder: "Organization name",
          })}

          ${renderArrayTextInput({
            section,
            index,
            field: "role",
            label: "Role",
            value: item.role,
            placeholder: "Role or position title",
          })}

          ${renderArrayTextInput({
            section,
            index,
            field: "location",
            label: "Location",
            value: item.location,
            placeholder: "City, State",
          })}

          ${renderArrayTextInput({
            section,
            index,
            field: "dateRange",
            label: "Date Range",
            value: item.dateRange,
            placeholder: "Month Year – Month Year",
          })}

          <div class="nested-editor-block">
            <div class="nested-editor-header">
              <h5>Bullets</h5>

              <button
                type="button"
                class="editor-btn add-btn small-btn"
                data-action="add-bullet"
                data-section="${section}"
                data-index="${index}"
              >
                + Add Bullet
              </button>
            </div>

            ${renderBulletInputs({
              section,
              index,
              bullets: item.bullets,
            })}
          </div>
        </div>
      `;
    })
    .join("");

  sectionEditor.innerHTML = `
    ${entriesHTML}

    <button
      type="button"
      class="editor-btn add-btn"
      data-action="add-entry"
      data-section="${section}"
    >
      + Add ${label}
    </button>
  `;
}

function renderSkillsEditor() {
  const skillsEditor = requireElement("#skills-editor");

  const entriesHTML = resume.skills
    .map((item, index) => {
      return `
        <div class="entry-editor">
          ${renderEditorCardHeader({
            title: `Skill ${index + 1}`,
            section: "skills",
            index,
          })}

          ${renderArrayTextInput({
            section: "skills",
            index,
            field: "label",
            label: "Label",
            value: item.label,
            placeholder: "Technical, Language, Interests, etc.",
          })}

          ${renderArrayTextarea({
            section: "skills",
            index,
            field: "text",
            label: "Description",
            value: item.text,
            placeholder: "Describe this skill category",
            rows: 5,
          })}
        </div>
      `;
    })
    .join("");

  skillsEditor.innerHTML = `
    ${entriesHTML}

    <button
      type="button"
      class="editor-btn add-btn"
      data-action="add-entry"
      data-section="skills"
    >
      + Add Skill
    </button>
  `;
}

function renderAllEditors() {
  renderEducationEditor();

  renderBulletedSectionEditor({
    section: "experience",
    label: "Experience",
  });

  renderBulletedSectionEditor({
    section: "leadership",
    label: "Leadership",
  });

  renderSkillsEditor();

  syncBasicsInputs();
}

function syncBasicsInputs() {
  const basicsInputs = document.querySelectorAll(".basics-input");

  basicsInputs.forEach((input) => {
    const field = input.dataset.field;

    if (!field) {
      throw new Error("A basics input is missing its data-field attribute.");
    }

    input.value = resume.basics[field];
  });
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
        "An array input is missing data-section, data-index, or data-field.",
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
        "A bullet input is missing data-section, data-index, or data-bullet-index.",
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

  if (action === "add-entry") {
    resume[section].push(createEntry(section));
    saveResume();
    render();
    renderAllEditors();
    updatePageWarning();
    showSaveStatus();
    return;
  }

  if (action === "remove-entry") {
    resume[section].splice(index, 1);
    saveResume();
    render();
    renderAllEditors();
    updatePageWarning();
    showSaveStatus();
    return;
  }

  if (action === "add-bullet") {
    resume[section][index].bullets.push("New bullet.");
    saveResume();
    render();
    renderAllEditors();
    updatePageWarning();
    showSaveStatus();
    return;
  }

  if (action === "remove-bullet") {
    resume[section][index].bullets.splice(bulletIndex, 1);
    saveResume();
    render();
    renderAllEditors();
    updatePageWarning();
    showSaveStatus();
  }

  if (action === "reset-resume") {
    clearSavedResume();
    showSaveStatus("Resetting...");
    window.location.reload();
    return;
  }
}

export function setupEvents() {
  const editor = requireElement("#editor");

  renderAllEditors();
  updatePageWarning();

  editor.addEventListener("input", handleInput);
  editor.addEventListener("click", handleClick);
}
