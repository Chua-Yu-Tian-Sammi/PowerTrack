<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h6>{{ exerciseName }}</h6>
          <small class="text-muted">{{ exerciseDescription }}</small>
        </div>
        <div class="col-md-2">
          <label class="form-label">Sets</label>
          <input 
            type="number" 
            class="form-control form-control-sm" 
            :value="sets"
            @input="$emit('update:sets', parseInt($event.target.value))"
            min="1" 
            max="20"
          >
        </div>
        <div class="col-md-2">
          <label class="form-label">Reps</label>
          <input 
            type="text" 
            class="form-control form-control-sm" 
            :value="reps"
            @input="$emit('update:reps', $event.target.value)"
            placeholder="8-12"
          >
        </div>
        <div class="col-md-2">
          <label class="form-label">Rest (sec)</label>
          <input 
            type="number" 
            class="form-control form-control-sm" 
            :value="restSeconds"
            @input="$emit('update:restSeconds', parseInt($event.target.value))"
            min="0" 
            max="300"
          >
        </div>
        <div class="col-md-2">
          <button 
            type="button" 
            class="btn btn-outline-danger btn-sm"
            @click="$emit('remove')"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  exerciseName: {
    type: String,
    required: true
  },
  exerciseDescription: {
    type: String,
    default: ''
  },
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: [Number, String],
    required: true
  },
  restSeconds: {
    type: Number,
    required: true
  },
  
})

defineEmits(['update:sets', 'update:reps', 'update:restSeconds', 'remove'])
</script>

