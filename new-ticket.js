const STORAGE_KEY = "royal-ticket-storage";

const form = document.getElementById("newTicketForm");
const ticketNumberInput = document.getElementById("ticketNumber");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const tagsInput = document.getElementById("tags");
const symptomsInput = document.getElementById("symptoms");
const resolutionInput = document.getElementById("resolution");
const notesInput = document.getElementById("notes");
const saveMessage = document.getElementById("saveMessage");

function loadTickets() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ticketNumber = ticketNumberInput.value.trim();
  const title = titleInput.value.trim();
  const category = categoryInput.value.trim();

  if (!ticketNumber || !title || !category) {
    alert("Please fill in Ticket Number, Title, and Category.");
    return;
  }

  const tickets = loadTickets();
  const now = new Date().toISOString();

  const newTicket = {
    id: crypto.randomUUID(),
    ticketNumber,
    title,
    category,
    tags: tagsInput.value.split(",").map(t => t.trim()).filter(Boolean),
    symptoms: symptomsInput.value.trim(),
    resolution: resolutionInput.value.trim(),
    notes: notesInput.value.trim(),
    createdAt: now,
    updatedAt: now
  };

  tickets.unshift(newTicket);
  saveTickets(tickets);

  saveMessage.textContent = `✨ Ticket ${ticketNumber} saved to the archive!`;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 800);
});
