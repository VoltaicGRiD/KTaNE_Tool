<script setup lang="ts">
interface Props {
  dBatt: number
  aaBatt: number
  volt: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:dBatt': [value: number]
  'update:aaBatt': [value: number]
  'update:volt': [value: number]
}>()

function incrementDBatt() {
  emit('update:dBatt', props.dBatt + 1)
}

function decrementDBatt() {
  emit('update:dBatt', Math.max(props.dBatt - 1, 0)) // Ensure D battery count doesn't go below 0
}

function incrementAABatt() {
  emit('update:aaBatt', props.aaBatt + 1)
}

function decrementAABatt() {
  emit('update:aaBatt', Math.max(props.aaBatt - 1, 0)) // Ensure AA battery count doesn't go below 0
}

function incrementVolt() {
  emit('update:volt', props.volt + 0.5)
}

function decrementVolt() {
  emit('update:volt', Math.max(props.volt - 0.5, 0)) // Ensure voltage doesn't go below 0
}
</script>

<template>
  <div class="battery-group">
    <div class="button-group">
      <button class="decrement" type="button" @click="decrementDBatt">-</button>
      <span>D Battery: {{ props.dBatt }}</span>
      <button class="increment" type="button" @click="incrementDBatt">+</button>
    </div>

    <div class="button-group">
      <button class="decrement" type="button" @click="decrementAABatt">-</button>
      <span>AA Battery: {{ props.aaBatt }}</span>
      <button class="increment" type="button" @click="incrementAABatt">+</button>
    </div>

    <div class="button-group">
      <button class="decrement" type="button" @click="decrementVolt">-</button>
      <span>Voltage: {{ props.volt }}</span>
      <button class="increment" type="button" @click="incrementVolt">+</button>
    </div>
  </div>
</template>