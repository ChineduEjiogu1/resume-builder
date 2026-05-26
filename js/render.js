// render.js — turns the current state into the resume preview.
// Given `resume`, produce the HTML.
// Makes no decisions and never mutates state.

import { resume } from "./state.js";

function requireElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}

function renderHeader(basics) {
  return `
    <header class="name-and-contact-info">
      <h1>${basics.name}</h1>

      <p class="contact-info">
        ${basics.address} &bull;
        ${basics.cityState} &bull;
        <a href="mailto:${basics.email}">${basics.email}</a> &bull;
        ${basics.phone}
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
          <h3>${title}</h3>
          <p${subtitleClassAttribute}>${subtitle}</p>
        </div>

        <div class="meta-block">
          ${location}<br>
          ${dateRange}
        </div>
      </div>

      ${body}
    </div>
  `;
}

function renderEducation(educationItems) {
  return educationItems
    .map((item) => {
      const thesisHTML = item.thesis ? `<p>${item.thesis}</p>` : "";
      const courseworkHTML = item.coursework ? `<p>${item.coursework}</p>` : "";

      const bodyMarkup = `
        ${thesisHTML}
        ${courseworkHTML}
      `;

      return renderEntry({
        title: item.school,
        subtitle: item.degree,
        location: item.location,
        dateRange: item.dateRange,
        body: bodyMarkup,
      });
    })
    .join("");
}

function renderBulletedEntries(items) {
  return items
    .map((item) => {
      const bulletItemsHTML = item.bullets
        .map((bullet) => `<li>${bullet}</li>`)
        .join("");

      const bodyMarkup = `
        <ul class="describe-experience">
          ${bulletItemsHTML}
        </ul>
      `;

      return renderEntry({
        title: item.organization,
        subtitle: item.role,
        subtitleClass: "heavy-text",
        location: item.location,
        dateRange: item.dateRange,
        body: bodyMarkup,
      });
    })
    .join("");
}

function renderSkills(skillItems) {
  const skillItemsHTML = skillItems
    .map((item) => {
      return `
        <li>
          <span>${item.label}:</span> ${item.text}
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
      <h2>${title}</h2>
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