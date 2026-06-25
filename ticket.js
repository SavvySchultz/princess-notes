const STORAGE_KEY = "royal-ticket-storage";

const ticketView = document.getElementById("ticketView");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const editForm = document.getElementById("editForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const ticketMessage = document.getElementById("ticketMessage");

const editTicketNumber = document.getElementById("editTicketNumber");
const editTitle = document.getElementById("editTitle");
const editCategory = document.getElementById("editCategory");
const editTags = document.getElementById("editTags");
const editSymptoms = document.getElementById("editSymptoms");
const editResolution = document.getElementById("editResolution");
const editNotes = document.getElementById("editNotes");

function loadTickets() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function getTicketIdFromUrl() {
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

let tickets = loadTickets();
let ticketId = getTicketIdFromUrl();
let ticket = tickets.find(t => t.id === ticketId);

if (!ticket) {
  ticketView.innerHTML = `<p class="small">Ticket not found. Go back to the archive.</p>`;
  editBtn.disabled = true;
  deleteBtn.disabled = true;
} else {
  renderTicket(ticket);
}

function renderTicket(ticket) {
  ticketView.innerHTML = `
    <div class="detail-block">
      <h3>${escapeHtml(ticket.title)}</h3>
      <p class="small">Ticket Number: <strong>${escapeHtml(ticket.ticketNumber)}</strong></p>
      <p class="small">Category: <strong>${escapeHtml(ticket.category)}</strong></p>
      <p class="small">Created: ${new Date(ticket.createdAt).toLocaleString()}</p>
      <p class="small">Last Updated: ${new Date(ticket.updatedAt).toLocaleString()}</p>
    </div>

    <div class="detail-block">
      <h3>Tags</h3>
      <div class="tag-list">
        ${(ticket.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("") || `<span class="small">No tags</span>`}
      </div>
    </div>

    <div class="detail-block">
      <h3>Symptoms</h3>
      <p>${escapeHtml(ticket.symptoms || "No symptoms added.")}</p>
    </div>

    <div class="detail-block">
      <h3>Resolution</h3>
      <p>${escapeHtml(ticket.resolution || "No resolution added.")}</p>
    </div>

    <div class="detail-block">
      <h3>Additional Notes</h3>
      <p>${escapeHtml(ticket.notes || "No extra notes added.")}</p>
    </div>
  `;
}

editBtn.addEventListener("click", () => {
  if (!ticket) return;

  editForm.style.display = "block";

  editTicketNumber.value = ticket.ticketNumber;
  editTitle.value = ticket.title;
  editCategory.value = ticket.category;
  editTags.value = (ticket.tags || []).join(", ");
  editSymptoms.value = ticket.symptoms || "";
  editResolution.value = ticket.resolution || "";
  editNotes.value = ticket.notes || "";

  ticketMessage.textContent = "Editing is now open for this ticket.";
});

cancelEditBtn.addEventListener("click", () => {
  editForm.style.display = "none";
  ticketMessage.textContent = "";
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!ticket) return;

  const index = tickets.findIndex(t => t.id === ticket.id);
  if (index === -1) return;

  tickets[index] = {
    ...tickets[index],
    ticketNumber: editTicketNumber.value.trim(),
    title: editTitle.value.trim(),
    category: editCategory.value.trim(),
    tags: editTags.value.split(",").map(t => t.trim()).filter(Boolean),
    symptoms: editSymptoms.value.trim(),
    resolution: editResolution.value.trim(),
    notes: editNotes.value.trim(),
    updatedAt: new Date().toISOString()
  };

  saveTickets(tickets);
  ticket = tickets[index];
  renderTicket(ticket);
  editForm.style.display = "none";
  ticketMessage.textContent = "✨ Ticket updated successfully!";
});

deleteBtn.addEventListener("click", () => {
  if (!ticket) return;

  const ok = confirm(`Delete ticket ${ticket.ticketNumber}?`);
  if (!ok) return;

  tickets = tickets.filter(t => t.id !== ticket.id);
  saveTickets(tickets);
  window.location.href = "index.html";
});
