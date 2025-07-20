<script setup lang="ts">
import { ref, onMounted } from 'vue'

const morseCode = ref<string[][]>([])
const morseCodeInput = ref('')
const morseCodeOutput = ref('')

onMounted(() => {
  // Load Morse code data
  morseCode.value = [
    ['A', '.-'],
    ['B', '-...'],
    ['C', '-.-.'],
    ['D', '-..'],
    ['E', '.'],
    ['F', '..-.'],
    ['G', '--.'],
    ['H', '....'],
    ['I', '..'],
    ['J', '.---'],
    ['K', '-.-'],
    ['L', '.-..'],
    ['M', '--'],
    ['N', '-.'],
    ['O', '---'],
    ['P', '.--.'],
    ['Q', '--.-'],
    ['R', '.-.'],
    ['S', '...'],
    ['T', '-'],
    ['U', '..-'],
    ['V', '...-'],
    ['W', '.--'],
    ['X', '-..-'],
    ['Y', '-.--'],
    ['Z', '--..'],
    ['1', '.----'],
    ['2', '..---'],
    ['3', '...--'],
    ['4', '....-'],
    ['5', '.....'],
    ['6', '-....'],
    ['7', '--...'],
    ['8', '---..'],
    ['9', '----.'],
    ['0', '-----']
  ]
})

function translateToMorse() {
  const input = morseCodeInput.value.toUpperCase()
  morseCodeOutput.value = input.split('').map(char => {
    const code = morseCode.value.find(c => c[0] === char)
    return code ? code[1] : ''
  }).join(' ')
}

function translateFromMorse() {
  const input = morseCodeOutput.value.trim().split(' ')
  morseCodeInput.value = input.map(code => {
    const char = morseCode.value.find(c => c[1] === code)
    return char ? char[0] : ''
  }).join('')
}

function clear() {
    morseCodeInput.value = ''
    morseCodeOutput.value = ''
}
</script>
<template>
  <div class="morse-code-container">
    <h1>Morse Code Translator</h1>
    <div class="input-section">
      <input v-model="morseCodeInput" type="text" placeholder="Regular Text"/>
      <button @click="translateToMorse">Translate to Morse Code</button>
    </div>
    <div class="output-section">
      <input v-model="morseCodeOutput" type="text" placeholder="Morse Code" />
      <div class="morse-code-buttons">
        <button @click="morseCodeOutput += '.'">·</button>
        <button @click="morseCodeOutput += '-'">-</button>
        <button @click="morseCodeOutput += ' '">Space</button>
      </div>
      <button @click="translateFromMorse">Translate from Morse Code</button>
      <button @click="clear">Clear</button>
    </div>
  </div>
</template>