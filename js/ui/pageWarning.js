export function updatePageWarning() {
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