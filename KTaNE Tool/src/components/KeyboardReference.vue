<script setup lang="ts">
const ktanePiano = new URL('../assets/ktane-piano.png', import.meta.url).href
</script>

<template>
    <a href="#" target="_blank" rel="noopener noreferrer" class="ktane-link">
      <img :src="ktanePiano" alt="KTaNE Logo" class="ktane-logo" />
    </a>
</template>