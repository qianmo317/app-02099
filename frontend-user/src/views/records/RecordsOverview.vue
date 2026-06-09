<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordStore } from '@/stores/records'
import { useWrongQuestionStore } from '@/stores/wrongQuestion'
import { Collection, ChatLineSquare, Star, CircleClose } from '@element-plus/icons-vue'

const router = useRouter()
const recordStore = useRecordStore()
const wrongStore = useWrongQuestionStore()

onMounted(() => {
  recordStore.fetchOverview()
  recordStore.fetchCalendar()
})

const overview = computed(() => recordStore.overview)
const calendar = computed(() => recordStore.calendarData)

function getCellLevel(count) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  return 3
}

const weeks = computed(() => {
  const result = []
  const map = {}
  calendar.value.forEach((d) => {
    map[d.date] = d.count
  })
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    result.push({ date: key, count: map[key] || 0, day: d.getDay() })
  }
  return result
})

const radarCategories = ['前端', '后端', '算法', '系统设计', '行为面试']
const radarData = computed(() => {
  const mastery = overview.value.categoryMastery || {}
  return radarCategories.map((c) => mastery[c] || 0)
})

const maxRadar = computed(() => Math.max(...radarData.value, 1))
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">学习记录</h1>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card cursor-pointer" @click="router.push('/records/questions')">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center">
            <el-icon :size="20" class="text-brand-400"><Collection /></el-icon>
          </div>
          <div>
            <div class="text-2xl font-display font-bold text-navy-900 dark:text-white">{{ overview.totalCount }}</div>
            <div class="text-xs text-navy-400">累计刷题</div>
          </div>
        </div>
      </div>
      <div class="stat-card cursor-pointer" @click="router.push('/records/interviews')">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
            <el-icon :size="20" class="text-amber-500"><ChatLineSquare /></el-icon>
          </div>
          <div>
            <div class="text-2xl font-display font-bold text-navy-900 dark:text-white">{{ overview.interviewCount }}</div>
            <div class="text-xs text-navy-400">模拟面试</div>
          </div>
        </div>
      </div>
      <div class="stat-card cursor-pointer" @click="router.push('/records/favorites')">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center">
            <el-icon :size="20" class="text-rose-400"><Star /></el-icon>
          </div>
          <div>
            <div class="text-2xl font-display font-bold text-navy-900 dark:text-white">{{ overview.favoriteCount }}</div>
            <div class="text-xs text-navy-400">收藏题目</div>
          </div>
        </div>
      </div>
      <div class="stat-card cursor-pointer" @click="router.push('/records/wrong')">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center">
            <el-icon :size="20" class="text-orange-500"><CircleClose /></el-icon>
          </div>
          <div>
            <div class="text-2xl font-display font-bold text-navy-900 dark:text-white">{{ wrongStore.unmasteredCount }}</div>
            <div class="text-xs text-navy-400">错题未掌握</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h2 class="section-title mb-4">学习日历（近 30 天）</h2>
      <div class="flex flex-wrap gap-1">
        <div
          v-for="d in weeks"
          :key="d.date"
          class="w-5 h-5 rounded-sm transition-colors"
          :class="{
            'bg-slate-100 dark:bg-navy-800': getCellLevel(d.count) === 0,
            'bg-brand-200 dark:bg-brand-900': getCellLevel(d.count) === 1,
            'bg-brand-400 dark:bg-brand-600': getCellLevel(d.count) === 2,
            'bg-brand-600 dark:bg-brand-400': getCellLevel(d.count) === 3
          }"
          :title="`${d.date}: ${d.count} 题`"
        />
      </div>
      <div class="flex items-center gap-2 mt-3 text-xs text-navy-400">
        <span>少</span>
        <div class="w-3 h-3 rounded-sm bg-slate-100 dark:bg-navy-800" />
        <div class="w-3 h-3 rounded-sm bg-brand-200 dark:bg-brand-900" />
        <div class="w-3 h-3 rounded-sm bg-brand-400 dark:bg-brand-600" />
        <div class="w-3 h-3 rounded-sm bg-brand-600 dark:bg-brand-400" />
        <span>多</span>
      </div>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h2 class="section-title mb-4">分类掌握度</h2>
      <div class="space-y-3">
        <div v-for="(cat, idx) in radarCategories" :key="cat" class="flex items-center gap-4">
          <span class="text-sm text-navy-600 dark:text-navy-300 w-20 text-right">{{ cat }}</span>
          <el-progress
            :percentage="Math.round((radarData[idx] / maxRadar) * 100)"
            :stroke-width="10"
            :show-text="false"
            class="flex-1"
          />
          <span class="text-sm text-navy-500 w-12 text-right">{{ radarData[idx] }} 题</span>
        </div>
      </div>
    </div>
  </div>
</template>
