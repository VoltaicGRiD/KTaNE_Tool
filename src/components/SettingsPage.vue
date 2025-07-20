<script setup lang="ts">
interface Props {
  msg: string
}

defineProps<Props>()
</script>

<template>
  <div class="settings-container">
    <h1>{{ msg }}</h1>
    
    <div class="settings-content">
      <h2>Settings & Configuration</h2>
      
      <div class="setting-group">
        <h3>Display Options</h3>
        <label>
          <input type="checkbox" /> Dark Mode
        </label>
        <label>
          <input type="checkbox" /> Compact View
        </label>
        <label>
          <input type="checkbox" /> Auto-save Progress
        </label>
      </div>
      
      <div class="setting-group">
        <h3>Game Preferences</h3>
        <label>
          <input type="checkbox" /> Show Timer
        </label>
        <label>
          <input type="checkbox" /> Play Sound Effects
        </label>
        <label>
          <input type="checkbox" /> Highlight Errors
        </label>
      </div>
      
      <div class="setting-group">
        <h3>Export/Import</h3>
        <button class="export-btn">Export Configuration</button>
        <button class="import-btn">Import Configuration</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-group {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-group h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #646cff;
}

.setting-group label {
  display: block;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-btn, .import-btn {
  margin-right: 1rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #646cff;
  border-radius: 4px;
  background: transparent;
  color: #646cff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover, .import-btn:hover {
  background: #646cff;
  color: white;
}

@media (max-width: 700px) {
  .settings-container {
    padding: 1rem;
  }
  
  .setting-group {
    padding: 1rem;
  }
}
</style>
