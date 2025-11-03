import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

// Initialize theme immediately when module loads
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  theme.value = savedTheme
  const html = document.documentElement
  if (savedTheme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// Initialize on module load
if (typeof document !== 'undefined') {
  initializeTheme()
}

export function useTheme() {
  const setTheme = (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.warn('Invalid theme:', newTheme)
      return
    }
    
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    
    // Apply theme to document
    const html = document.documentElement
    if (newTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    setTheme,
    toggleTheme
  }
}

