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
}>();

function increment(type: 'dBatt' | 'aaBatt' | 'volt') {
  if (type === 'dBatt') {
    emit('update:dBatt', props.dBatt + 1)
  } else if (type === 'aaBatt') {
    emit('update:aaBatt', props.aaBatt + 1)
  } else if (type === 'volt') {
    emit('update:volt', props.volt + 0.5)
  }
}

function decrement(type: 'dBatt' | 'aaBatt' | 'volt') {
  if (type === 'volt') {
    // Ensure voltage doesn't go below 0
    emit('update:volt', Math.max(props.volt - 0.5, 0))
    return
  }
  else if (type === 'dBatt') {
    emit('update:dBatt', Math.max(props.dBatt - 1, 0)) // Ensure count doesn't go below 0
    return
  }
  else if (type === 'aaBatt') {
    emit('update:aaBatt', Math.max(props.aaBatt - 1, 0)) // Ensure count doesn't go below 0
    return
  }
}
</script>

<template>
  <div class="battery-group">
    <div class="button-group">
      <button class="decrement" type="button" @click="decrement('dBatt')">-</button>
      <span>D Battery: {{ props.dBatt }}</span>
      <button class="increment" type="button" @click="increment('dBatt')">+</button>
    </div>

    <div class="button-group">
      <button class="decrement" type="button" @click="decrement('aaBatt')">-</button>
      <span>AA Battery: {{ props.aaBatt }}</span>
      <button class="increment" type="button" @click="increment('aaBatt')">+</button>
    </div>

    <div class="button-group">
      <button class="decrement" type="button" @click="decrement('volt')">-</button>
      <span>Voltage: {{ props.volt }}</span>
      <button class="increment" type="button" @click="increment('volt')">+</button>
    </div>
  </div>
</template>