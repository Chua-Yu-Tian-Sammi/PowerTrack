<template>
  <div class="card h-100 exercise-card text">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title fw-bold ">{{ exercise.name }}</h5>
        <span :class="getDifficultyBadgeClass(exercise.difficulty)" class="badge text-capitalize ms-1">{{ exercise.difficulty }}</span>
      </div>
      
      <p class="card-text text-muted">{{ exercise.description }}</p>
      
      <div class="mb-2">
        <div class="mb-2">
          <small class="text-muted">Intensity:</small>
              <span v-for="n in 3" :key="n">
              <i class="bi bi-fire me-1 ms-1" 
              :class="n <= getIntensityBadgeClass(exercise.intensity)
              ? 'fire-orange': 'fire-faint'">
            </i>
          </span>
        </div>
      </div>
      
      <div class="mb-2">
        <strong>Muscles:</strong>
        <div class="mt-1">
          <span v-for="muscle in exercise.muscle" :key="muscle" class="badge bg-light text-dark me-1 text-capitalize" style="font-weight: 500;">
            {{ muscle }}
          </span>
        </div>
      </div>
      
      <div class="mb-3">
        <strong>Equipment:</strong>
        <div class="mt-1">
          <span v-for="eq in exercise.equipment" :key="eq" class="badge bg-light text-dark border me-1 text-capitalize" style="font-weight:500;">
            {{ eq.replace(/_/g, ' ') }}
          </span>
        </div>
      </div>
      
      <div class="mb-2">
        <div><i class="bi bi-clock"></i> <span class="ms-1">{{ exercise.timePerSetSec }}s</span></div>
      </div>

      <div class="d-flex justify-content-end mt-auto">
        <button class="btn btn-outline-primary btn-sm" @click.stop="$emit('addToRoutine', exercise)">
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
    case 'low':    return 1
    case 'medium': return 2
    case 'high':   return 3
    default:       return 0
  }
}

const getDifficultyBadgeClass = (difficulty) => {
  switch (String(difficulty).toLowerCase()) {
    case 'beginner': return 'bg-success'
    case 'intermediate': return 'bg-warning'
    case 'advanced': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

</script>


<style scoped>
.fire-orange {
  color: #FF7F00;
}
.fire-faint {
  color: #6c757d;
  opacity: 0.3;
}
</style>