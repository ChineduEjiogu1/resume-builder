// status.js — handles the small "Saved locally" message.

let saveStatusTimerId = null;

export function showSaveStatus(message = "Saved locally") {
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