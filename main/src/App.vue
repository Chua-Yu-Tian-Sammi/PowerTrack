<script setup></script>

<template>
  <div id="app">
    <AppNavbar />  
    <main class="container mt-4">
      <router-view /> 
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

<style scoped></style>