<template>
  <div class="exercise-library">
    <div class="row align-items-center mb-4">
      <div class="col-lg-8 mb-3 mb-lg-0">
        <h2 class="mb-1"><i class="bi bi-book me-2"></i>Exercise Library</h2>
        <p class="text-muted mb-0">Browse and explore exercises for your workouts</p>
      </div>
      <div class="col-lg-4">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search exercises..." 
            v-model="searchQuery"
            @input="filterExercises"
          >
          <button class="btn btn-outline-secondary" type="button">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- filter options -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body p-4">
            <div class="row">
              <div class="col-md-3">
                <label class="form-label">Muscle Group</label>
                <select class="form-select" v-model="filters.muscle" @change="filterExercises">
                  <option value="">All</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                  <option value="legs">Legs</option>
                  <option value="core">Core</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Equipment</label>
                <select class="form-select" v-model="filters.equipment" @change="filterExercises">
                  <option value="">All</option>
                  <option value="bodyweight">Bodyweight</option>
                  <option value="dumbbells">Dumbbells</option>
                  <option value="barbell">Barbell</option>
                  <option value="bench">Bench</option>
                  <option value="pullup_bar">Pull-up Bar</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Intensity</label>
                <select class="form-select" v-model="filters.intensity" @change="filterExercises">
                  <option value="">All</option>
                  <option value="low">Low &#x1F525;</option>
                  <option value="medium">Medium &#x1F525; &#x1F525;</option>
                  <option value="high">High &#x1F525; &#x1F525; &#x1F525;</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Difficulty</label>
                <select class="form-select" v-model="filters.difficulty" @change="filterExercises">
                  <option value="">All</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- loading spinner -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading exercises...</p>
    </div>

    <!-- exercise cards -->
    <div v-else class="row g-4">
      <!-- <div v-for="exercise in filteredExercises" :key="exercise.exerciseId" class="col-lg-4 col-md-6"> -->
      <div v-for="exercise in paginatedexercisecard" :key="exercise.exerciseId" class="col-lg-4 col-md-6">
        <ExerciseCard 
          :exercise="exercise"
          @add-to-routine="addToRoutine"
        />
      </div>
    </div>

    <!-- nothing found -->
    <div v-if="!loading && filteredExercises.length === 0" class="text-center py-5">
      <i class="bi bi-search display-1 text-muted"></i>
      <h4 class="mt-3">No exercises found</h4>
      <p class="text-muted">Try adjusting your filters or search terms</p>
    </div>
    <!---pagination-->
    <div v-else class="pagination-container d-flex justify-content-center mt-4">
      <button class="btn btn-secondary btn-sm me-2" :disabled="currentPage===1" @click="previousPage">
        Previous
      </button>

      <div class="pagination-pages d-flex align-items-center">
        <button v-for="page in pages"
        :key="page" 
        class="btn btn-sm" 
        :class="{'btn-primary': currentPage === page}" 
        @click="goToPage(page)">
        {{ page }}
        </button>
      </div>
      
      <button class="btn btn-secondary btn-sm" :disabled="currentPage===totalPages" @click="nextPage">
        Next
      </button>

    </div>
  <!--modal-->
  <PopUpModal ref="modalRef"/>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import ExerciseCard from '../components/ExerciseCard.vue'
import { AuthService } from '../services/authService.js'
import PopUpModal from '@/components/PopUpModal.vue'

const loading = ref(false)
const exercises = ref([])
const searchQuery = ref('')

const filters = ref({
  muscle: '',
  equipment: '',
  intensity: '',
  difficulty: ''
})

const filteredExercises = computed(() => {
  let filtered = exercises.value

  // filter by search text
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(exercise => 
      exercise.name.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query) ||
      exercise.muscle.some(m => m.toLowerCase().includes(query))
    )
  }

  // apply other filters
  if (filters.value.muscle) {
    filtered = filtered.filter(exercise => 
      exercise.muscle.includes(filters.value.muscle)
    )
  }

  if (filters.value.equipment) {
    filtered = filtered.filter(exercise => 
      exercise.equipment.includes(filters.value.equipment)
    )
  }

  if (filters.value.intensity) {
    filtered = filtered.filter(exercise => 
      exercise.intensity === filters.value.intensity
    )
  }

  if (filters.value.difficulty) {
    filtered = filtered.filter(exercise => 
      exercise.difficulty === filters.value.difficulty
    )
  }

  return filtered
})

// onMounted(async () => {
//   await loadExercises()
// })

const user = ref(null)
const modalRef = ref(null)

onMounted(() => {
  
  AuthService.onAuthStateChanged(async (currentUser) => {
    user.value = currentUser
    if (user.value) {
      await loadExercises()
    } else {
      console.log("user not login")
      modalRef.value?.show() 
  }
  })
})

const loadExercises = async () => {
  loading.value = true
  try {
    exercises.value = await WorkoutService.getExercises()
  } catch (error) {
    console.error('Error loading exercises:', error)
  } finally {
    loading.value = false
  }
}

const addToRoutine = (exercise) => {
  try {
    const key = 'draftRoutineExercises'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const exists = existing.some(e => e.exerciseId === exercise.exerciseId)
    if (!exists) {
      const drafted = {
        exerciseId: exercise.exerciseId,
        sets: 3,
        reps: '8-12',
        restSeconds: 60
      }
      existing.push(drafted)
      localStorage.setItem(key, JSON.stringify(existing))
    }
  } catch (error) {
    console.error('Error adding exercise to draft routine:', error)
  }
}

const startPage = ref(1)
const currentPage = ref(1)
const itemPerPage = 6 

const totalPages = computed(()=>{
  return Math.ceil(filteredExercises.value.length/itemPerPage)
})

const pages = computed(() => {
  const pages = []
  const lastpage = Math.min(startPage.value+5,totalPages.value)
  for (let i = startPage.value; i <= lastpage; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedexercisecard = computed(()=>{
  const start = (currentPage.value -1) * itemPerPage
  const end = start + itemPerPage
  return filteredExercises.value.slice(start,end)
})

const previousPage =()=>{
  if(currentPage.value>1){
    currentPage.value -=1
  }
  if (currentPage.value<startPage.value) {
    startPage.value -=6
  }
}

const nextPage =()=>{
  if (currentPage.value< totalPages.value) {
    currentPage.value +=1
  }
  if (currentPage.value >startPage.value+5) {
    startPage.value+=6
  }
}

const goToPage = (page)=>{
  currentPage.value = page
  startPage.value = Math.floor((page-1)/6)*6 +1
}
</script>

<style scope>
.pagination-container{
  padding: 10px;
  position: relative;
  bottom: 0;
  margin-bottom: 30px;
}

/*prevent pagination from getting hidden */
.pagination-container button{
  z-index: 1;
  margin: 0 10px;
}
</style>