<template>
  <div
    ref="modalRef"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Please Sign In</h5>
          <button type="button" class="btn-close" @click="hide" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hide">Close</button>
          <button type="button" class="btn btn-primary" @click="goToLogin">Sign In</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineExpose, defineProps } from 'vue'
import { Modal } from 'bootstrap'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: 'Please Sign In'
  },
  message: {
    type: String,
    default: 'You need to be signed in to view or add exercises.'
  }
})

const modalRef = ref(null)
let bsModal = null
const router = useRouter()

//show the modal
function show() {
  bsModal.show()
}

//when click close
function hide() {
  bsModal.hide()
}

//redirect to login page
function goToLogin() {
  router.push('/profile')
  hide()
}

//create a bootstrap model and store it in bsModal
onMounted(() => {
  bsModal = new Modal(modalRef.value)
})

onBeforeUnmount(() => {
  bsModal?.dispose()
})

// allow other page to call this via ref
defineExpose({
  show,
  hide
})
</script>