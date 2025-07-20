<script setup lang="ts">
import { ref, onMounted } from 'vue'

const ktaneLogo = new URL('../assets/ktane-logo.png', import.meta.url).href

const FAVORITES_KEY = 'ktane-favorites'
const favorites = ref<{ name: string; link: string }[]>([])

function loadFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY)
  favorites.value = data ? JSON.parse(data) : []
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
}

function addFavorite(link: string, name?: string) {
  if (
    link &&
    !favorites.value.some(fav => fav.link === link)
  ) {
    favorites.value.push({ name: name || link, link })
    saveFavorites()
  }
}

function removeFavorite(link: string) {
  favorites.value = favorites.value.filter(fav => fav.link !== link)
  saveFavorites()
}

const newFavorite = ref('')
const newFavoriteName = ref('')

onMounted(() => {
  loadFavorites()
})

const width = ref(window.innerWidth)

</script>

<template>
  <div v-if="width < 600" class="mobile-favorites">
    <h1>Favorites</h1>
    
    <a href="https://ktane.timwi.de/" target="_blank" rel="noopener noreferrer" class="ktane-link">
      <img :src="ktaneLogo" alt="KTaNE Logo" class="ktane-logo" />
      <span class="ktane-link-text">KTaNE Module Repository</span>
    </a>

    <div class="favorites">
      
      <div class="button-group">
        <input
          v-model="newFavoriteName"
          type="text"
          placeholder="Name"
        />
        <input
          v-model="newFavorite"
          type="text"
          placeholder="Link"
          @keyup.enter="addFavorite(newFavorite, newFavoriteName); newFavorite = ''; newFavoriteName = ''"
        />
        <button @click="addFavorite(newFavorite, newFavoriteName); newFavorite = ''; newFavoriteName = ''">Add</button>
      </div>

      <ul class="favorites-list">
        <li class="favorite-item" v-for="fav in favorites" :key="fav.link">
          <a :href="fav.link" target="_blank" rel="noopener noreferrer">
            {{ fav.name }}
          </a>
          <button @click="removeFavorite(fav.link)">X</button>
        </li>
      </ul>
    </div>
  </div>

  <div v-else class="desktop-favorites">
    <h1>Favorites</h1>
    
    <a href="https://ktane.timwi.de/" target="_blank" rel="noopener noreferrer" class="ktane-link">
      <img :src="ktaneLogo" alt="KTaNE Logo" class="ktane-logo" />
      <span class="ktane-link-text">KTaNE Module Repository</span>
    </a>

    <div class="favorites"> 
      <div class="button-group">
        <input
          v-model="newFavoriteName"
          class="favorite-input"
          type="text"
          placeholder="Name"
        />
        <input
          v-model="newFavorite"
          class="favorite-input"
          type="text"
          placeholder="Add a favorite link"
          @keyup.enter="addFavorite(newFavorite, newFavoriteName); newFavorite = ''; newFavoriteName = ''"
        />
        <button @click="addFavorite(newFavorite, newFavoriteName); newFavorite = ''; newFavoriteName = ''">Add</button>
      </div>

      <ul class="favorites-list">
        <li class="favorite-item" v-for="fav in favorites" :key="fav.link">
          <a :href="fav.link" target="_blank" rel="noopener noreferrer">
            {{ fav.name }}
          </a>
          <button @click="removeFavorite(fav.link)">X</button>
        </li>
      </ul>
    </div>
  </div>
</template>