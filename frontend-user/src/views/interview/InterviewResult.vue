<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interview'
import { useWrongQuestionStore } from '@/stores/wrongQuestion'
import { formatDate } from '@/utils/date'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useInterviewStore()
const wrongStore = useWrongQuestionStore()

const result = ref(null)
const expandedIds = ref(new Set())

onMounted(() => {
  const id = Number(route.params.id)
  result.value = store.getResultById(id)
  if (!result.value) {
    router.replace('/interview')
  }
})

function toggleExpand(idx) {
  if (expandedIds.value.has(idx)) {
    expandedIds.value.delete(idx)
  } else {
    expandedIds.value.add(idx)
  }
}

const score = computed(() => {
  if (!result.value) return 0
  const answered = result.value.answers.filter((a) => a.userAnswer.trim().length > 0)
  return Math.round((answered.length / result.value.answers.length) * 100)
})

const categoryStats = computed(() => {
  if (!result.value) return []
  const map = {}
  result.value.answers.forEach((a) => {
    if (!map[a.category]) map[a.category] = { total: 0, answered: 0 }
    map[a.category].total++
    if (a.userAnswer.trim()) map[a.category].answered++
  })
  return Object.entries(map).map(([cat, s]) => ({
    category: cat,
    rate: Math.round((s.answered / s.total) * 100),
    total: s.total,
    answered: s.answered
  }))
})

const scoreColor = computed(() => {
  if (score.value >= 80) return 'text-brand-400'
  if (score.value >= 50) return 'text-amber-500'
  return 'text-rose-400'
})

function addToWrongBook(a) {
  const added = wrongStore.addSingle({
    title: a.title,
    category: a.category,
    userAnswer: a.userAnswer,
    referenceAnswer: a.referenceAnswer,
    sourceInterviewId: result.value?.id
  })
  if (added) {
    ElMessage.success('已加入错题本')
  } else {
    ElMessage.info('该题已在错题本中')
  }
}
</script>

<template>
  <div v-if="result" class="max-w-4xl mx-auto space-y-6">
    <div class="text-center bg-white dark:bg-navy-900 rounded-2xl p-8 border border-slate-100 dark:border-navy-700">
      <div class="font-display text-5xl font-extrabold mb-2" :class="scoreColor">{{ score }}%</div>
      <p class="text-navy-500 dark:text-navy-400 mb-1">完成度评分</p>
      <p class="text-xs text-navy-400">{{ formatDate(result.createdAt) }}</p>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h2 class="font-display font-semibold text-navy-900 dark:text-white mb-4">分类统计</h2>
      <div class="space-y-3">
        <div v-for="cs in categoryStats" :key="cs.category" class="flex items-center gap-4">
          <span class="text-sm text-navy-600 dark:text-navy-300 w-20 text-right">{{ cs.category }}</span>
          <el-progress :percentage="cs.rate" :stroke-width="8" :show-text="false" class="flex-1" />
          <span class="text-sm text-navy-500 w-24">{{ cs.answered }}/{{ cs.total }} ({{ cs.rate }}%)</span>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h2 class="font-display font-semibold text-navy-900 dark:text-white mb-4">题目回顾</h2>
      <div class="space-y-3">
        <div
          v-for="(a, idx) in result.answers"
          :key="idx"
          class="border border-slate-100 dark:border-navy-700 rounded-xl overflow-hidden"
        >
          <div
            class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
            @click="toggleExpand(idx)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                :class="a.userAnswer.trim() ? 'bg-brand-400' : 'bg-slate-300 dark:bg-navy-600'"
              >{{ idx + 1 }}</div>
              <span class="text-sm font-medium text-navy-900 dark:text-white">{{ a.title }}</span>
            </div>
            <div class="flex items-center gap-2">
              <el-button
                v-if="!wrongStore.isInWrongBook(a.title)"
                size="small"
                type="warning"
                text
                @click.stop="addToWrongBook(a)"
              >加入错题本</el-button>
              <el-tag v-else size="small" type="info" effect="plain" round>已收录</el-tag>
              <el-icon class="transition-transform" :class="expandedIds.has(idx) ? 'rotate-180' : ''">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
              </el-icon>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="expandedIds.has(idx)" class="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-navy-700 pt-3">
              <div>
                <h4 class="text-xs font-medium text-navy-500 mb-1">你的回答</h4>
                <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-slate-50 dark:bg-navy-800 p-3 rounded-lg">{{ a.userAnswer || '（未作答）' }}</p>
              </div>
              <div>
                <h4 class="text-xs font-medium text-navy-500 mb-1">参考答案</h4>
                <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-brand-50 dark:bg-brand-950/10 p-3 rounded-lg">{{ a.referenceAnswer }}</p>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4 pt-4">
      <el-button @click="router.push('/records/interviews')">查看历史记录</el-button>
      <el-button type="primary" @click="router.push('/interview')">再来一次</el-button>
    </div>
  </div>
</template>
