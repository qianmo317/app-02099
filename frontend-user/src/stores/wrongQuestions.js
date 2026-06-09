import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import logger from '@/utils/logger'

export const useWrongQuestionStore = defineStore('wrongQuestions', () => {
  const wrongQuestions = ref([])

  function init() {
    const saved = localStorage.getItem('wrongQuestions')
    if (saved) {
      try {
        wrongQuestions.value = JSON.parse(saved)
      } catch {
        wrongQuestions.value = []
      }
    }
  }

  function persist() {
    localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions.value))
  }

  function isWrong(title) {
    return wrongQuestions.value.some((q) => q.title === title && !q.mastered)
  }

  function addWrongQuestion(question) {
    const existing = wrongQuestions.value.find((q) => q.title === question.title)
    if (existing) {
      existing.wrongCount = (existing.wrongCount || 1) + 1
      existing.lastWrongAt = new Date().toISOString()
      existing.userAnswer = question.userAnswer
      existing.mastered = false
      logger.info('Wrong question updated:', question.title)
    } else {
      wrongQuestions.value.unshift({
        ...question,
        wrongCount: 1,
        addedAt: new Date().toISOString(),
        lastWrongAt: new Date().toISOString(),
        mastered: false
      })
      logger.info('Added to wrong questions:', question.title)
    }
    persist()
  }

  function addWrongQuestions(questions) {
    questions.forEach((q) => addWrongQuestion(q))
  }

  function removeWrongQuestion(title) {
    const idx = wrongQuestions.value.findIndex((q) => q.title === title)
    if (idx >= 0) {
      wrongQuestions.value.splice(idx, 1)
      persist()
      logger.info('Removed from wrong questions:', title)
    }
  }

  function markMastered(title) {
    const q = wrongQuestions.value.find((q) => q.title === title)
    if (q) {
      q.mastered = true
      q.masteredAt = new Date().toISOString()
      persist()
      logger.info('Marked as mastered:', title)
    }
  }

  function unmarkMastered(title) {
    const q = wrongQuestions.value.find((q) => q.title === title)
    if (q) {
      q.mastered = false
      q.masteredAt = null
      persist()
      logger.info('Unmarked mastered:', title)
    }
  }

  const activeWrongQuestions = computed(() => {
    return wrongQuestions.value.filter((q) => !q.mastered)
  })

  const masteredQuestions = computed(() => {
    return wrongQuestions.value.filter((q) => q.mastered)
  })

  const categoryStats = computed(() => {
    const map = {}
    activeWrongQuestions.value.forEach((q) => {
      if (!map[q.category]) {
        map[q.category] = { category: q.category, count: 0 }
      }
      map[q.category].count++
    })
    return Object.values(map).sort((a, b) => b.count - a.count)
  })

  const totalCount = computed(() => activeWrongQuestions.value.length)
  const masteredCount = computed(() => masteredQuestions.value.length)

  function getByCategory(category) {
    if (!category || category === '全部') {
      return activeWrongQuestions.value
    }
    return activeWrongQuestions.value.filter((q) => q.category === category)
  }

  init()

  return {
    wrongQuestions,
    activeWrongQuestions,
    masteredQuestions,
    categoryStats,
    totalCount,
    masteredCount,
    isWrong,
    addWrongQuestion,
    addWrongQuestions,
    removeWrongQuestion,
    markMastered,
    unmarkMastered,
    getByCategory
  }
})
