<script setup lang="ts">
import { ref, computed, onUnmounted, provide, inject} from 'vue'
import BatteryGroup from './BatteryGroup.vue';
import PortsGroup from './PortsGroup.vue';
import { resetGlobalState } from '../store/globalStore';

defineProps<{ msg: string }>()


// Define the type for globalState
interface GlobalState {
  dBatt: any
  aaBatt: any
  volt: any
  strikes: any
  serial: any
  ports: any
  timer: any
  litIndicators: any
  unlitIndicators: any
  timerEndTimestamp?: number | null
}

const globalState = inject<GlobalState>('globalState')!



// Timer logic using persisted timestamp
const timerInterval = ref<number | null>(null)
// Use timerEndTimestamp in globalState for persistence
if (globalState.timerEndTimestamp === undefined) {
  globalState.timerEndTimestamp = null
}
const isTimerRunning = ref(false)
const timerInput = ref(0) // For user input when timer is not running

const remainingTime = ref(0)

function updateRemainingTime() {
  if (globalState.timerEndTimestamp && isTimerRunning.value) {
    remainingTime.value = Math.max(0, Math.floor((globalState.timerEndTimestamp - Date.now()) / 1000))
  } else {
    remainingTime.value = 0
  }
}
updateRemainingTime()

// If timerEndTimestamp is in the future, resume timer on load
if (globalState.timerEndTimestamp && globalState.timerEndTimestamp > Date.now()) {
  isTimerRunning.value = true
  updateRemainingTime()
  timerInterval.value = window.setInterval(() => {
    updateRemainingTime()
    if (remainingTime.value <= 0) {
      stopTimer()
    }
  }, 250)
}

const litIndicators = globalState.litIndicators
const unlitIndicators = globalState.unlitIndicators

const allIndicators = [
  'SND', 'CLR', 'CAR', 'IND', 'FRQ', 'SIG', 'NSA', 'MSA', 'TRN', 'BOB', 'FRK',
]
const showIndicatorModal = ref(false)
const indicatorIsLit = ref(true)
const availableIndicators = computed(() => {
  return allIndicators.filter(ind => !globalState.unlitIndicators.includes(ind) && !globalState.litIndicators.includes(ind))
})


function openIndicatorModal(isLit: boolean) {
  indicatorIsLit.value = isLit
  showIndicatorModal.value = true
}

function closeIndicatorModal() {
  showIndicatorModal.value = false
}

function addLitIndicator(ind: string) {
  globalState.litIndicators.push(ind)
  closeIndicatorModal()
}

function addUnlitIndicator(ind: string) {
  globalState.unlitIndicators.push(ind)
  closeIndicatorModal()
}

function resetAll() {
  stopTimer()
  resetGlobalState()
  // Note: Not clearing favorites as they should persist
}


function startTimer() {
  if (!isTimerRunning.value && timerInput.value > 0) {
    isTimerRunning.value = true
    globalState.timerEndTimestamp = Date.now() + timerInput.value * 1000
    updateRemainingTime()
    timerInterval.value = window.setInterval(() => {
      updateRemainingTime()
      if (remainingTime.value <= 0) {
        stopTimer()
      }
    }, 250)
  }
}


function stopTimer() {
  if (timerInterval.value !== null) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  isTimerRunning.value = false
  globalState.timerEndTimestamp = null
  updateRemainingTime()
}


function resetTimer() {
  stopTimer()
  timerInput.value = 0
  globalState.timerEndTimestamp = null
  updateRemainingTime()
}

function confirmReset() {
  if (window.confirm('Are you sure you want to reset all fields?')) {
    resetAll()
  }
}

onUnmounted(() => {
  stopTimer()
})


// Provide timer data for child components
provide('timer', {
  value: remainingTime,
  isRunning: isTimerRunning,
  start: startTimer,
  stop: stopTimer,
  reset: resetTimer
})

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

window.addEventListener('resize', () => {
  width.value = window.innerWidth
  height.value = window.innerHeight
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div v-if="showIndicatorModal" class="modal-overlay">
    <div class="modal-dialog">
      <ul class="indicator-list">
        <li v-for="ind in availableIndicators" :key="ind">
          <button @click="indicatorIsLit ? addLitIndicator(ind) : addUnlitIndicator(ind)">{{ ind }}</button>
        </li>
      </ul>
      <button class="close-modal" @click="closeIndicatorModal">Cancel</button>
    </div>
  </div>

    <div class="mobile-template" v-if="width < 700">
      <div>
        <BatteryGroup
          :dBatt="globalState.dBatt"
          :aaBatt="globalState.aaBatt"
          :volt="globalState.volt"
          @update:dBatt="globalState.dBatt = $event"
          @update:aaBatt="globalState.aaBatt = $event"
          @update:volt="globalState.volt = $event"
        ></BatteryGroup>

        <div class="button-group strikes-group">
          <button class="decrement" type="button" @click="globalState.strikes--">-</button>
          <span>Strikes: {{ globalState.strikes }}</span>
          <button class="increment" type="button" @click="globalState.strikes++">+</button>
        </div>

        <div class="column">
          <input
            class="serial-input"
            type="text"
            v-model="globalState.serial"
            placeholder="Serial Number"
            maxlength="6"
          />

          <div class="row">
            <input 
              class="timer-input"
              type="number"
              v-model="timerInput"
              placeholder="Timer (seconds)"
              min="0"
              step="30"
              v-if="!isTimerRunning"
            />

            <span class="timer-label" v-if="isTimerRunning">
              {{ Math.floor(remainingTime / 60).toString().padStart(2, '0') + ':' + (remainingTime % 60).toString().padStart(2, '0') }}
            </span>
            
            <button 
              class="start-timer" 
              @click="isTimerRunning ? stopTimer() : startTimer()"
            >
              {{ isTimerRunning ? 'Stop' : 'Start' }}
            </button>
            
            <button 
              class="reset-timer" 
              @click="resetTimer()"
            >
              Reset
            </button>
          </div>
            
          <button
          class="reset-all"
          type="button"
          @click="confirmReset"
          >
          Reset All
          </button>
        </div>
      </div>

      <PortsGroup
        :DVI="globalState.ports.DVI"
        :Parallel="globalState.ports.Parallel"
        :Serial="globalState.ports.Serial"
        :PS2="globalState.ports.PS2"
        :RJ45="globalState.ports.RJ45"
        :RCA="globalState.ports.RCA"
        :EMPTY="globalState.ports.EMPTY"
        @update:DVI="globalState.ports.DVI = $event"
        @update:Parallel="globalState.ports.Parallel = $event"
        @update:Serial="globalState.ports.Serial = $event"
        @update:PS2="globalState.ports.PS2 = $event"
        @update:RJ45="globalState.ports.RJ45 = $event"
        @update:RCA="globalState.ports.RCA = $event"
        @update:EMPTY="globalState.ports.EMPTY = $event"
      ></PortsGroup>

      <div class="bottom-section">
        <div class="button-group">
          <button class="add-lit-indicator" type="button" @click="openIndicatorModal(true)">
            Add Lit Indicator
          </button>

          <button class="add-unlit-indicator" type="button" @click="openIndicatorModal(false)">
            Add Unlit Indicator
          </button>
        </div>

        <div class="indicators">
          <h2>Lit Indicators</h2>
          <ul class="lit-indicators">
            <li
              class="lit"
              v-for="ind in litIndicators"
              :key="ind"
              @click="globalState.litIndicators.splice(globalState.litIndicators.indexOf(ind), 1)"
              style="cursor: pointer;"
              title="Click to remove"
            >
              {{ ind }}
            </li>
          </ul>

          <h2>Unlit Indicators</h2>
          <ul class="unlit-indicators">
            <li
              class="unlit"
              v-for="ind in unlitIndicators"
              :key="ind"
              @click="globalState.unlitIndicators.splice(globalState.unlitIndicators.indexOf(ind), 1)"
              style="cursor: pointer;"
              title="Click to remove"
            >
              {{ ind }}
            </li>
          </ul>
        </div>

        <hr style="width: 100%; border: 1px solid #ccc;"/>

        <div class="stats">
          <span v-if="['A','E','I','O','U'].includes(globalState.serial[0])">Contains vowel</span>
          <span>Sum of numbers: {{ globalState.serial.split('').reduce((acc: number, curr: string) => acc + (parseInt(curr) || 0), 0) }}</span>
          <span>Product of numbers: {{ globalState.serial.split('').reduce((acc: number, curr: string) => acc * (parseInt(curr) || 1), 1) }}</span>
        </div>
      </div>
    </div>
    <div class="desktop-template" v-else>
      <div class="column">
        <BatteryGroup
          :dBatt="globalState.dBatt"
          :aaBatt="globalState.aaBatt"
          :volt="globalState.volt"
          @update:dBatt="globalState.dBatt = $event"
          @update:aaBatt="globalState.aaBatt = $event"
          @update:volt="globalState.volt = $event"
        ></BatteryGroup>

        <div class="button-group strikes-group">
          <button class="decrement" type="button" @click="globalState.strikes--">-</button>
          <span>Strikes: {{ globalState.strikes }}</span>
          <button class="increment" type="button" @click="globalState.strikes++">+</button>
        </div>
      </div>

      <div class="center">
        <div class="column">
          <input
            class="serial-input"
            type="text"
            v-model="globalState.serial"
            placeholder="Serial Number"
            maxlength="6"
          />

          <div class="row">
            <input 
              class="timer-input"
              type="number"
              v-model="timerInput"
              placeholder="Timer (seconds)"
              min="0"
              step="30"
              v-if="!isTimerRunning"
            />

            <span class="timer-label" v-if="isTimerRunning">
              {{ Math.floor(remainingTime / 60).toString().padStart(2, '0') + ':' + (remainingTime % 60).toString().padStart(2, '0') }}
            </span>
            
            <button 
              class="start-timer" 
              @click="isTimerRunning ? stopTimer() : startTimer()"
            >
              {{ isTimerRunning ? 'Stop' : 'Start' }}
            </button>
            
            <button 
              class="reset-timer" 
              @click="resetTimer()"
            >
              Reset
            </button>
          </div>
            
          <button
          class="reset-all"
          type="button"
          @click="confirmReset"
          >
          Reset All
          </button>
        </div>

        <div class="button-group">
          <button class="add-lit-indicator" type="button" @click="openIndicatorModal(true)">
            Add Lit Indicator
          </button>

          <button class="add-unlit-indicator" type="button" @click="openIndicatorModal(false)">
            Add Unlit Indicator
          </button>
        </div>

        <div class="indicators">
          <h2>Lit Indicators</h2>
          <ul class="lit-indicators">
            <li
              class="lit"
              v-for="ind in litIndicators"
              :key="ind"
              @click="globalState.litIndicators.splice(globalState.litIndicators.indexOf(ind), 1)"
              style="cursor: pointer;"
              title="Click to remove"
            >
              {{ ind }}
            </li>
          </ul>

          <h2>Unlit Indicators</h2>
          <ul class="unlit-indicators">
            <li
              class="unlit"
              v-for="ind in unlitIndicators"
              :key="ind"
              @click="globalState.unlitIndicators.splice(globalState.unlitIndicators.indexOf(ind), 1)"
              style="cursor: pointer;"
              title="Click to remove"
            >
              {{ ind }}
            </li>
          </ul>
        </div>
      </div>

      <PortsGroup
        :DVI="globalState.ports.DVI"
        :Parallel="globalState.ports.Parallel"
        :Serial="globalState.ports.Serial"
        :PS2="globalState.ports.PS2"
        :RJ45="globalState.ports.RJ45"
        :RCA="globalState.ports.RCA"
        :EMPTY="globalState.ports.EMPTY"
        @update:DVI="globalState.ports.DVI = $event"
        @update:Parallel="globalState.ports.Parallel = $event"
        @update:Serial="globalState.ports.Serial = $event"
        @update:PS2="globalState.ports.PS2 = $event"
        @update:RJ45="globalState.ports.RJ45 = $event"
        @update:RCA="globalState.ports.RCA = $event"
        @update:EMPTY="globalState.ports.EMPTY = $event"
      ></PortsGroup>

    </div>
</template>
<style scoped>
.ktane-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  margin-top: 24px;
}

.ktane-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.ktane-link-text {
  font-size: 1.1rem;
  color: #1976d2;
  vertical-align: middle;
}

.desktop-template {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  align-items: flex-start;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 700px) {  
  .row {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .timer-input {
    width: 150px;
  }
}
</style>
