<template>
  <div v-if="show" class="modal show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select Exercise</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search exercises..." 
              v-model="searchQuery"
            >
            <button class="btn btn-outline-secondary" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
          <div class="row">
            <div v-for="exercise in filteredExercises" :key="exercise.exerciseId" class="col-md-6 mb-3">
              <div class="card exercise-card" @click="selectExercise(exercise)">
                <div class="card-body">
                  <h6>{{ exercise.name }}</h6>
                  <p class="text-muted small">{{ exercise.description }}</p>
                  <div class="d-flex justify-content-between">
                    <span class="badge bg-secondary">{{ exercise.difficulty }}</span>
                    <span class="badge bg-info">{{ exercise.intensity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  exercises: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])

const searchQuery = ref('')

const filteredExercises = computed(() => {
  if (!searchQuery.value) return props.exercises
  
  const search = searchQuery.value.toLowerCase()
  return props.exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(search) ||
    exercise.description.toLowerCase().includes(search) ||
    exercise.muscle.some(m => m.toLowerCase().includes(search))
  )
})

const selectExercise = (exercise) => {
  emit('select', exercise)
  emit('close')
}
</script>

