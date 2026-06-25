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
    advice.push("VPN issues can happen after password resets, MFA changes, or device updates.");
    advice.push("If one device works and another does not, the problem may be local to the device.");
    advice.push("Try checking credentials, VPN client version, and profile refresh.");
  } else if (topic.includes("printer")) {
    advice.push("Printers often need queue clearing, a restart, or a driver refresh after errors.");
    advice.push("If only one app cannot print, the issue may be app-specific.");
    advice.push("Check network printer availability and default printer settings.");
  } else if (topic.includes("email")) {
    advice.push("Email problems can involve cached credentials, mailbox sync, or Outlook profile issues.");
    advice.push("If the problem is device-specific, compare settings across devices.");
    advice.push("Consider sign-out/sign-in, profile repair, or checking forwarding rules.");
  } else if (topic.includes("password") || topic.includes("account")) {
    advice.push("Account issues may take time to fully sync after a reset or unlock.");
    advice.push("Stale browser sessions can still cause login errors after a password change.");
    advice.push("Try testing in another browser or private window.");
  } else if (topic.includes("network") || topic.includes("internet")) {
    advice.push("Network problems can come from DNS, Wi‑Fi, cable, or gateway issues.");
    advice.push("If only one service is affected, the issue may not be the whole network.");
    advice.push("Try testing from another device to narrow down the cause.");
  } else {
    advice.push("Documenting the trigger, exact error, and fix will help future tickets go faster.");
    advice.push("If this issue repeats, check for recent changes like updates or account changes.");
    advice.push("A good note should include symptoms, cause, and resolution.");
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
