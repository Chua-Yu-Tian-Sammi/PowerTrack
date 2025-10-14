<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="bi bi-lightning-charge-fill me-2"></i>
          PowerTrack
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'Home' }" to="/">
                <i class="bi bi-house me-1"></i>Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'WorkoutGenerator' }" to="/workout">
                <i class="bi bi-lightning-charge me-1"></i>Generate Workout
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'ExerciseLibrary' }" to="/exercises">
                <i class="bi bi-book me-1"></i>Exercise Library
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'RoutineBuilder' }" to="/routines">
                <i class="bi bi-list-ul me-1"></i>Routines
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'ProgressDashboard' }" to="/progress">
                <i class="bi bi-graph-up me-1"></i>Progress
              </router-link>
            </li>
          </ul>
          <div class="d-flex">
            <router-link class="btn btn-outline-primary me-2" to="/profile">
              <i class="bi bi-person-circle me-1"></i>Profile
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup></script>
  
  