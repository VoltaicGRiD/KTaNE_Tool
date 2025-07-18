<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

defineProps<{ msg: string }>()

// Import or define the path to your KTaNE logo image
const ktaneLogo = new URL('../assets/ktane-logo.png', import.meta.url).href

const dBatt = ref(0)
const aaBatt = ref(0)
const volt = ref(0)
const serial = ref('')
const litIndicators = ref<string[]>([])
const unlitIndicators = ref<string[]>([])

const FAVORITES_KEY = 'ktane-favorites'
const favorites = ref<string[]>([])

function loadFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY)
  favorites.value = data ? JSON.parse(data) : []
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
}

function addFavorite(link: string) {
  if (!favorites.value.includes(link)) {
    favorites.value.push(link)
    saveFavorites()
  }
}

function removeFavorite(link: string) {
  favorites.value = favorites.value.filter(l => l !== link)
  saveFavorites()
}

const allIndicators = [
  'SND', 'CLR', 'CAR', 'IND', 'FRQ', 'SIG', 'NSA', 'MSA', 'TRN', 'BOB', 'FRK',
]
const showIndicatorModal = ref(false)
const indicatorIsLit = ref(true)
const availableIndicators = computed(() => {
  return allIndicators.filter(ind => !unlitIndicators.value.includes(ind) && !litIndicators.value.includes(ind))
})
const ports = ref({
  DVI: 0,
  Parallel: 0,
  Serial: 0,
  PS2: 0,
  RJ45: 0,
  RCA: 0,
  EMPTY: 0
})

const newFavorite = ref('')

function openIndicatorModal(isLit: boolean) {
  indicatorIsLit.value = isLit
  showIndicatorModal.value = true
}

function closeIndicatorModal() {
  showIndicatorModal.value = false
}

function addLitIndicator(ind: string) {
  litIndicators.value.push(ind)
  closeIndicatorModal()
}

function addUnlitIndicator(ind: string) {
  unlitIndicators.value.push(ind)
  closeIndicatorModal()
}

onMounted(loadFavorites)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <div class="battery-group">
      <div class="button-group">
        <button class="decrement" type="button" @click="dBatt--">-</button>
        <span>D Battery: {{ dBatt }}</span>
        <button class="increment" type="button" @click="dBatt++">+</button>
      </div>

      <div class="button-group">
        <button class="decrement" type="button" @click="aaBatt--">-</button>
        <span>AA Battery: {{ aaBatt }}</span>
        <button class="increment" type="button" @click="aaBatt++">+</button>
      </div>

      <div class="button-group">
        <button class="decrement" type="button" @click="volt--">-</button>
        <span>Voltage: {{ volt }}</span>
        <button class="increment" type="button" @click="volt++">+</button>
      </div>
    </div>

    <div class="center">
      <input
        class="serial-input"
        type="text"
        v-model="serial"
        placeholder="Serial Number"
        maxlength="6"
      />

      <div class="button-group">
        <button class="add-lit-indicator" type="button" @click="openIndicatorModal(true)">
          Add Lit Indicator
        </button>

        <button class="add-unlit-indicator" type="button" @click="openIndicatorModal(false)">
          Add Unlit Indicator
        </button>
      </div>

      <div class="indicators">
        <h2>Lit Indicators</h2>
        <ul class="lit-indicators">
          <li class="lit" v-for="ind in litIndicators" :key="ind">{{ ind }}</li>
        </ul>

        <h2>Unlit Indicators</h2>
        <ul class="unlit-indicators">
          <li class="unlit" v-for="ind in unlitIndicators" :key="ind">{{ ind }}</li>
        </ul>
      </div>

      <a href="https://ktane.timwi.de/" target="_blank" rel="noopener noreferrer" class="ktane-link">
        <img :src="ktaneLogo" alt="KTaNE Logo" class="ktane-logo" />
        <span class="ktane-link-text">KTaNE Module Repository</span>
      </a>

      <div class="favorites">
        <h2>Favorites</h2>
        
        <div class="button-group">
          <input 
            v-model="newFavorite"
            type="text"
            placeholder="Add a favorite link"
            @keyup.enter="addFavorite(newFavorite)"
          />
          <button @click="addFavorite(newFavorite)">Add</button>
        </div>

        <ul class="favorites-list">
          <li class="favorite-item" v-for="link in favorites" :key="link">
            <a :href="link" target="_blank" rel="noopener noreferrer">
              {{
              link.split('/').pop()?.split('.')[0]
                .replace(/_/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase())
              }}
            </a>
            <button @click="removeFavorite(link)">X</button>
          </li>
        </ul>
      </div>
    </div>

    <div class="port-group">
      <label v-for="(count, port) in ports" :key="port">
        <div class="button-group">
          <button
            class="decrement"
            type="button"
            @click="ports[port]--"
          >-</button>
          <span>{{ port }}: {{ count }}</span>
          <button
            class="increment"
            type="button"
            @click="ports[port]++"
          >+</button>
        </div>
      </label>
    </div>

    <div v-if="showIndicatorModal" class="modal-overlay">
      <div class="modal-dialog">
        <ul class="indicator-list">
          <li v-for="ind in availableIndicators" :key="ind">
            <button @click="indicatorIsLit ? addLitIndicator(ind) : addUnlitIndicator(ind)">{{ ind }}</button>
          </li>
        </ul>
        <button class="close-modal" @click="closeIndicatorModal">Cancel</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.ktane-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  margin-top: 24px;
}

.ktane-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.ktane-link-text {
  font-size: 1.1rem;
  color: #1976d2;
  vertical-align: middle;
}
</style>
