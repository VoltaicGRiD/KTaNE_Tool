import { reactive, watch } from 'vue'

const STORAGE_KEY = 'ktane_global_state'

type GlobalState = {
  dBatt: number,
  aaBatt: number,
  volt: number,
  strikes: number,
  serial: string,
  ports: { DVI: number, Parallel: number, Serial: number, PS2: number, RJ45: number, RCA: number, EMPTY: number },
  litIndicators: string[],
  unlitIndicators: string[],
  trackers: [string, string[]][],
  timerEndTimestamp: number | null,
  // Add more global state as needed
}

const defaultState: GlobalState = {
  dBatt: 0,
  aaBatt: 0,
  volt: 0,
  strikes: 0,
  serial: '',
  ports: { DVI: 0, Parallel: 0, Serial: 0, PS2: 0, RJ45: 0, RCA: 0, EMPTY: 0 },
  litIndicators: [],
  unlitIndicators: [],
  trackers: [],
  timerEndTimestamp: null,
  // Add more global state as needed
}

function loadState(): GlobalState {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : { ...defaultState }
}

export const globalState = reactive(loadState())

export function resetGlobalState() {
  (Object.keys(defaultState) as (keyof GlobalState)[]).forEach(key => {
    if (Array.isArray(defaultState[key])) {
      (globalState[key] as unknown[]).splice(0, (globalState[key] as unknown[]).length, ...(defaultState[key] as unknown[]))
    } else if (
      typeof defaultState[key] === 'object' &&
      defaultState[key] !== null &&
      typeof globalState[key] === 'object' &&
      globalState[key] !== null
    ) {
      Object.assign(globalState[key], defaultState[key])
    } else {
      (globalState[key] as typeof defaultState[typeof key]) = defaultState[key]
    }
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState))
}

watch(
  globalState,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true }
)
