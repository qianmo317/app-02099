<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '@/stores/questions'
import { useRecordStore } from '@/stores/records'
import { TrendCharts, Timer, Collection, Star, ChatLineSquare, DataLine } from '@element-plus/icons-vue'

const router = useRouter()
const questionStore = useQuestionStore()
const recordStore = useRecordStore()

const stats = computed(() => recordStore.overview)
const recommended = ref([])

onMounted(async () => {
  await questionStore.fetchQuestions()
  await recordStore.fetchOverview()
  const all = questionStore.allQuestions
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  recommended.value = shuffled.slice(0, 4)
})

const difficultyColor = (d) => {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[d] || 'info'
}

const statCards = computed(() => [
  { label: '今日刷题', value: stats.value.todayCount, icon: TrendCharts, color: 'text-brand-400', bg: 'bg-brand-50 dark:bg-brand-950/20' },
  { label: '连续学习', value: `${stats.value.streak} 天`, icon: Timer, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
  { label: '累计刷题', value: stats.value.totalCount, icon: Collection, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { label: '收藏题目', value: stats.value.favoriteCount, icon: Star, color: 'text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20' }
])
</script>

<template>
  <div class="space-y-8">
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8 sm:p-10 text-white">
      <div class="absolute top-0 right-0 w-80 h-80 bg-brand-400/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div class="absolute bottom-0 left-0 w-60 h-60 bg-brand-400/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
      <div class="relative z-10">
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
          系统化提升<br>
          <span class="text-brand-400">面试能力</span>
        </h1>
        <p class="text-navy-300 text-base max-w-lg mb-6 leading-relaxed">
          精选题库、模拟面试、智能记录 —— 三位一体的面试准备平台，助你从容应对每一场面试挑战。
        </p>
        <div class="flex flex-wrap gap-3">
          <el-button type="primary" size="large" round @click="router.push('/questions')">
            浏览题库
          </el-button>
          <el-button size="large" round class="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20" @click="router.push('/interview')">
            开始模拟面试
          </el-button>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="stat-card flex items-center gap-4"
      >
        <div :class="[card.bg, 'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0']">
          <el-icon :size="22" :class="card.color"><component :is="card.icon" /></el-icon>
        </div>
        <div>
          <div class="text-2xl font-display font-bold text-navy-900 dark:text-white">{{ card.value }}</div>
          <div class="text-xs text-navy-400 dark:text-navy-500">{{ card.label }}</div>
        </div>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-5">
        <h2 class="section-title">推荐练习</h2>
        <el-button text type="primary" @click="router.push('/questions')">查看全部</el-button>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="q in recommended"
          :key="q.id"
          class="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-100 dark:border-navy-700 card-hover cursor-pointer"
          @click="router.push(`/questions/${q.id}`)"
        >
          <div class="flex items-center gap-2 mb-3">
            <el-tag size="small" :type="difficultyColor(q.difficulty)" effect="plain" round>{{ q.difficulty }}</el-tag>
            <el-tag size="small" effect="plain" round>{{ q.category }}</el-tag>
          </div>
          <h3 class="font-medium text-navy-900 dark:text-white text-sm leading-snug line-clamp-2 mb-2">{{ q.title }}</h3>
          <p class="text-xs text-navy-400 dark:text-navy-500 line-clamp-2">{{ q.description }}</p>
        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <div class="flex items-center justify-between mb-5">
        <h2 class="section-title">快速入口</h2>
      </div>
      <div class="grid sm:grid-cols-3 gap-4">
        <div
          class="group p-5 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-950/20 dark:to-brand-900/10 border border-brand-100 dark:border-brand-900/30 cursor-pointer card-hover"
          @click="router.push('/questions')"
        >
          <div class="w-10 h-10 rounded-lg bg-brand-400 text-white flex items-center justify-center mb-3">
            <el-icon :size="20"><Collection /></el-icon>
          </div>
          <h3 class="font-display font-semibold text-navy-900 dark:text-white mb-1">题库练习</h3>
          <p class="text-xs text-navy-500 dark:text-navy-400">{{ questionStore.allQuestions.length }} 道精选面试题</p>
        </div>
        <div
          class="group p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-100 dark:border-amber-900/30 cursor-pointer card-hover"
          @click="router.push('/interview')"
        >
          <div class="w-10 h-10 rounded-lg bg-amber-400 text-white flex items-center justify-center mb-3">
            <el-icon :size="20"><ChatLineSquare /></el-icon>
          </div>
          <h3 class="font-display font-semibold text-navy-900 dark:text-white mb-1">模拟面试</h3>
          <p class="text-xs text-navy-500 dark:text-navy-400">定制化面试场景训练</p>
        </div>
        <div
          class="group p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-100 dark:border-blue-900/30 cursor-pointer card-hover"
          @click="router.push('/records')"
        >
          <div class="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-3">
            <el-icon :size="20"><DataLine /></el-icon>
          </div>
          <h3 class="font-display font-semibold text-navy-900 dark:text-white mb-1">学习记录</h3>
          <p class="text-xs text-navy-500 dark:text-navy-400">追踪进度与薄弱环节</p>
        </div>
      </div>
    </section>
  </div>
</template>
