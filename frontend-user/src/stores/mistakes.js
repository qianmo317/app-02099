import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import logger from '@/utils/logger'

const STORAGE_KEY = 'mistakeBook'

export const useMistakeStore = defineStore('mistakes', () => {
  const mistakes = ref([])

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      mistakes.value = saved
    } catch (err) {
      logger.error('Failed to load mistakes:', err)
      mistakes.value = []
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes.value))
  }

  function addMistakes(items) {
    const now = new Date().toISOString()
    let addedCount = 0

    items.forEach((a) => {
      const exists = mistakes.value.some(
        (m) => m.title === a.title && m.category === a.category
      )
      if (exists) return

      mistakes.value.unshift({
        id: Date.now() + Math.random(),
        title: a.title,
        category: a.category,
        userAnswer: a.userAnswer,
        referenceAnswer: a.referenceAnswer,
        source: 'interview',
        mastered: false,
        createdAt: now,
        wrongCount: 1
      })
      addedCount++
    })

    persist()
    logger.info('Added mistakes:', addedCount)
    return addedCount
  }

  function remove(id) {
    const idx = mistakes.value.findIndex((m) => m.id === id)
    if (idx !== -1) {
      mistakes.value.splice(idx, 1)
      persist()
    }
  }

  function toggleMastered(id) {
    const item = mistakes.value.find((m) => m.id === id)
    if (item) {
      item.mastered = !item.mastered
      persist()
    }
  }

  function clearAll() {
    mistakes.value = []
    persist()
  }

  const categories = computed(() => {
    const cats = new Set(mistakes.value.map((m) => m.category))
    return Array.from(cats)
  })

  const totalCount = computed(() => mistakes.value.length)

  const unmasteredCount = computed(
    () => mistakes.value.filter((m) => !m.mastered).length
  )

  const masteredCount = computed(
    () => mistakes.value.filter((m) => m.mastered).length
  )

  const categoryStats = computed(() => {
    const stats = {}
    mistakes.value.forEach((m) => {
      if (!stats[m.category]) {
        stats[m.category] = { total: 0, mastered: 0 }
      }
      stats[m.category].total++
      if (m.mastered) stats[m.category].mastered++
    })
    return stats
  })

  load()

  return {
    mistakes,
    categories,
    totalCount,
    unmasteredCount,
    masteredCount,
    categoryStats,
    load,
    addMistakes,
    remove,
    toggleMastered,
    clearAll
  }
})
