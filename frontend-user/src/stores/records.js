import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import logger from '@/utils/logger'

export const useRecordStore = defineStore('records', () => {
  const overview = ref({
    todayCount: 0,
    streak: 0,
    totalCount: 0,
    favoriteCount: 0,
    interviewCount: 0,
    categoryMastery: {}
  })
  const calendarData = ref([])
  const questionRecords = ref([])

  async function fetchOverview() {
    try {
      const res = await axios.get('/api/stats/overview')
      overview.value = res.data || overview.value
    } catch (err) {
      logger.error('Failed to fetch overview:', err)
    }
  }

  async function fetchCalendar() {
    try {
      const res = await axios.get('/api/stats/calendar')
      calendarData.value = res.data || []
    } catch (err) {
      logger.error('Failed to fetch calendar:', err)
    }
  }

  async function fetchQuestionRecords() {
    try {
      const res = await axios.get('/api/records/questions')
      questionRecords.value = res.data || []
    } catch (err) {
      logger.error('Failed to fetch question records:', err)
    }
  }

  return { overview, calendarData, questionRecords, fetchOverview, fetchCalendar, fetchQuestionRecords }
})
