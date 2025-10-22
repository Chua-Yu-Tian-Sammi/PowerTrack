<template>
  <div class="card h-100 exercise-card">
    <!-- Exercise Image -->
    <div class="exercise-image-container">
      <img 
        :src="imageSrc" 
        :alt="exercise.name"
        class="exercise-image"
        @error="handleImageError"
      />
    </div>
    
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title">{{ exercise.name }}</h5>
      </div>
      
      <p class="card-text text-muted">{{ exercise.description }}</p>
      
      <div class="mb-2">
        <div>
          <small class="text-muted">Difficulty:</small>
          <span :class="getDifficultyBadgeClass(exercise.difficulty)" class="badge text-capitalize ms-1">{{ exercise.difficulty }}</span>
        </div>
        <div>
          <small class="text-muted">Intensity:</small>
          <span :class="getIntensityBadgeClass(exercise.intensity)" class="badge text-capitalize ms-1">{{ exercise.intensity }}</span>
        </div>
        <div><small class="text-muted">Time required:</small> <span class="ms-1">{{ exercise.timePerSetSec }}s</span></div>
      </div>
      
      <div class="mb-2">
        <strong>Muscles:</strong>
        <div class="mt-1">
          <span v-for="muscle in exercise.muscle" :key="muscle" class="badge bg-light text-dark me-1 text-capitalize">
            {{ muscle }}
          </span>
        </div>
      </div>
      
      <div class="mb-3">
        <strong>Equipment:</strong>
        <div class="mt-1">
          <span v-for="eq in exercise.equipment" :key="eq" class="badge bg-light text-dark border me-1 text-capitalize">
            {{ eq.replace(/_/g, ' ') }}
          </span>
        </div>
      </div>
      
      <div class="d-flex justify-content-end mt-auto">
        <button class="btn btn-dark btn-sm" @click.stop="$emit('addToRoutine', exercise)">
          <i class="bi bi-plus me-1"></i>Add to Routine
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

defineEmits(['addToRoutine'])

import { computed, ref } from 'vue'
import { resolveExerciseImage, UNAVAILABLE_DATA_URI } from '../services/imageResolver.js'

const initialSrc = resolveExerciseImage(props.exercise?.exerciseId)
const imageSrcRef = ref(initialSrc)
const imageSrc = computed(() => imageSrcRef.value)

const handleImageError = (e) => {
  if (!e || !e.target) return
  if (e.target.src !== UNAVAILABLE_DATA_URI) {
    imageSrcRef.value = UNAVAILABLE_DATA_URI
    e.target.src = UNAVAILABLE_DATA_URI
  }
}

const getIntensityBadgeClass = (intensity) => {
  switch (intensity) {
    case 'low': return 'bg-success'
    case 'medium': return 'bg-warning'
    case 'high': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

const getDifficultyBadgeClass = (difficulty) => {
  switch (String(difficulty).toLowerCase()) {
    case 'beginner': return 'bg-info'
    case 'intermediate': return 'bg-purple'
    case 'advanced': return 'bg-orange'
    default: return 'bg-secondary'
  }
}

</script>

<style scoped>
.exercise-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem 0.375rem 0 0;
}

.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.exercise-card:hover .exercise-image {
  transform: scale(1.05);
}

.exercise-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.exercise-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
