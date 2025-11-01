<template>
  <!-- Active Workout Confirmation Modal -->
  <Transition name="fade">
    <div 
      v-if="show" 
      class="user-profile-apple"
    >
      <div class="apple-modal-backdrop" @click.self="handleCancel">
        <div class="apple-modal">
          <div class="apple-modal-header">
            <h5 class="apple-modal-title">
              <i class="bi bi-exclamation-triangle-fill me-2" style="color: #f59e0b;"></i>
              Active Workout Detected
            </h5>
            <button class="apple-modal-close" @click="handleCancel">
              <i class="bi bi-x-lg" style="font-size: 0.875rem;"></i>
            </button>
          </div>
          <div class="apple-modal-body">
            <p style="margin-bottom: 1.5rem; opacity: 0.8;">
              You currently have an active workout in progress. Starting a new workout will end your current session.
            </p>
            
            <div style="background: rgba(0, 123, 255, 0.08); border-left: 3px solid #007bff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
              <div style="font-weight: 600; margin-bottom: 0.75rem; color: #030213;">Current Workout</div>
              <div style="font-size: 1rem; font-weight: 500; margin-bottom: 0.5rem; color: #030213;">
                {{ activeWorkoutData?.workoutName || 'Active Workout' }}
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span style="background: rgba(0,0,0,0.08); padding: 0.25rem 0.625rem; border-radius: 0.375rem; font-size: 0.8125rem; font-weight: 500;">
                  {{ getSourceTypeLabel(activeWorkoutData?.sourceType) }}
                </span>
                <span style="font-size: 0.875rem; opacity: 0.6;">
                  <i class="bi bi-clock me-1"></i>{{ formatDuration(activeWorkoutData?.elapsedTime || 0) }}
                </span>
              </div>
            </div>
            
            <p style="margin-bottom: 1.5rem; font-size: 0.875rem; opacity: 0.6;">
              What would you like to do?
            </p>

            <div style="display: flex; gap: 0.75rem;">
              <button 
                type="button" 
                class="apple-input"
                style="flex: 1; height: 3rem; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; font-weight: 500;"
                @click="handleCancel"
              >
                <i class="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button 
                type="button" 
                class="apple-input"
                style="flex: 1; height: 3rem; background: #ef4444; color: white; cursor: pointer; font-weight: 500; border: none;"
                @click="handleEndWorkout"
                :disabled="ending"
              >
                <span v-if="ending" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-stop-fill me-2"></i>
                End Current Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
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

const loadActiveWorkoutData = () => {
  activeWorkoutData.value = WorkoutStateService.getActiveWorkoutData()
}

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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
