<script setup lang="ts">
import { ref, inject } from 'vue'

const globalState = inject('globalState') as {
  trackers: [string, string[]][]
}

const msg = 'Trackers'

const newTrackerName = ref('')
const newTrackerState = ref('')

function addTracker() {
  if (newTrackerName.value && newTrackerState.value) {
    // Push values before clearing the refs
    globalState.trackers.push([newTrackerName.value, [newTrackerState.value]])
    newTrackerName.value = ''
    newTrackerState.value = ''
  }
}

function addState(boss: [string, string[]]) {
  if (newTrackerState.value) {
    boss[1].push(newTrackerState.value)
    newTrackerState.value = ''
  }
}

function removeState(boss: [string, string[]], state: string) {
  const idx = boss[1].indexOf(state)
  if (idx !== -1) boss[1].splice(idx, 1)
}

function clearTrackers() {
  globalState.trackers.splice(0, globalState.trackers.length)
}

const width = ref(window.innerWidth)

</script>
<template>
  <div v-if="width < 600">
    <h1>{{ msg }}</h1>
    <div class="boss-tracker">
      <input v-model="newTrackerName" placeholder="New Tracker Name" />
      <input v-model="newTrackerState" placeholder="New Tracker State" />
      <button @click="addTracker">Add Tracker</button>

      <ul>
        <li v-for="(tracker, index) in globalState.trackers" :key="index">
          <strong>{{ tracker[0] }}</strong>
          <ul>
            <li v-for="(state, stateIndex) in tracker[1]" :key="stateIndex">
              {{ state }}
              <button class="remove-state-button" @click="removeState(tracker, state)">X</button>
            </li>
            <li>
              <input v-model="newTrackerState" placeholder="New State" />
              <button @click="addState(tracker)">Add State</button>
            </li>
          </ul>
        </li>
      </ul>

      <button @click="clearTrackers">Clear All Trackers</button>
    </div>
  </div>

  <div v-else>
    <h1>{{ msg }}</h1>
    
    <div class="desktop-tracker-buttons">
      <input v-model="newTrackerName" placeholder="New Tracker Name" />
      <input v-model="newTrackerState" placeholder="New Tracker State" />
      <button @click="addTracker">Add Tracker</button>
      <button @click="clearTrackers">Clear All Trackers</button>
    </div>

    <div class="desktop-tracker">
      <div v-for="(tracker, index) in globalState.trackers" :key="index" class="tracker-item">
        <strong>{{ tracker[0] }}</strong>
        <ul>
          <li v-for="(state, stateIndex) in tracker[1]" :key="stateIndex">
            {{ state }}
            <button class="remove-state-button" @click="removeState(tracker, state)">X</button>
          </li>
          <li>
            <input v-model="newTrackerState" placeholder="New State" />
            <button @click="addState(tracker)">Add State</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>