<template>
  <div class="card h-100 exercise-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title">{{ exercise.name }}</h5>
        <span class="badge" :class="getIntensityBadgeClass(exercise.intensity)">
          {{ exercise.intensity }}
        </span>
      </div>
      
      <p class="card-text text-muted">{{ exercise.description }}</p>
      
      <div class="mb-2">
        <span class="badge bg-secondary me-1">{{ exercise.difficulty }}</span>
        <span class="badge bg-info me-1">{{ exercise.timePerSetSec }}s/set</span>
      </div>
      
      <div class="mb-2">
        <strong>Muscles:</strong>
        <div class="mt-1">
          <span v-for="muscle in exercise.muscle" :key="muscle" class="badge bg-light text-dark me-1">
            {{ muscle }}
          </span>
        </div>
      </div>
      
      <div class="mb-3">
        <strong>Equipment:</strong>
        <div class="mt-1">
          <span v-for="eq in exercise.equipment" :key="eq" class="badge bg-warning me-1">
            {{ eq }}
          </span>
        </div>
      </div>
      
      <div class="d-flex justify-content-between">
        <button class="btn btn-outline-primary btn-sm" @click.stop="$emit('viewDetails', exercise)">
          <i class="bi bi-eye me-1"></i>View Details
        </button>
        <button class="btn btn-success btn-sm" @click.stop="$emit('addToRoutine', exercise)">
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

defineEmits(['viewDetails', 'addToRoutine'])

const getIntensityBadgeClass = (intensity) => {
  switch (intensity) {
    case 'low': return 'bg-success'
    case 'medium': return 'bg-warning'
    case 'high': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

</script>
