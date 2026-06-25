const STORAGE_KEY = "royal-notes-app";

const noteDetails = document.getElementById("noteDetails");
const webAdvice = document.getElementById("webAdvice");

function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function getNoteIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderNote(note) {
  noteDetails.innerHTML = `
    <div class="detail-block">
      <h3>${escapeHtml(note.title)}</h3>
      <p class="small">Ticket Number: <strong>${escapeHtml(note.ticketNumber)}</strong></p>
      <p class="small">Category: <strong>${escapeHtml(note.category)}</strong></p>
      <p class="small">Created: ${new Date(note.createdAt).toLocaleString()}</p>
      <p class="small">Last Updated: ${new Date(note.updatedAt).toLocaleString()}</p>
    </div>

    <div class="detail-block">
      <h3>Tags</h3>
      <div class="tag-list">
        ${note.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("") || `<span class="small">No tags</span>`}
      </div>
    </div>

    <div class="detail-block">
      <h3>Symptoms</h3>
      <p>${escapeHtml(note.symptoms || "No symptoms added.")}</p>
    </div>

    <div class="detail-block">
      <h3>Resolution</h3>
      <p>${escapeHtml(note.resolution || "No resolution added.")}</p>
    </div>

    <div class="detail-block">
      <h3>Additional Notes</h3>
      <p>${escapeHtml(note.notes || "No extra notes added.")}</p>
    </div>
  `;
}

function buildAdvice(note) {
  const topic = `${note.title} ${note.category} ${note.tags.join(" ")}`.toLowerCase();

  const advice = [];

  if (topic.includes("vpn")) {
    advice.push("Check whether MFA or a password reset may require re-authentication on the VPN client.");
    advice.push("Some VPN issues happen after network changes, updates, or saved credential expiration.");
    advice.push("If a device was recently updated, the VPN profile may need to be reconnected or refreshed.");
  }

  if (topic.includes("printer")) {
    advice.push("Printers often need queue clearing, driver refresh, or a power cycle after a failed job.");
    advice.push("If printing fails only from one app, the issue may be app-specific rather than the printer itself.");
    advice.push("Check default printer selection and whether the printer is on the correct network.");
  }

  if (topic.includes("email")) {
    advice.push("Email issues can involve cached credentials, mailbox sync, forwarding rules, or profile corruption.");
    advice.push("If mail is missing on one device only, compare account settings across devices.");
    advice.push("Outlook profile repair or re-sign-in can fix some recurring mail access problems.");
  }

  if (topic.includes("password") || topic.includes("account")) {
    advice.push("Account issues may require waiting for sync delays after a password reset or lockout release.");
    advice.push("MFA prompts, browser cache, and stale sessions can continue to cause login trouble after a reset.");
    advice.push("If the user can log in elsewhere, the issue may be device/session-specific.");
  }

  if (topic.includes("network") || topic.includes("internet")) {
    advice.push("Network issues often improve after checking cable/Wi‑Fi status, DNS, and gateway reachability.");
    advice.push("If only one app is affected, the problem may be service-specific rather than full network failure.");
    advice.push("Testing with another device helps tell if it is a device problem or a network problem.");
  }

  if (advice.length === 0) {
    advice.push("Try documenting the exact trigger, error message, and fix so the next similar ticket is faster to solve.");
    advice.push("A note with cause, symptoms, and resolution makes future troubleshooting much easier.");
    advice.push("If this issue repeats, compare it with any recent changes like updates, password resets, or account changes.");
  }

  return advice;
}

function renderAdvice(note) {
  const advice = buildAdvice(note);

  webAdvice.innerHTML = `
    <div class="web-result">
      <h4>Helpful advice for this topic</h4>
      <ul>
        ${advice.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <p class="small">
        Tip: If you want, I can later help you connect this to a real online search tool or knowledge API.
      </p>
    </div>
  `;
}

const notes = loadNotes();
const noteId = getNoteIdFromUrl();
const note = notes.find(n => n.id === noteId);

if (!note) {
  noteDetails.innerHTML = `<p class="small">Note not found. Go back to the archive.</p>`;
  webAdvice.innerHTML = "";
} else {
  renderNote(note);
  renderAdvice(note);
}
