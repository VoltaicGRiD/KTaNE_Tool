<script setup lang="ts">

import { provide } from 'vue'
import { globalState } from './store/globalStore'

import HorizontalScrollContainer from './components/HorizontalScrollContainer.vue'
import MainScreen from './components/MainScreen.vue'
import NotesPage from './components/NotesPage.vue'
import FavoritesPage from './components/FavoritesPage.vue'
import BossTracker from './components/BossTracker.vue'
import ReferencePage from './components/ReferencePage.vue'

// Set to true to use horizontal scrolling, false for the current layout

// Provide the global state to all child components
provide('globalState', globalState)

const useHorizontalScrolling = true

const scrollComponents = [
  { name: 'Stats', component: MainScreen },
  { name: 'Tracker', component: BossTracker },
  { name: 'Notes', component: NotesPage },
  { name: 'Favorites', component: FavoritesPage },
  { name: 'Reference', component: ReferencePage },
]
</script>

<template>
  <div v-if="useHorizontalScrolling">
    <HorizontalScrollContainer :components="scrollComponents" />
  </div>
  <div v-else>
    <MainScreen msg="KTaNE Tool" />
  </div>
</template>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
