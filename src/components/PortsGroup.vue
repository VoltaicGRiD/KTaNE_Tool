<script setup lang="ts">
interface Props {
  DVI: number
  Parallel: number
  Serial: number
  PS2: number
  RJ45: number
  RCA: number
  EMPTY: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:DVI': [value: number]
  'update:Parallel': [value: number]
  'update:Serial': [value: number]
  'update:PS2': [value: number]
  'update:RJ45': [value: number]
  'update:RCA': [value: number]
  'update:EMPTY': [value: number]
}>()

type PortType = keyof Props

function increment(port: PortType) {
  emit(`update:${port}` as any, props[port] + 1)
}

function decrement(port: PortType) {
  emit(`update:${port}` as any, Math.max(props[port] - 1, 0)) // Ensure port count doesn't go below 0
}
</script>

<template>
  <div class="port-group">
    <div class="button-group" v-for="(value, port) in props" :key="port">
      <button class="decrement" type="button" @click="decrement(port as PortType)">-</button>
      <span>{{ port }}: {{ value }}</span>
      <button class="increment" type="button" @click="increment(port as PortType)">+</button>
    </div>
  </div>
</template>