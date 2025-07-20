<script setup lang="ts">
import { ref, onMounted } from 'vue'

const ktaneLogo = new URL('../assets/ktane-logo.png', import.meta.url).href

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

const newFavorite = ref('')

onMounted(() => {
  loadFavorites()
})

const width = ref(window.innerWidth)

</script>

<template>
  <div v-if="width < 600" class="mobile-favorites">
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
          @keyup.enter="addFavorite(newFavorite); newFavorite = ''"
        />
        <button @click="addFavorite(newFavorite); newFavorite = ''">Add</button>
      </div>

      <ul class="favorites-list">
        <li class="favorite-item" v-for="link in favorites" :key="link">
          <a :href="link" target="_blank" rel="noopener noreferrer">
            {{
            link.split('/').pop()?.split('.')[0]
              .replace(/_/g, ' ')
              .replace(/%20/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase())
            }}
          </a>
          <button @click="removeFavorite(link)">X</button>
        </li>
      </ul>
    </div>
  </div>
</template>