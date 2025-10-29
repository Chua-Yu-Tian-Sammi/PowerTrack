<template>
    <nav class="modern-navbar">
      <div class="navbar-container">
        <button 
          class="mobile-menu-toggle" 
          type="button" 
          @click="toggleMenu"
          aria-label="Toggle navigation"
          :aria-expanded="isMenuOpen"
          aria-controls="mobileNavMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <router-link class="navbar-logo" to="/">
          PowerTrack
        </router-link>
        <div 
          id="mobileNavMenu"
          class="navbar-menu" 
          :class="{ show: isMenuOpen }"
          :aria-hidden="!isMenuOpen"
        >
          <div class="nav-links">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'WorkoutGenerator' }" 
              to="/workout" 
              @click="closeMenu"
            >
              Generate
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'WorkoutTracking' }" 
              to="/workout-tracking" 
              @click="closeMenu"
            >
              Tracking
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'RunningRoutes' }" 
              to="/running-routes" 
              @click="closeMenu"
            >
              Routes
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'ExerciseLibrary' }" 
              to="/exercises" 
              @click="closeMenu"
            >
              Library
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'RoutineBuilder' }" 
              to="/routines" 
              @click="closeMenu"
            >
              Routines
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'ProgressDashboard' }" 
              to="/progress" 
              @click="closeMenu"
            >
              Progress
            </router-link>
          </div>
        </div>
        <div class="nav-actions">
          <router-link class="user-avatar" to="/profile" @click="closeMenu">
            <div class="avatar-circle">
              {{ initials }}
            </div>
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { getCurrentUser, getCurrentUserProfile } from '@/services/authService'

  const isMenuOpen = ref(false)
  const userProfile = ref(null)

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  const currentUser = ref(null)

  const initials = computed(() => {
    // Prefer explicit username, then name, then auth displayName, then email
    const source = (userProfile.value && (userProfile.value.username || userProfile.value.name))
      || (currentUser.value && (currentUser.value.displayName || currentUser.value.email))
      || ''
    if (!source) return 'U'
    const cleaned = String(source).trim()
    if (!cleaned) return 'U'
    const parts = cleaned.split(' ')
    const first = parts[0]
    return first ? first[0].toUpperCase() : 'U'
  })

  onMounted(async () => {
    const user = getCurrentUser()
    currentUser.value = user
    if (user) {
      const profile = await getCurrentUserProfile()
      userProfile.value = profile
    }
  })
  </script>

  <style scoped>
  .modern-navbar {
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #f0f0f0;
    backdrop-filter: blur(10px);
  }

  .navbar-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    height: 64px;
    gap: 2rem;
  }

  .mobile-menu-toggle {
    display: none;
  }

  .navbar-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #212529 !important;
    text-decoration: none;
    letter-spacing: -0.02em;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
  }

  @media (min-width: 992px) {
    .navbar-logo:hover {
      color: #667eea !important;
      transform: translateY(-2px);
      text-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }

    .navbar-logo:active {
      transform: translateY(0);
    }
  }

  .navbar-logo:focus {
    color: #212529 !important;
  }

  .navbar-menu {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.625rem 1.125rem;
    text-decoration: none;
    color: #495057;
    font-weight: 500;
    font-size: 0.9375rem;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    letter-spacing: 0.01em;
  }

  .nav-link::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 100%;
    height: 100%;
    background: #f0f7ff;
    border-radius: 8px;
    transition: transform 0.2s ease;
    z-index: -1;
  }

  .nav-link:hover {
    color: #212529;
    transform: translateY(-1px);
  }

  .nav-link:hover::before {
    transform: translate(-50%, -50%) scale(1);
  }

  .nav-link.active {
    color: #212529;
    font-weight: 600;
    background: #f0f7ff;
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px 2px 0 0;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  }

  .nav-actions {
    display: flex;
    align-items: center;
  }

  .user-avatar {
    display: inline-block;
  }

  .avatar-circle {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #212529; /* solid black */
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    transition: transform 0.2s ease;
    border: 2px solid #212529;
  }

  .user-avatar:hover .avatar-circle {
    transform: translateY(-1px) scale(1.03);
  }

  .user-avatar:active .avatar-circle {
    transform: scale(1.0);
  }

  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .mobile-menu-toggle span {
    width: 24px;
    height: 2px;
    background: #212529;
    border-radius: 2px;
  }

  @media (max-width: 991px) {
    .navbar-container {
      padding: 0 1rem;
      grid-template-columns: auto 1fr auto;
      gap: 0.75rem;
      height: 56px;
    }

    .mobile-menu-toggle {
      display: flex;
      padding: 0.25rem;
      margin: 0;
    }

    .navbar-logo {
      color: #212529 !important;
    }

    .navbar-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      flex-direction: column;
      align-items: stretch;
      padding: 1rem;
      gap: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      z-index: 999;
      visibility: hidden;
      pointer-events: none;
    }

    .navbar-menu.show {
      max-height: 500px;
      visibility: visible;
      pointer-events: auto;
    }

    .nav-links {
      flex-direction: column;
      gap: 0;
      width: 100%;
    }

    .nav-link {
      width: 100%;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 0.25rem;
    }

    .nav-link.active::after {
      display: none;
    }

    .nav-link.active {
      background: #f8f9fa;
    }

    .nav-actions {
      display: flex;
    }
  }

  @media (max-width: 575px) {
    .navbar-container {
      padding: 0 0.5rem;
    }

    .navbar-logo {
      font-size: 1.25rem;
      color: #212529 !important;
    }
  }
  </style>
  