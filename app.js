const STORAGE_KEY = "royal-notes-app";

const noteForm = document.getElementById("noteForm");
const ticketNumberInput = document.getElementById("ticketNumber");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const tagsInput = document.getElementById("tags");
const symptomsInput = document.getElementById("symptoms");
const resolutionInput = document.getElementById("resolution");
const notesInput = document.getElementById("notes");
const noteList = document.getElementById("noteList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const newNoteBtn = document.getElementById("newNoteBtn");
const deleteBtn = document.getElementById("deleteBtn");
const saveMessage = document.getElementById("saveMessage");

let notes = loadNotes();
let editingId = null;

function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function getFormData() {
  return {
    ticketNumber: ticketNumberInput.value.trim(),
    title: titleInput.value.trim(),
    category: categoryInput.value.trim(),
    tags: tagsInput.value
      .split(",")
      .map(t => t.trim())
      .filter(Boolean),
    symptoms: symptomsInput.value.trim(),
    resolution: resolutionInput.value.trim(),
    notes: notesInput.value.trim(),
  };
}

function clearForm() {
  editingId = null;
  noteForm.reset();
  saveMessage.textContent = "";
}

function populateForm(note) {
  editingId = note.id;
  ticketNumberInput.value = note.ticketNumber;
  titleInput.value = note.title;
  categoryInput.value = note.category;
  tagsInput.value = note.tags.join(", ");
  symptomsInput.value = note.symptoms;
  resolutionInput.value = note.resolution;
  notesInput.value = note.notes;
  saveMessage.textContent = `Editing note ${note.ticketNumber}`;
}

function renderNotes() {
  const query = searchInput.value.toLowerCase().trim();
  const categoryFilter = filterCategory.value;

  const filtered = notes.filter(note => {
    const searchable = [
      note.ticketNumber,
      note.title,
      note.category,
      note.tags.join(" "),
      note.symptoms,
      note.resolution,
      note.notes
    ].join(" ").toLowerCase();

    const matchesQuery = !query || searchable.includes(query);
    const matchesCategory = !categoryFilter || note.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  noteList.innerHTML = "";

  if (filtered.length === 0) {
    noteList.innerHTML = `<div class="small">No notes found in the royal archive.</div>`;
    return;
  }

  filtered
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .forEach(note => {
      const div = document.createElement("div");
      div.className = "note-item";
      div.innerHTML = `
        <h4>${escapeHtml(note.title)}</h4>
        <div class="ticket">${escapeHtml(note.ticketNumber)}</div>
        <div class="meta">${escapeHtml(note.category)} • ${new Date(note.updatedAt).toLocaleDateString()}</div>
      `;
      div.addEventListener("click", () => {
        window.location.href = `note.html?id=${encodeURIComponent(note.id)}`;
      });
      noteList.appendChild(div);
    });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = getFormData();

  if (!data.ticketNumber || !data.title || !data.category) {
    alert("Please fill in Ticket Number, Title, and Category.");
    return;
  }

  const now = new Date().toISOString();

  if (editingId) {
    const index = notes.findIndex(n => n.id === editingId);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...data,
        updatedAt: now
      };
    }
  } else {
    notes.unshift({
      id: crypto.randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now
    });
  }

  saveNotes();
  renderNotes();
  saveMessage.textContent = `✨ Royal note saved for ${data.ticketNumber}!`;

  const current = editingId ? notes.find(n => n.id === editingId) : notes[0];
  if (current) {
    window.location.href = `note.html?id=${encodeURIComponent(current.id)}`;
  }

  editingId = null;
  noteForm.reset();
});

deleteBtn.addEventListener("click", () => {
  if (!editingId) {
    alert("Select a note to delete.");
    return;
  }

  const note = notes.find(n => n.id === editingId);
  if (!note) return;

  const ok = confirm(`Delete note ${note.ticketNumber}?`);
  if (!ok) return;

  notes = notes.filter(n => n.id !== editingId);
  saveNotes();
  clearForm();
  renderNotes();
});

newNoteBtn.addEventListener("click", clearForm);
searchInput.addEventListener("input", renderNotes);
filterCategory.addEventListener("change", renderNotes);

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterCategory.value = "";
  renderNotes();
});

renderNotes();
