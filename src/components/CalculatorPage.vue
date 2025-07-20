<script setup lang="ts">
import { ref } from 'vue'

const input = ref<number | null>(null)
const result = ref<number | null>(null)

function calculate() {
  if (input.value !== null) {
    result.value = input.value * 2
  }
}
</script>

<template>
  <div>
    <input v-model="input" type="number" placeholder="Enter a number" />
    <button @click="calculate">Calculate</button>
    <p v-if="result !== null">Result: {{ result }}</p>
  </div>
</template>