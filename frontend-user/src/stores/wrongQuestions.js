import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import logger from '@/utils/logger'

const STORAGE_KEY = 'wrongQuestions'

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function makeKey(item) {
  // 使用 title + category 作为唯一标识，避免重复收录
  return `${item.category || '未分类'}::${item.title || ''}`
}

export const useWrongQuestionStore = defineStore('wrongQuestions', () => {
  const items = ref(loadFromStorage())

  function init() {
    items.value = loadFromStorage()
  }

  /**
   * 批量收集错题（来自一次面试）
   * 收录条件：未作答（视为答错） 或 被显式标记 correct === false
   * @param {Array<{title:string, category:string, userAnswer:string, referenceAnswer:string, correct?:boolean}>} answers
   * @param {{sessionId?: number|string, type?: string}} meta
   */
  function collectFromInterview(answers, meta = {}) {
    if (!Array.isArray(answers) || answers.length === 0) return 0
    const now = new Date().toISOString()
    const existingKeys = new Set(items.value.map((i) => makeKey(i)))
    let added = 0
    answers.forEach((a) => {
      const userText = (a.userAnswer || '').trim()
      const isUnanswered = userText.length === 0
      const isMarkedWrong = a.correct === false
      // 答错或没答的题目都收入错题本
      if (isUnanswered || isMarkedWrong) {
        const key = makeKey(a)
        if (existingKeys.has(key)) return
        items.value.unshift({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: a.title,
          category: a.category || '未分类',
          userAnswer: a.userAnswer || '',
          referenceAnswer: a.referenceAnswer || '',
          mastered: false,
          createdAt: now,
          sessionId: meta.sessionId || null,
          sessionType: meta.type || '',
          reason: isUnanswered ? 'unanswered' : 'marked_wrong'
        })
        existingKeys.add(key)
        added++
      }
    })
    if (added > 0) {
      persist(items.value)
      logger.info('Wrong questions collected from interview:', added)
    }
    return added
  }

  function addManual(item) {
    const key = makeKey(item)
    if (items.value.some((i) => makeKey(i) === key)) return false
    items.value.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: item.title,
      category: item.category || '未分类',
      userAnswer: item.userAnswer || '',
      referenceAnswer: item.referenceAnswer || '',
      mastered: false,
      createdAt: new Date().toISOString(),
      sessionId: item.sessionId || null,
      sessionType: item.sessionType || ''
    })
    persist(items.value)
    return true
  }

  function remove(id) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx >= 0) {
      items.value.splice(idx, 1)
      persist(items.value)
      logger.info('Wrong question removed:', id)
    }
  }

  function toggleMastered(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.mastered = !item.mastered
      persist(items.value)
      logger.info('Wrong question mastered toggled:', id, item.mastered)
    }
  }

  function clearAll() {
    items.value = []
    persist(items.value)
  }

  const totalCount = computed(() => items.value.length)
  const masteredCount = computed(() => items.value.filter((i) => i.mastered).length)
  const pendingCount = computed(() => items.value.filter((i) => !i.mastered).length)

  const groupedByCategory = computed(() => {
    const map = {}
    items.value.forEach((item) => {
      const cat = item.category || '未分类'
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    })
    return map
  })

  const categoryStats = computed(() => {
    return Object.entries(groupedByCategory.value).map(([category, list]) => ({
      category,
      total: list.length,
      mastered: list.filter((i) => i.mastered).length,
      pending: list.filter((i) => !i.mastered).length
    }))
  })

  function isCollected(item) {
    const key = makeKey(item)
    return items.value.some((i) => makeKey(i) === key)
  }

  return {
    items,
    totalCount,
    masteredCount,
    pendingCount,
    groupedByCategory,
    categoryStats,
    init,
    collectFromInterview,
    addManual,
    remove,
    toggleMastered,
    clearAll,
    isCollected
  }
})
