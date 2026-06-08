import axios from 'axios'
import { mockQuestions } from './questions'
import { formatDate, daysAgo } from '@/utils/date'
import logger from '@/utils/logger'

const MOCK_DELAY = 200

function delay(ms = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateCalendarData() {
  const data = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    data.push({
      date: d.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 8)
    })
  }
  return data
}

const presetInterviewResults = [
  {
    id: 1,
    type: '技术面试',
    difficulty: '中等',
    createdAt: daysAgo(5),
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
    createdAt: daysAgo(12),
    answers: [
      { title: 'Vue 3 的响应式原理', category: '前端', userAnswer: 'Vue 3 使用 Proxy 实现...', referenceAnswer: mockQuestions[1].answer },
      { title: '数据库索引的原理和优化', category: '后端', userAnswer: 'B+ 树是最常用的索引结构...', referenceAnswer: mockQuestions[8].answer },
      { title: '动态规划的核心思想和解题框架', category: '算法', userAnswer: '', referenceAnswer: mockQuestions[16].answer },
      { title: '设计一个短链接服务', category: '系统设计', userAnswer: '使用 Base62 编码 + Redis 缓存...', referenceAnswer: mockQuestions[20].answer },
      { title: '描述一个你主导的项目', category: '行为面试', userAnswer: '我主导了一个数据平台项目...', referenceAnswer: mockQuestions[29].answer }
    ]
  }
]

const presetQuestionRecords = [
  { id: 1, questionId: 1, questionTitle: '解释 JavaScript 中的事件循环机制', date: formatDate(daysAgo(1)), correct: true },
  { id: 2, questionId: 3, questionTitle: 'CSS Flexbox 与 Grid 的区别和适用场景', date: formatDate(daysAgo(1)), correct: true },
  { id: 3, questionId: 8, questionTitle: 'RESTful API 设计原则', date: formatDate(daysAgo(2)), correct: true },
  { id: 4, questionId: 15, questionTitle: '常见排序算法的时间复杂度对比', date: formatDate(daysAgo(2)), correct: false },
  { id: 5, questionId: 10, questionTitle: 'JWT 认证机制详解', date: formatDate(daysAgo(3)), correct: true },
  { id: 6, questionId: 21, questionTitle: '设计一个短链接服务', date: formatDate(daysAgo(3)), correct: true },
  { id: 7, questionId: 26, questionTitle: '请描述你遇到过的最大技术挑战', date: formatDate(daysAgo(4)), correct: true },
  { id: 8, questionId: 2, questionTitle: 'Vue 3 的响应式原理', date: formatDate(daysAgo(5)), correct: false }
]

export function setupMock() {
  logger.info('Mock service initialized')

  axios.interceptors.request.use(async (config) => {
    const url = config.url || ''

    if (!url.startsWith('/api')) return config

    await delay()

    const response = { data: null, status: 200 }
    const path = url.replace('/api', '')

    if (path === '/questions' && config.method === 'get') {
      const params = config.params || {}
      let list = [...mockQuestions]
      if (params.category && params.category !== '全部') {
        list = list.filter((q) => q.category === params.category)
      }
      if (params.difficulty && params.difficulty !== '全部') {
        list = list.filter((q) => q.difficulty === params.difficulty)
      }
      if (params.keyword) {
        const kw = params.keyword.toLowerCase()
        list = list.filter((q) => q.title.toLowerCase().includes(kw))
      }
      const page = params.page || 1
      const size = params.size || 20
      response.data = {
        list: list.slice((page - 1) * size, page * size),
        total: list.length,
        page,
        size
      }
    } else if (path.match(/^\/questions\/\d+$/) && config.method === 'get') {
      const id = Number(path.split('/').pop())
      response.data = mockQuestions.find((q) => q.id === id) || null
      if (!response.data) response.status = 404
    } else if (path === '/auth/login' && config.method === 'post') {
      response.data = {
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 1, name: '面试达人', email: config.data?.email || 'user@test.com' }
      }
    } else if (path === '/auth/register' && config.method === 'post') {
      response.data = {
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 2, name: config.data?.name || '新用户', email: config.data?.email || 'new@test.com' }
      }
    } else if (path === '/stats/overview' && config.method === 'get') {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      response.data = {
        todayCount: 3,
        streak: 7,
        totalCount: presetQuestionRecords.length,
        favoriteCount: favorites.length,
        interviewCount: presetInterviewResults.length,
        categoryMastery: { '前端': 5, '后端': 3, '算法': 4, '系统设计': 2, '行为面试': 3 }
      }
    } else if (path === '/stats/calendar' && config.method === 'get') {
      response.data = generateCalendarData()
    } else if (path === '/records/questions' && config.method === 'get') {
      response.data = presetQuestionRecords
    } else if (path === '/interviews' && config.method === 'get') {
      const saved = JSON.parse(localStorage.getItem('interviewResults') || '[]')
      response.data = [...presetInterviewResults, ...saved]
    } else {
      return config
    }

    return Promise.reject({
      __MOCK__: true,
      response: { data: response.data, status: response.status }
    })
  })

  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error?.__MOCK__) {
        return Promise.resolve({ data: error.response.data, status: error.response.status })
      }
      return Promise.reject(error)
    }
  )
}
