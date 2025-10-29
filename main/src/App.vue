<template>
  <div id="app">
    <AppNavbar />  
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
          <div :key="route.path" v-if="Component">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

<style>
@import './styles/main.css';

#app {
  min-height: 100vh;
}

.main-content {
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

@media (max-width: 991px) {
  .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 575px) {
  .main-content {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>