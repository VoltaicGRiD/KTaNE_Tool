<script setup lang="ts">
import { ref } from 'vue'
import HorizontalScrollContainer from './HorizontalScrollContainer.vue'
import MorseCodeTranslator from './MorseCodeTranslator.vue';
import PortsReference from './PortsReference.vue';
import KeyboardReference from './KeyboardReference.vue';

const scrollComponents = ref([
  { name: 'Morse', component: MorseCodeTranslator },
  { name: 'Ports', component: PortsReference },
  { name: 'Keyboard', component: KeyboardReference },
])
</script>

<template>
  <HorizontalScrollContainer :components="scrollComponents" />

  
</template>