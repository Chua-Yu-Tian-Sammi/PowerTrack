<template>
  <!-- Active Workout Confirmation Modal -->
  <div 
    v-if="show" 
    class="modal fade show d-block" 
    tabindex="-1" 
    style="background-color: rgba(0,0,0,0.5);"
    @click.self="handleCancel"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title">
            <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
            Active Workout Detected
          </h5>
        </div>
        <div class="modal-body pt-0">
          <p class="mb-3">
            You currently have an active workout in progress. Starting a new workout will end your current session.
          </p>
          <div class="alert alert-info d-flex align-items-center">
            <i class="bi bi-info-circle me-2"></i>
            <div class="flex-grow-1">
              <strong>Current Workout:</strong><br>
              <div class="mt-2">
                <div class="fw-bold text-dark mb-1">
                  {{ activeWorkoutData?.workoutName || 'Active Workout' }}
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge bg-secondary">{{ getSourceTypeLabel(activeWorkoutData?.sourceType) }}</span>
                  <small class="text-muted">
                    <i class="bi bi-clock me-1"></i>{{ formatDuration(activeWorkoutData?.elapsedTime || 0) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <p class="mb-0 text-muted small">
            What would you like to do?
          </p>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button 
            type="button" 
            class="btn btn-outline-secondary" 
            @click="handleCancel"
          >
            <i class="bi bi-x-circle me-1"></i>
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-danger" 
            @click="handleEndWorkout"
            :disabled="ending"
          >
            <span v-if="ending" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-stop-fill me-1"></i>
            End Current Workout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { WorkoutStateService } from '../services/workoutStateService.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  onCancel: {
    type: Function,
    default: () => {}
  },
  onEndWorkout: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['cancel', 'end-workout'])

const router = useRouter()
const ending = ref(false)
const activeWorkoutData = ref(null)

// Load active workout data when modal shows
const loadActiveWorkoutData = () => {
  activeWorkoutData.value = WorkoutStateService.getActiveWorkoutData()
}

// Watch for show prop changes
watch(() => props.show, (newShow) => {
  if (newShow) {
    loadActiveWorkoutData()
  }
})

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

const getSourceTypeLabel = (sourceType) => {
  const labels = {
    'generated': 'Generated',
    'routine': 'Routine',
    'running-route': 'Running Route',
    'custom': 'Custom'
  }
  return labels[sourceType] || 'Workout'
}

const handleCancel = () => {
  emit('cancel')
  if (props.onCancel) {
    props.onCancel()
  }
}

const handleEndWorkout = async () => {
  ending.value = true
  try {
    // Emit the end workout event - let parent handle state clearing and navigation
    emit('end-workout')
    if (props.onEndWorkout) {
      await props.onEndWorkout()
    }
  } catch (error) {
    console.error('Error ending workout:', error)
  } finally {
    ending.value = false
  }
}
</script>

<style scoped>
.modal.show {
  display: block !important;
}

.modal-dialog {
  max-width: 500px;
}

.alert {
  border-left: 4px solid var(--bs-info);
}
</style>
