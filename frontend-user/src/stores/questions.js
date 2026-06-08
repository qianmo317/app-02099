import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import logger from '@/utils/logger'

export const useQuestionStore = defineStore('questions', () => {
  const allQuestions = ref([])
  const currentQuestion = ref(null)
  const loading = ref(false)

  async function fetchQuestions(params = {}) {
    if (allQuestions.value.length > 0 && !params.force) return
    loading.value = true
    try {
      const res = await axios.get('/api/questions', { params: { size: 100, ...params } })
      allQuestions.value = res.data?.list || []
      logger.info('Questions loaded:', allQuestions.value.length)
    } catch (err) {
      logger.error('Failed to load questions:', err)
    } finally {
      loading.value = false
    }
  }

  function setCurrentById(id) {
    currentQuestion.value = allQuestions.value.find((q) => q.id === id) || null
  }

  return { allQuestions, currentQuestion, loading, fetchQuestions, setCurrentById }
})
