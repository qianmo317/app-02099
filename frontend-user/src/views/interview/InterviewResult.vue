<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interview'
import { useMistakeStore } from '@/stores/mistakes'
import { formatDate } from '@/utils/date'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useInterviewStore()
const mistakeStore = useMistakeStore()

const result = ref(null)
const expandedIds = ref(new Set())
const manualSelected = ref(new Set())
const mistakesAdded = ref(false)

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

function isUnanswered(a) {
  return !a.userAnswer || a.userAnswer.trim().length === 0
}

function toggleManual(idx) {
  if (manualSelected.value.has(idx)) {
    manualSelected.value.delete(idx)
  } else {
    manualSelected.value.add(idx)
  }
}

function toggleSelectAllAnswered() {
  const answeredIndices = result.value.answers
    .map((a, i) => ({ a, i }))
    .filter(({ a }) => !isUnanswered(a))
    .map(({ i }) => i)
  const allSelected = answeredIndices.every((i) => manualSelected.value.has(i))
  if (allSelected) {
    answeredIndices.forEach((i) => manualSelected.value.delete(i))
  } else {
    answeredIndices.forEach((i) => manualSelected.value.add(i))
  }
}

function addToMistakes() {
  const items = result.value.answers.filter((_, idx) => manualSelected.value.has(idx))
  if (items.length === 0) {
    ElMessage.warning('请先勾选答错的题目')
    return
  }
  const added = mistakeStore.addMistakes(items)
  mistakesAdded.value = true
  if (added > 0) {
    ElMessage.success(`已将 ${added} 道错题加入错题本`)
  } else {
    ElMessage.info('选中的题目已在错题本中')
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

const unansweredCount = computed(() =>
  result.value ? result.value.answers.filter(isUnanswered).length : 0
)

const allAnsweredSelected = computed(() => {
  if (!result.value) return false
  const answeredIndices = result.value.answers
    .map((a, i) => i)
    .filter((i) => !isUnanswered(result.value.answers[i]))
  return answeredIndices.length > 0 && answeredIndices.every((i) => manualSelected.value.has(i))
})
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

    <div v-if="unansweredCount > 0" class="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex items-center gap-3">
      <el-icon :size="20" class="text-rose-500 flex-shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
      </el-icon>
      <div class="text-sm text-rose-700 dark:text-rose-300">
        {{ unansweredCount }} 道题未作答，已自动收录到错题本
      </div>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display font-semibold text-navy-900 dark:text-white">题目回顾</h2>
        <div class="flex items-center gap-3">
          <el-checkbox :model-value="allAnsweredSelected" @change="toggleSelectAllAnswered">全选已答</el-checkbox>
          <span class="text-sm text-navy-400">勾选答错 {{ manualSelected.size }} 题</span>
          <el-button
            type="danger"
            size="small"
            :disabled="mistakesAdded || manualSelected.size === 0"
            @click="addToMistakes"
          >
            {{ mistakesAdded ? '已加入错题本' : '加入错题本' }}
          </el-button>
        </div>
      </div>
      <div class="space-y-3">
        <div
          v-for="(a, idx) in result.answers"
          :key="idx"
          class="border rounded-xl overflow-hidden transition-colors"
          :class="isUnanswered(a)
            ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/5'
            : manualSelected.has(idx)
              ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/5'
              : 'border-slate-100 dark:border-navy-700'"
        >
          <div
            class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0" @click="toggleExpand(idx)">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                :class="isUnanswered(a) ? 'bg-rose-400' : 'bg-brand-400'"
              >{{ idx + 1 }}</div>
              <span class="text-sm font-medium text-navy-900 dark:text-white truncate">{{ a.title }}</span>
              <el-tag v-if="isUnanswered(a)" size="small" type="danger" effect="plain" round>未作答·已收录</el-tag>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0 ml-2">
              <el-checkbox
                v-if="!isUnanswered(a)"
                :model-value="manualSelected.has(idx)"
                @change="toggleManual(idx)"
                @click.stop
                title="这道题答错了"
              />
              <el-tag v-else size="small" type="info" effect="plain">自动收录</el-tag>
              <el-icon class="transition-transform" :class="expandedIds.has(idx) ? 'rotate-180' : ''" @click="toggleExpand(idx)">
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
      <el-button @click="router.push('/records/mistakes')">查看错题本</el-button>
      <el-button type="primary" @click="router.push('/interview')">再来一次</el-button>
    </div>
  </div>
</template>
