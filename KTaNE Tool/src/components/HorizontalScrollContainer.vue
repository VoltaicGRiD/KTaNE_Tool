<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainScreen from './MainScreen.vue'
import SettingsPage from './SettingsPage.vue'
import NotesPage from './NotesPage.vue'
import FavoritesPage from './FavoritesPage.vue'
import CalculatorPage from './CalculatorPage.vue'
import ReferencePage from './ReferencePage.vue'

const scrollContainer = ref<HTMLElement | null>(null)
const currentPage = ref(0)

// You can add more components here
const components = [
  { name: 'KTaNE Tool', component: MainScreen },
  { name: 'Notes', component: NotesPage },
  { name: 'Favorites', component: FavoritesPage },
  { name: 'Reference', component: ReferencePage },
  { name: 'Settings', component: SettingsPage },
  // Add more components as needed
]

function scrollToPage(index: number) {
  if (scrollContainer.value) {
    const pageWidth = scrollContainer.value.clientWidth
    scrollContainer.value.scrollTo({
      left: pageWidth * index,
      behavior: 'smooth'
    })
    currentPage.value = index
  }
}

function handleScroll() {
  if (scrollContainer.value) {
    const pageWidth = scrollContainer.value.clientWidth
    const scrollLeft = scrollContainer.value.scrollLeft
    const newPage = Math.round(scrollLeft / pageWidth)
    currentPage.value = newPage
  }
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="horizontal-container">
    <!-- Navigation dots -->
    <div class="navigation-dots">
      <button 
        v-for="(component, index) in components" 
        :key="index"
        :class="['dot', { active: currentPage === index }]"
        @click="scrollToPage(index)"
      >
        {{ component.name }}
      </button>
    </div>

    <!-- Scrollable content -->
    <div 
      ref="scrollContainer" 
      class="scroll-container"
    >
      <div 
        v-for="(component, index) in components" 
        :key="index"
        class="page"
      >
        <component 
          :is="component.component" 
          :msg="component.name"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.horizontal-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.navigation-dots {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dot {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dot.active {
  background: #646cff;
  color: white;
}

.scroll-container {
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.page {
  min-width: 100vw;
  height: 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
}

/* Mobile optimizations */
@media (max-width: 700px) {
  .navigation-dots {
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .dot {
    padding: 0.3rem 0.6rem;
    font-size: 0.9rem;
  }
}
</style>
