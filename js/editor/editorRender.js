// editorRender.js — generates the editor form fields from resume state.

import { resume } from "../state.js";
import { requireElement } from "../utils/dom.js";
import { escapeHTML } from "../utils/escapeHTML.js";

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

export function renderAllEditors() {
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