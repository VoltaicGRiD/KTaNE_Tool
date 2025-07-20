<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  msg: string
}

defineProps<Props>()

const NOTES_KEY = 'ktane-notes'
const notes = ref<{ module: string; note: string }[]>([])
const newNoteModule = ref('')
const newNote = ref('')
const noteFilter = ref('')

function loadNotes() {
  const data = localStorage.getItem(NOTES_KEY)
  notes.value = data ? JSON.parse(data) : []
}

function saveNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes.value))
}

function addNote(module: string, note: string) {
  if (module.trim() && note.trim() && !notes.value.some(n => n.note === note.trim() && n.module === module.trim())) {
    notes.value.push({ module: module.trim(), note: note.trim() })
    saveNotes()
  }
}

function removeNote(module: string, note: string) {
  notes.value = notes.value.filter(n => n.module !== module || n.note !== note)
  saveNotes()
}

function filterNotes(filter: string) {
  // Assuming notes will be an array of objects: { module: string, note: string }
  // If not, you need to refactor your notes structure.
  const filterLower = filter.toLowerCase();
  return notes.value.filter(n =>
    n.module.toLowerCase().includes(filterLower) ||
    n.note.toLowerCase().includes(filterLower)
  );
}

onMounted(loadNotes)
</script>

<template>
  <div class="notes-container">
    <h1>{{ msg }}</h1>
    
    <div class="notes-content">
      <div class="notes-section">
        <h2>Your Notes</h2>
        
        <div class="button-group">
          <input 
            v-model="newNoteModule"
            type="text"
            placeholder="Module name"
            class="note-input"
          />
            <textarea
            v-model="newNote"
            placeholder="Add a note"
            @keyup.enter="addNote(newNoteModule, newNote); newNoteModule = ''; newNote = ''"
            class="note-input"
            rows="3"
            ></textarea>
          <button @click="addNote(newNoteModule, newNote); newNoteModule = ''; newNote = ''" class="add-button">Add</button>
        </div>

        <input 
          class="note-input"
          v-model="noteFilter"
          type="text"
          placeholder="Filter notes"
        />

        <ul class="notes-list" v-if="filterNotes(noteFilter).length > 0">
          <li class="note-item" v-for="note in filterNotes(noteFilter)" :key="note.module + '-' + note.note">
            <span class="note-text"><strong>{{ note.module }}:</strong> {{ note.note }}</span>
            <button @click="removeNote(note.module, note.note)" class="remove-button">X</button>
          </li>
        </ul>
        
        <div v-else class="empty-state">
          <p>No notes found. Try adjusting your filter or add a new note above!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notes-container {
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
}

.notes-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notes-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.notes-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #646cff;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.note-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
}

.note-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.add-button {
  padding: 0.5rem 1rem;
  border: 1px solid #646cff;
  border-radius: 4px;
  background: #646cff;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-button:hover {
  background: #535bf2;
  border-color: #535bf2;
}

.notes-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.note-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background-color 0.2s ease;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.note-text {
  flex: 1;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  text-align: left;
  line-height: 1.4;
  margin-right: 1rem;
}

.remove-button {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1em;
  padding: 0.25rem;
  border-radius: 3px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: rgba(255, 107, 107, 0.2);
  color: #ff5252;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state p {
  font-style: italic;
}

@media (max-width: 700px) {
  .notes-container {
    padding: 0rem;
  }
  
  .notes-section {
    padding: 1rem;
  }
  
  .button-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .note-input {
    width: 95%;
  }
  
  .add-button {
    width: 100%;
  }
  
  .note-item {
    padding: 0.25rem;
  }
  
  .note-text {
    margin-right: 0.75rem;
  }
}</style>