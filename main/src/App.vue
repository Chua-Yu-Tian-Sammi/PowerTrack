<template>
  <div id="app">
    <AppNavbar />  
    <main class="container mt-4">
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
</style>