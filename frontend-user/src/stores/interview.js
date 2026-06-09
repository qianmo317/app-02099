import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockQuestions } from '@/mock/questions'
import { formatDate } from '@/utils/date'
import logger from '@/utils/logger'
import { useWrongQuestionStore } from '@/stores/wrongQuestion'

export const useInterviewStore = defineStore('interview', () => {
  const currentSession = ref(null)
  const allResults = ref([])

  function loadResults() {
    const saved = JSON.parse(localStorage.getItem('interviewResults') || '[]')
    const preset = JSON.parse(localStorage.getItem('interviewPreset') || 'false')
    if (!preset) {
      const presetResults = [
        {
          id: 1,
          type: '技术面试',
          difficulty: '中等',
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          answers: [
            { title: '解释 JavaScript 中的事件循环机制', category: '前端', userAnswer: '事件循环包含宏任务和微任务...', referenceAnswer: mockQuestions[0].answer },
            { title: 'RESTful API 设计原则', category: '后端', userAnswer: 'REST 是一种架构风格...', referenceAnswer: mockQuestions[7].answer },
            { title: '常见排序算法的时间复杂度对比', category: '算法', userAnswer: '快排平均 O(nlogn)...', referenceAnswer: mockQuestions[14].answer },
            { title: '你是如何处理团队冲突的', category: '行为面试', userAnswer: '我会先倾听各方意见...', referenceAnswer: mockQuestions[26].answer },
            { title: 'CSS Flexbox 与 Grid 的区别和适用场景', category: '前端', userAnswer: '', referenceAnswer: mockQuestions[2].answer }
          ]
        },
        {
          id: 2,
          type: '综合面试',
          difficulty: '困难',
          createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
          answers: [
            { title: 'Vue 3 的响应式原理', category: '前端', userAnswer: 'Vue 3 使用 Proxy 实现...', referenceAnswer: mockQuestions[1].answer },
            { title: '数据库索引的原理和优化', category: '后端', userAnswer: 'B+ 树是最常用的索引结构...', referenceAnswer: mockQuestions[8].answer },
            { title: '动态规划的核心思想和解题框架', category: '算法', userAnswer: '', referenceAnswer: mockQuestions[16].answer },
            { title: '设计一个短链接服务', category: '系统设计', userAnswer: '使用 Base62 编码 + Redis 缓存...', referenceAnswer: mockQuestions[20].answer },
            { title: '描述一个你主导的项目', category: '行为面试', userAnswer: '我主导了一个数据平台项目...', referenceAnswer: mockQuestions[29].answer }
          ]
        }
      ]
      allResults.value = [...presetResults, ...saved]
      localStorage.setItem('interviewPreset', 'true')
    } else {
      allResults.value = saved
    }
  }

  function createSession(config) {
    const { type, difficulty, count, timed } = config
    let pool = [...mockQuestions]

    if (type === '技术面试') {
      pool = pool.filter((q) => ['前端', '后端', '算法'].includes(q.category))
    } else if (type === '行为面试') {
      pool = pool.filter((q) => q.category === '行为面试')
    }

    if (difficulty !== '全部') {
      const diffPool = pool.filter((q) => q.difficulty === difficulty)
      if (diffPool.length >= count) pool = diffPool
    }

    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count)

    currentSession.value = {
      type,
      difficulty,
      timed,
      questions: shuffled,
      answers: new Array(shuffled.length).fill(''),
      currentIndex: 0,
      startedAt: new Date().toISOString()
    }
    logger.info('Interview session created:', type, difficulty, count)
  }

  function submitAnswer(index, text) {
    if (currentSession.value) {
      currentSession.value.answers[index] = text
    }
  }

  function nextQuestion() {
    if (currentSession.value) {
      currentSession.value.currentIndex++
    }
  }

  function finishSession() {
    if (!currentSession.value) return null
    const session = currentSession.value
    const id = Date.now()
    const result = {
      id,
      type: session.type,
      difficulty: session.difficulty,
      createdAt: new Date().toISOString(),
      answers: session.questions.map((q, i) => ({
        title: q.title,
        category: q.category,
        userAnswer: session.answers[i] || '',
        referenceAnswer: q.answer
      }))
    }

    const saved = JSON.parse(localStorage.getItem('interviewResults') || '[]')
    saved.unshift(result)
    localStorage.setItem('interviewResults', JSON.stringify(saved))
    allResults.value.unshift(result)
    currentSession.value = null

    const wrongStore = useWrongQuestionStore()
    wrongStore.addFromInterview(id, result.answers)

    logger.info('Interview finished, result id:', id)
    return id
  }

  function getResultById(id) {
    loadResults()
    return allResults.value.find((r) => r.id === id) || null
  }

  function clearSession() {
    currentSession.value = null
  }

  return {
    currentSession, allResults,
    loadResults, createSession, submitAnswer, nextQuestion,
    finishSession, getResultById, clearSession
  }
})
