// render.js — turns the current state into the resume preview.

import { resume } from "./state.js";
import { requireElement } from "./utils/dom.js";
import { escapeHTML } from "./utils/escapeHTML.js";

function renderHeader(basics) {
  return `
    <header class="name-and-contact-info">
      <h1>${escapeHTML(basics.name)}</h1>

      <p class="contact-info">
        ${escapeHTML(basics.address)} &bull;
        ${escapeHTML(basics.cityState)} &bull;
        <a href="mailto:${escapeHTML(basics.email)}">${escapeHTML(
          basics.email
        )}</a> &bull;
        ${escapeHTML(basics.phone)}
      </p>
    </header>
  `;
}

function renderEntry({
  title,
  subtitle,
  subtitleClass = "",
  location,
  dateRange,
  body = "",
}) {
  const subtitleClassAttribute = subtitleClass
    ? ` class="${subtitleClass}"`
    : "";

  return `
    <div class="entry-container">
      <div class="entry-header">
        <div class="entry-title-block">
          <h3>${escapeHTML(title)}</h3>
          <p${subtitleClassAttribute}>${escapeHTML(subtitle)}</p>
        </div>

        <div class="meta-block">
          ${escapeHTML(location)}<br>
          ${escapeHTML(dateRange)}
        </div>
      </div>

      ${body}
    </div>
  `;
}

function renderEducation(educationItems) {
  return educationItems
    .map((item) => {
      const thesisHTML = item.thesis ? `<p>${escapeHTML(item.thesis)}</p>` : "";
      const courseworkHTML = item.coursework
        ? `<p>${escapeHTML(item.coursework)}</p>`
        : "";

      return renderEntry({
        title: item.school,
        subtitle: item.degree,
        location: item.location,
        dateRange: item.dateRange,
        body: `
          ${thesisHTML}
          ${courseworkHTML}
        `,
      });
    })
    .join("");
}

function renderBulletedEntries(items) {
  return items
    .map((item) => {
      const bulletItemsHTML = item.bullets
        .map((bullet) => `<li>${escapeHTML(bullet)}</li>`)
        .join("");

      return renderEntry({
        title: item.organization,
        subtitle: item.role,
        subtitleClass: "heavy-text",
        location: item.location,
        dateRange: item.dateRange,
        body: `
          <ul class="describe-experience">
            ${bulletItemsHTML}
          </ul>
        `,
      });
    })
    .join("");
}

function renderSkills(skillItems) {
  const skillItemsHTML = skillItems
    .map((item) => {
      return `
        <li>
          <span>${escapeHTML(item.label)}:</span> ${escapeHTML(item.text)}
        </li>
      `;
    })
    .join("");

  return `
    <ul class="describe-skills-interest">
      ${skillItemsHTML}
    </ul>
  `;
}

function renderSection(title, content) {
  return `
    <section class="resume-section">
      <h2>${escapeHTML(title)}</h2>
      ${content}
    </section>
  `;
}

export function render() {
  const preview = requireElement("#preview");

  preview.innerHTML = `
    ${renderHeader(resume.basics)}

    ${renderSection("Education", renderEducation(resume.education))}

    ${renderSection("Experience", renderBulletedEntries(resume.experience))}

    ${renderSection(
      "Leadership & Activities",
      renderBulletedEntries(resume.leadership)
    )}

    ${renderSection("Skills & Interests", renderSkills(resume.skills))}
  `;
}