<template>
  <div class="running-routes">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-body p-2 p-md-3">
              <div class="row align-items-center">
                <div class="col-12 col-md-8">
                  <h2 class="mb-2 mb-md-1 text-dark text-break">
                    <i class="bi bi-geo-alt me-2 text-primary"></i>Running Routes
                  </h2>
                  <p class="text-muted mb-0 text-break">Find the perfect running route based on your distance and location</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 text-truncate">
                <i class="bi bi-gear me-2 text-primary"></i>Route Preferences
              </h5>
            </div>
            <div class="card-body p-3 p-md-4">
              <form @submit.prevent="findRoutes">
                <div class="row g-3 mb-4">
                  <div class="col-12 col-sm-6 col-lg-4">
                    <label for="postalCode" class="form-label fw-semibold text-truncate">
                      <i class="bi bi-geo-alt me-1"></i>Postal Code
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="postalCode"
                      placeholder="Enter your postal code"
                      v-model="searchForm.postalCode"
                      @keyup.enter="findRoutes"
                      required
                    >
                    <div class="form-text">We'll find routes starting from this location</div>
                  </div>
                  <div class="col-12 col-sm-6 col-lg-4">
                    <label for="distance" class="form-label fw-semibold text-truncate">
                      <i class="bi bi-rulers me-1"></i>Distance
                    </label>
                    <select class="form-select" id="distance" v-model="searchForm.distance">
                      <option value="1">1 km</option>
                      <option value="2">2 km</option>
                      <option value="3">3 km</option>
                      <option value="5">5 km</option>
                      <option value="10">10 km</option>
                      <option value="15">15 km</option>
                      <option value="20">20 km</option>
                    </select>
                  </div>
                  <div class="col-12 col-sm-6 col-lg-4">
                    <label for="routeType" class="form-label fw-semibold text-truncate">
                      <i class="bi bi-diagram-3 me-1"></i>Route Type
                    </label>
                    <select class="form-select" id="routeType" v-model="searchForm.routeType">
                      <option value="all">All</option>
                      <option value="loop">Loop</option>
                      <option value="point-to-point">Point to Point</option>
                    </select>
                  </div>
                </div>
                
                <div class="d-flex justify-content-start">
                  <button 
                    class="btn btn-primary btn-lg" 
                    type="submit"
                    :disabled="loading || !searchForm.postalCode"
                  >
                    <i class="bi bi-search me-2"></i>
                    {{ loading ? 'Finding Routes...' : 'Find Running Routes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 text-truncate">
                <i class="bi bi-list-ul me-2 text-primary"></i>Route Results
              </h5>
            </div>
            <div class="card-body p-3 p-md-4">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 mb-0">Finding the best running routes for you...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Routes Results -->
              <div v-else-if="routes.length > 0" class="row g-4">
                <div class="col-12">
                  <h6 class="text-muted mb-3">Found {{ routes.length }} Route{{ routes.length !== 1 ? 's' : '' }}</h6>
                </div>
                
                <div v-for="(route, index) in routes" :key="index" class="col-lg-6">
                  <div class="card border-0 bg-light h-100">
                    <div class="card-body p-3">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <h6 class="card-title mb-0 fw-bold">Route {{ index + 1 }}</h6>
                        <div class="d-flex gap-2">
                          <span class="badge bg-primary">{{ route.distance }} km</span>
                          <span class="badge" :class="getRouteTypeBadgeClass(route.routeType)">
                            {{ getRouteTypeLabel(route.routeType) }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <div class="row g-2">
                          <div class="col-6">
                            <div class="d-flex align-items-center text-muted">
                              <i class="bi bi-geo-alt me-2"></i>
                              <small class="text-truncate">{{ route.startLocation }}</small>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="d-flex align-items-center text-muted">
                              <i class="bi bi-clock me-2"></i>
                              <small>{{ calculateTiming(route.distance) }}</small>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Map Preview -->
                      <div class="mb-3">
                        <div class="map-preview" :id="`map-preview-${index}`" style="height: 150px; width: 100%; border-radius: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6;">
                          <div class="d-flex align-items-center justify-content-center h-100 text-muted">
                            <div class="text-center">
                              <i class="bi bi-map display-6"></i>
                              <p class="mt-2 mb-0 small">Map Preview</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm" @click="viewOnMap(route)">
                          <i class="bi bi-map me-1"></i>Full View
                        </button>
                        <button class="btn btn-outline-success btn-sm" @click="startRoute(route)">
                          <i class="bi bi-play-fill me-1"></i>Start Route
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Results -->
              <div v-else-if="!loading && searchPerformed" class="text-center py-5">
                <i class="bi bi-geo-alt display-1 text-muted"></i>
                <h4 class="mt-3">No routes found</h4>
                <p class="text-muted">Try adjusting your distance or postal code</p>
              </div>

              <!-- Initial State -->
              <div v-else class="text-center py-5">
                <i class="bi bi-geo-alt display-1 text-muted"></i>
                <h4 class="mt-3">Ready to find your perfect route?</h4>
                <p class="text-muted">Enter your postal code and desired distance to get started</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Google Maps Modal -->
    <div v-if="selectedRoute" class="modal fade" id="mapModal" tabindex="-1" aria-labelledby="mapModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="mapModalLabel">Route Map</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div id="map" style="height: 500px; width: 100%;"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="startRoute(selectedRoute)">Start This Route</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { mapsService } from '../services/mapsService.js'
import * as bootstrap from 'bootstrap'

const router = useRouter()

// Form data
const searchForm = reactive({
  postalCode: '',
  distance: '5',
  routeType: 'all'
})

// State
const loading = ref(false)
const error = ref('')
const searchPerformed = ref(false)
const routes = ref([])
const selectedRoute = ref(null)

// State management keys
const DRAFT_SEARCH_KEY = 'draftRunningRoutesSearch'
const DRAFT_ROUTES_KEY = 'draftRunningRoutesResults'

// Google Maps will be loaded via the mapsService

// Helper functions for route type display
const getRouteTypeLabel = (routeType) => {
  const labels = {
    'loop': 'Loop',
    'point-to-point': 'Point to Point'
  }
  return labels[routeType] || 'Loop'
}

const getRouteTypeBadgeClass = (routeType) => {
  const classes = {
    'loop': 'bg-success',
    'point-to-point': 'bg-info'
  }
  return classes[routeType] || 'bg-success'
}

const calculateTiming = (distance) => {
  const pacePerKm = 6 // 6 minutes per kilometer
  const totalMinutes = Math.round(distance * pacePerKm)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes} minutes`
  }
}

// State management functions
const loadDraftState = () => {
  try {
    // Load search form
    const savedSearch = localStorage.getItem(DRAFT_SEARCH_KEY)
    if (savedSearch) {
      const searchData = JSON.parse(savedSearch)
      Object.assign(searchForm, searchData)
    }

    // Load routes results
    const savedRoutes = localStorage.getItem(DRAFT_ROUTES_KEY)
    if (savedRoutes) {
      const routesData = JSON.parse(savedRoutes)
      routes.value = routesData.routes || []
      searchPerformed.value = routesData.searchPerformed || false
    }
  } catch (error) {
    console.error('Error loading draft state:', error)
  }
}

const saveDraftState = () => {
  try {
    // Save search form
    localStorage.setItem(DRAFT_SEARCH_KEY, JSON.stringify(searchForm))
    
    // Save routes results
    localStorage.setItem(DRAFT_ROUTES_KEY, JSON.stringify({
      routes: routes.value,
      searchPerformed: searchPerformed.value
    }))
  } catch (error) {
    console.error('Error saving draft state:', error)
  }
}

const findRoutes = async () => {
  if (!searchForm.postalCode.trim()) {
    return
  }

  loading.value = true
  error.value = ''
  searchPerformed.value = true

  try {
    // Load Google Maps API if not already loaded
    await mapsService.loadGoogleMaps()
    
    // Generate routes using Google Maps API
    routes.value = await mapsService.generateRunningRoute(
      searchForm.postalCode,
      parseInt(searchForm.distance),
      searchForm.routeType
    )
    
    if (routes.value.length === 0) {
      error.value = 'No routes found for this location and distance. Try a different postal code or distance.'
    }
    
    // Save state after successful search
    saveDraftState()
    
    // Initialize map previews after routes are loaded
    setTimeout(() => {
      initializeMapPreviews()
    }, 100)
  } catch (err) {
    error.value = 'Failed to find routes. Please check your postal code and try again.'
    console.error('Error finding routes:', err)
  } finally {
    loading.value = false
  }
}

// Mock functions removed - now using Google Maps API

const viewOnMap = (route) => {
  selectedRoute.value = route
  // Initialize Google Maps modal
  const mapModalElement = document.getElementById('mapModal')
  if (mapModalElement) {
    const mapModal = new bootstrap.Modal(mapModalElement)
    mapModal.show()
    
    // Initialize map after modal is shown
    setTimeout(() => {
      initializeMap(route)
    }, 500)
  }
}

const initializeMap = async (route) => {
  try {
    // Load Google Maps API if not already loaded
    await mapsService.loadGoogleMaps()
    
    // Initialize map with route
    const mapElement = document.getElementById('map')
    if (mapElement) {
      mapsService.initializeMapWithRoute(mapElement, route)
    }
  } catch (error) {
    console.error('Error initializing map:', error)
    // Fallback to placeholder
    const mapElement = document.getElementById('map')
    if (mapElement) {
      mapElement.innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100 bg-light">
          <div class="text-center">
            <i class="bi bi-exclamation-triangle display-1 text-muted"></i>
            <p class="mt-3">Unable to load map</p>
            <p class="text-muted">Route: ${route.distance}km ${route.routeType} route</p>
          </div>
        </div>
      `
    }
  }
}

const startRoute = (route) => {
  // Close modal if open
  const mapModalElement = document.getElementById('mapModal')
  if (mapModalElement) {
    const mapModal = bootstrap.Modal.getInstance(mapModalElement)
    if (mapModal) {
      mapModal.hide()
    }
  }
  
  // Navigate to workout tracking with route data
  router.push({
    name: 'WorkoutTracking',
    query: {
      workoutData: JSON.stringify({
        title: `${route.distance}km Running Route`,
        exercises: [{
          name: 'Running',
          description: route.description,
          duration: route.estimatedTime,
          distance: route.distance,
          routeType: route.routeType
        }],
        totalTimeMin: Math.floor(route.distance * 7), // Average 7 min/km
        sourceType: 'running-route'
      })
    }
  })
}

// Watchers for state persistence
watch(searchForm, () => {
  saveDraftState()
}, { deep: true })

watch(routes, () => {
  saveDraftState()
}, { deep: true })

watch(searchPerformed, () => {
  saveDraftState()
})

// Watch for routes changes to reinitialize map previews
watch(routes, (newRoutes) => {
  if (newRoutes && newRoutes.length > 0) {
    // Use nextTick to ensure DOM is updated
    setTimeout(() => {
      initializeMapPreviews()
    }, 100)
  }
}, { deep: true })

const initializeMapPreviews = async () => {
  try {
    await mapsService.loadGoogleMaps()
    
    // Wait a bit more to ensure DOM elements are ready
    await new Promise(resolve => setTimeout(resolve, 200))
    
    routes.value.forEach((route, index) => {
      const mapElement = document.getElementById(`map-preview-${index}`)
      if (mapElement && window.google && window.google.maps) {
        // Clear any existing content
        mapElement.innerHTML = ''
        
        try {
          const map = new window.google.maps.Map(mapElement, {
            zoom: 13,
            center: route.coordinates.start,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          })

          // Add route polyline
          const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#007bff',
              strokeWeight: 4,
              strokeOpacity: 0.8
            }
          })

          // Create directions request
          const request = {
            origin: route.coordinates.start,
            destination: route.routeType === 'loop' ? route.coordinates.start : route.coordinates.waypoints[0],
            waypoints: route.coordinates.waypoints.map(wp => ({
              location: wp,
              stopover: true
            })),
            travelMode: window.google.maps.TravelMode.WALKING,
            optimizeWaypoints: true
          }

          const directionsService = new window.google.maps.DirectionsService()
          directionsService.route(request, (result, status) => {
            if (status === 'OK') {
              directionsRenderer.setDirections(result)
            } else {
              console.warn(`Failed to get directions for route ${index}:`, status)
            }
          })
        } catch (error) {
          console.warn(`Failed to initialize map preview ${index}:`, error)
          // Show fallback content
          mapElement.innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100 text-muted">
              <div class="text-center">
                <i class="bi bi-map display-6"></i>
                <p class="mt-2 mb-0 small">Map Preview</p>
              </div>
            </div>
          `
        }
      } else {
        console.warn(`Map element not found for route ${index}`)
      }
    })
  } catch (error) {
    console.error('Error initializing map previews:', error)
  }
}

onMounted(() => {
  // Load draft state on component mount
  loadDraftState()
  
  // Initialize map previews if routes exist
  if (routes.value.length > 0) {
    setTimeout(() => {
      initializeMapPreviews()
    }, 100)
  }
})
</script>

<style scoped>
.running-routes {
  padding: 1rem 0;
}

.map-preview {
  position: relative;
  overflow: hidden;
}

.map-preview .gm-style {
  border-radius: 6px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .running-routes {
    padding: 0.5rem 0;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style>
