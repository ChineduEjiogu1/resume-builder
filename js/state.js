// state.js — owns the resume data shape and default starter data.

export function createDefaultResume() {
  return {
    basics: {
      name: "Jane Doe",
      address: "123 Developer Way",
      cityState: "Brooklyn, NY",
      email: "jane.doe@example.com",
      phone: "(555) 123-4567",
    },

    education: [
      {
        school: "Harvard University",
        degree: "A.B. in Computer Science, Mind/Brain/Behavior Track. GPA 3.91",
        location: "Cambridge, MA",
        dateRange: "May 2025",
        thesis: "Thesis: Neural Network Efficiency in Low-Power Devices",
        coursework:
          "Relevant Coursework: Systems Programming, Machine Learning, Cognitive Neuroscience",
      },
      {
        school: "High School Name",
        degree: "Graduated with Honors. SAT: 1540",
        location: "City, State",
        dateRange: "June 2021",
        thesis: "",
        coursework: "",
      },
    ],

    experience: [
      {
        organization: "TechCorp",
        role: "Senior Frontend Engineer",
        location: "Brooklyn, NY",
        dateRange: "January 2024 – Present",
        bullets: [
          "Spearheaded the migration of the core web application to React, improving load times by 40%.",
          "Mentored junior developers and established code review best practices for a team of 8 engineers.",
          "Collaborated with product design to build and maintain a scalable component library.",
        ],
      },
    ],

    leadership: [
      {
        organization: "Harvard Computer Society",
        role: "Vice President",
        location: "Cambridge, MA",
        dateRange: "Sep 2023 – Present",
        bullets: [
          "Organized weekly technical workshops and guest speaker series for over 200 undergraduate members.",
          "Led a team of 5 student developers to rebuild the club's internal project matching portal using vanilla JS.",
        ],
      },
      {
        organization: "Habitat for Humanity",
        role: "Volunteer Build Leader",
        location: "Boston, MA",
        dateRange: "May 2022 – Aug 2022",
        bullets: [
          "Coordinated on-site construction tasks and safety briefings for teams of 15+ weekly volunteers.",
          "Managed tool inventory and material logistics to keep community housing builds tracking on schedule.",
        ],
      },
    ],

    skills: [
      {
        label: "Technical",
        text: "JavaScript, HTML, CSS, React, Node.js, Git/GitHub",
      },
      {
        label: "Language",
        text: "English; list additional languages and fluency levels here",
      },
      {
        label: "Laboratory",
        text: "List scientific / research lab techniques or tools, if applicable",
      },
      {
        label: "Interests",
        text: "List activities you enjoy that may spark interview conversation",
      },
    ],
  };
}

export const resume = createDefaultResume();

export function createEntry(section) {
  if (section === "education") {
    return {
      school: "New School",
      degree: "Degree, Concentration",
      location: "City, State",
      dateRange: "Month Year",
      thesis: "",
      coursework: "",
    };
  }

  if (section === "experience") {
    return {
      organization: "New Organization",
      role: "New Position",
      location: "City, State",
      dateRange: "Month Year – Month Year",
      bullets: ["New experience bullet."],
    };
  }

  if (section === "leadership") {
    return {
      organization: "New Organization",
      role: "New Role",
      location: "City, State",
      dateRange: "Month Year – Month Year",
      bullets: ["New leadership bullet."],
    };
  }

  if (section === "skills") {
    return {
      label: "New Category",
      text: "Describe this category.",
    };
  }

  throw new Error(`Unknown section: ${section}`);
}

export function replaceResume(nextResume) {
  const freshResume = createDefaultResume();

  Object.keys(resume).forEach((key) => {
    delete resume[key];
  });

  Object.assign(resume, freshResume, nextResume);
}

export function resetResume() {
  replaceResume(createDefaultResume());
}