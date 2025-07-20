<script setup lang="ts">
const ktanePorts = new URL('../assets/ktane-ports.png', import.meta.url).href
</script>

<template>
    <a href="#" target="_blank" rel="noopener noreferrer" class="ktane-link">
      <img :src="ktanePorts" alt="KTaNE Logo" class="ktane-logo" />
    </a>
</template>