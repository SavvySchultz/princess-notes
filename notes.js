const STORAGE_KEY = "royal-notes-app";

const noteDetails = document.getElementById("noteDetails");
const searchWebBtn = document.getElementById("searchWebBtn");
const webStatus = document.getElementById("webStatus");
const webResults = document.getElementById("webResults");

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

function searchWeb(topic) {
  return [
    {
      title: `${topic} troubleshooting guide`,
      url: `https://www.google.com/search?q=${encodeURIComponent(topic + " troubleshooting guide")}`,
      snippet: `Search results for ${topic} troubleshooting and general guidance.`
    },
    {
      title: `${topic} documentation`,
      url: `https://www.google.com/search?q=${encodeURIComponent(topic + " documentation")}`,
      snippet: `Documentation and official help resources for ${topic}.`
    },
    {
      title: `${topic} best practices`,
      url: `https://www.google.com/search?q=${encodeURIComponent(topic + " best practices")}`,
      snippet: `Best practice ideas and related knowledge for ${topic}.`
    }
  ];
}

function renderWebResults(results, topic) {
  webResults.innerHTML = `
    <h3>Results for: ${escapeHtml(topic)}</h3>
    ${results.map(result => `
      <div class="web-result">
        <h4><a href="${result.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(result.title)}</a></h4>
        <p class="small">${escapeHtml(result.snippet)}</p>
      </div>
    `).join("")}
  `;
}

const notes = loadNotes();
const noteId = getNoteIdFromUrl();
const note = notes.find(n => n.id === noteId);

if (!note) {
  noteDetails.innerHTML = `<p class="small">Note not found. Go back to the archive.</p>`;
  searchWebBtn.disabled = true;
} else {
  renderNote(note);
}

searchWebBtn.addEventListener("click", () => {
  if (!note) return;

  const ok = confirm(
    "Would you like me to search online for more knowledge about this topic?\n\nThis will use the note title/category and open helpful web resources."
  );

  if (!ok) return;

  webStatus.textContent = "Searching the royal web library...";

  const topic = `${note.title} ${note.category} ${note.tags.join(" ")}`.trim();
  const results = searchWeb(topic);

  setTimeout(() => {
    renderWebResults(results, topic);
    webStatus.textContent = "✨ Web knowledge search complete.";
  }, 500);
});
