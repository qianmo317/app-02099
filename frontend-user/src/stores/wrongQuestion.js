import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import logger from '@/utils/logger'

const STORAGE_KEY = 'wrongQuestions'

export const useWrongQuestionStore = defineStore('wrongQuestions', () => {
  const items = ref([])

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch {
        items.value = []
      }
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  const categories = computed(() => {
    const set = new Set(items.value.map((i) => i.category))
    return [...set].sort()
  })

  const totalCount = computed(() => items.value.length)

  const unmasteredCount = computed(() => items.value.filter((i) => !i.mastered).length)

  const masteredCount = computed(() => items.value.filter((i) => i.mastered).length)

  const categoryStats = computed(() => {
    const map = {}
    items.value.forEach((i) => {
      if (!map[i.category]) map[i.category] = { total: 0, mastered: 0 }
      map[i.category].total++
      if (i.mastered) map[i.category].mastered++
    })
    return Object.entries(map).map(([category, stat]) => ({ category, ...stat }))
  })

  function addFromInterview(resultId, answers) {
    const wrongItems = answers
      .filter((a) => !a.userAnswer.trim())
      .map((a) => ({
        id: Date.now() + Math.random(),
        title: a.title,
        category: a.category,
        userAnswer: a.userAnswer,
        referenceAnswer: a.referenceAnswer,
        addedAt: new Date().toISOString(),
        mastered: false,
        sourceInterviewId: resultId
      }))

    if (wrongItems.length === 0) return 0

    const existingTitles = new Set(items.value.map((i) => i.title))
    const newItems = wrongItems.filter((i) => !existingTitles.has(i.title))
    items.value.unshift(...newItems)
    persist()
    logger.info('Wrong questions added from interview:', newItems.length)
    return newItems.length
  }

  function isInWrongBook(title) {
    return items.value.some((i) => i.title === title)
  }

  function addSingle({ title, category, userAnswer, referenceAnswer, sourceInterviewId }) {
    if (isInWrongBook(title)) return false
    items.value.unshift({
      id: Date.now() + Math.random(),
      title,
      category,
      userAnswer,
      referenceAnswer,
      addedAt: new Date().toISOString(),
      mastered: false,
      sourceInterviewId
    })
    persist()
    logger.info('Wrong question added manually:', title)
    return true
  }

  function remove(id) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx >= 0) {
      items.value.splice(idx, 1)
      persist()
      logger.info('Wrong question removed:', id)
    }
  }

  function toggleMastered(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.mastered = !item.mastered
      persist()
      logger.info('Wrong question mastered toggled:', id, item.mastered)
    }
  }

  init()

  return {
    items, categories, totalCount, unmasteredCount, masteredCount, categoryStats,
    addFromInterview, addSingle, isInWrongBook, remove, toggleMastered
  }
})
