import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import logger from '@/utils/logger'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const showLoginDialog = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  function requireLogin() {
    if (!token.value) {
      showLoginDialog.value = true
      return false
    }
    return true
  }

  function init() {
    const saved = localStorage.getItem('auth')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        user.value = data.user
        token.value = data.token
      } catch {
        localStorage.removeItem('auth')
      }
    }
  }

  async function login(email, password) {
    const res = await axios.post('/api/auth/login', { email, password })
    const data = res.data
    user.value = data.user
    token.value = data.token
    localStorage.setItem('auth', JSON.stringify(data))
    logger.info('User logged in:', data.user.name)
  }

  async function register(name, email, password) {
    const res = await axios.post('/api/auth/register', { name, email, password })
    const data = res.data
    user.value = data.user
    token.value = data.token
    localStorage.setItem('auth', JSON.stringify(data))
    logger.info('User registered:', data.user.name)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth')
    logger.info('User logged out')
  }

  init()

  return { user, token, isLoggedIn, showLoginDialog, requireLogin, login, register, logout }
})
