<script setup lang="ts">
import MainScreen from './components/MainScreen.vue'
import PWABadge from './components/PWABadge.vue'
import HorizontalScrollContainer from './components/HorizontalScrollContainer.vue'

// Set to true to use horizontal scrolling, false for the current layout
const useHorizontalScrolling = true
</script>

<template>
  <div v-if="useHorizontalScrolling">
    <HorizontalScrollContainer />
    <PWABadge />
  </div>
  <div v-else>
    <MainScreen msg="KTaNE Tool" />
    <PWABadge />
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
