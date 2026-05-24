# Resume Builder

A browser-based résumé builder built in **vanilla JavaScript, HTML, and CSS** — no
framework, no build step. You edit your details in a form on the left and watch a
formatted résumé update live on the right, then export it via the browser's
"Save as PDF".

This is a **learning project**. The point is not to ship the world's fanciest résumé
tool, but to hand-build the one discipline that frameworks like React automate for you:

> Keep all your data in one place, and rebuild the UI from that data whenever it changes.

If you internalize that single loop, a framework later will feel like "oh, this just
does the thing I was already doing by hand."

---

## How to run

No build tools required. Because the project uses JavaScript modules
(`<script type="module">`), it must be served over HTTP — opening `index.html` directly
as a `file://` will break the imports.

Use any static server, for example:

```bash
# Python (built in on most systems)
python3 -m http.server 8000

# or Node, if you prefer
npx serve
```

Then visit `http://localhost:8000`.

---

## Architecture

The whole app runs on one loop:

```
user does something  ->  update state  ->  render(state)  ->  save(state)
```

There is exactly **one path** from a user action to the screen updating. You never
surgically poke a single DOM node; you change the data and rebuild the view from it.
This is wasteful in theory (HTML is regenerated on every keystroke) and completely fine
in practice for an app this size — and it means the screen can never drift out of sync
with the data, because the data is the only source of truth.

### The data model

A résumé is just one structured, serializable object — the single source of truth.
Repeatable sections are arrays of objects, and each repeatable item carries a stable
`id` (so deleting or reordering entries stays reliable even as positions shift).

```js
const resume = {
  basics:     { name, title, email, phone, location, summary },
  experience: [ { id, company, role, startDate, endDate, bullets: [] } ],
  education:  [ { id, school, degree, year } ],
  skills:     [ /* strings */ ]
};
```

Because it's plain objects/arrays/strings, `JSON.stringify(resume)` gives you
localStorage persistence and PDF-source data for free.

---

## File structure

```
resume-builder/
├── index.html        Two panes: #editor (form) and #preview (live résumé)
├── css/
│   ├── reset.css     Normalize browser default styling
│   ├── app.css       The EDITOR UI — forms, buttons, layout (screen only)
│   └── print.css     The RÉSUMÉ OUTPUT — @media print, drives "Save as PDF"
├── js/
│   ├── state.js      Owns `resume` + the only functions allowed to mutate it
│   ├── render.js     Turns state into DOM; reflects only, decides nothing
│   ├── events.js     Listens for user actions (delegated), calls state, re-renders
│   ├── storage.js    save() / load() via localStorage
│   └── main.js       Entry point; wires it all together and runs the core loop
└── README.md
```

The separation that matters is **state.js vs render.js vs events.js**. The vanilla-JS
trap is doing everything inside one event handler — read the input, mutate a variable,
poke the DOM all in one place — which is exactly what rots over time. Keep them apart:

- **state** owns the data; nothing else mutates `resume` directly.
- **render** is a translation: given state, produce the DOM. No decisions.
- **events** listens, calls a state function, then triggers a re-render.

---

## Concepts this project teaches

- **State-driven rendering** — one data object, one render path; the mental model
  underneath React and friends.
- **Event delegation** — a single listener on a parent element instead of one per input,
  which is what lets dynamically-added entries work without re-wiring listeners.
- **Stable ids vs array indices** — why you key list items by id (the same reason React
  asks for a `key` prop — you'll hit the problem before you meet the solution).
- **Escaping user input** — injecting text into `innerHTML` is an XSS hole unless you
  escape it; frameworks quietly handle this, here you do it yourself.
- **Serializable state** — a clean data model makes persistence and export nearly free.

---

## Suggested build order

Build in this order so you're never stuck on something that depends on unfinished work:

1. Render `basics` with a couple of hardcoded fields.
2. Make those fields editable through the state → render loop.
3. Add the array sections (experience), rendered by looping over the array.
4. Add/delete buttons for array entries (the trickiest part).
5. Persistence with localStorage (`save` on change, `load` on startup).
6. `print.css` + "Save as PDF" — independent of everything above, so it comes last.

---

## Possible later extensions

Once the fundamentals are solid, natural next steps that each teach something new:

- Multiple résumé templates (swap the render layer / CSS).
- TypeScript — start by writing an `interface Resume` for the data model above.
- A real PDF export path (e.g. `@react-pdf/renderer` or server-side Puppeteer) if you
  outgrow browser print.
- Rebuild the same app in React or Svelte and compare — the payoff for doing it the
  hard way first.
