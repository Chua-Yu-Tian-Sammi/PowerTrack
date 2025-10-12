<template>
  <div class="home">
    <div class="hero-section text-center py-5 mb-5">
      <h1 class="display-4 fw-bold">Welcome to PowerTrack!</h1>
      <p class="lead">Your smart workout companion powered by AI</p>
      <div class="mt-4">
        <router-link to="/workout" class="btn btn-primary btn-lg me-3">
          <i class="bi bi-lightning-charge me-2"></i>Generate Workout
        </router-link>
        <router-link to="/exercises" class="btn btn-outline-primary btn-lg me-3">
          <i class="bi bi-book me-2"></i>Browse Exercises
        </router-link>
        <router-link to="/routines" class="btn btn-outline-success btn-lg">
          <i class="bi bi-list-ul me-2"></i>Build Routines
        </router-link>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-lightning-charge display-1 text-primary mb-3"></i>
            <h4>Smart Workout Generation</h4>
            <p class="text-muted">Get personalized workout routines based on your time, goals, and fitness level using our AI-powered system.</p>
            <router-link to="/workout" class="btn btn-primary">Try It Now</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-graph-up display-1 text-success mb-3"></i>
            <h4>Progress Tracking</h4>
            <p class="text-muted">Track your fitness journey with detailed analytics, workout history, and progress summaries.</p>
            <router-link to="/progress" class="btn btn-success">View Progress</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-book display-1 text-info mb-3"></i>
            <h4>Exercise Library</h4>
            <p class="text-muted">Browse our comprehensive database of exercises with detailed instructions and difficulty levels.</p>
            <router-link to="/exercises" class="btn btn-info">Explore Library</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-list-ul display-1 text-success mb-3"></i>
            <h4>Custom Routines</h4>
            <p class="text-muted">Build and manage your own workout routines by selecting exercises and customizing sets, reps, and rest periods.</p>
            <router-link to="/routines" class="btn btn-success">Build Routines</router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// HomePage component - no additional logic needed
</script>

