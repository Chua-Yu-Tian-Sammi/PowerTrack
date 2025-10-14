<template>
  <div class="card h-100 exercise-card">
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
defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

defineEmits(['addToRoutine'])

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
