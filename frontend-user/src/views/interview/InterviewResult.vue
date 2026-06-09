<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useInterviewStore } from '@/stores/interview'
import { useWrongQuestionStore } from '@/stores/wrongQuestions'
import { formatDate } from '@/utils/date'

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
  wrongStore.init()
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

const wrongAnswerCount = computed(() => {
  if (!result.value) return 0
  return result.value.answers.filter((a) => !a.userAnswer.trim() || a.correct === false).length
})

const unansweredCount = computed(() => {
  if (!result.value) return 0
  return result.value.answers.filter((a) => !a.userAnswer.trim()).length
})

const markedWrongCount = computed(() => {
  if (!result.value) return 0
  return result.value.answers.filter((a) => a.userAnswer.trim() && a.correct === false).length
})

function isUnanswered(answer) {
  return !(answer.userAnswer || '').trim()
}

function isInWrongBook(answer) {
  return wrongStore.isCollected(answer)
}

function handleMark(idx, correct) {
  if (!result.value) return
  store.markAnswerCorrect(result.value.id, idx, correct)
  // 触发响应式刷新
  result.value = store.getResultById(result.value.id)
  ElMessage.success(correct ? '已标记为答对' : '已标记为答错并加入错题本')
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

    <div
      v-if="wrongAnswerCount > 0"
      class="bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 flex items-center justify-between gap-4"
    >
      <div>
        <h3 class="font-display font-semibold text-amber-700 dark:text-amber-400 mb-1">本次共 {{ wrongAnswerCount }} 道题需要复习</h3>
        <p class="text-xs text-amber-600 dark:text-amber-500">
          其中未作答 {{ unansweredCount }} 道<span v-if="markedWrongCount > 0">，已标记答错 {{ markedWrongCount }} 道</span>。这些题目均已收录到错题本。
        </p>
      </div>
      <el-button type="warning" plain size="small" @click="router.push('/records/wrong')">查看错题本</el-button>
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
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                :class="
                  isUnanswered(a)
                    ? 'bg-slate-300 dark:bg-navy-600'
                    : a.correct === false
                      ? 'bg-rose-400'
                      : a.correct === true
                        ? 'bg-brand-400'
                        : 'bg-amber-400'
                "
              >{{ idx + 1 }}</div>
              <span class="text-sm font-medium text-navy-900 dark:text-white flex-1 min-w-0 truncate">{{ a.title }}</span>
              <el-tag v-if="isUnanswered(a)" size="small" type="info" effect="plain" round>未作答</el-tag>
              <el-tag v-else-if="a.correct === true" size="small" type="success" effect="plain" round>答对</el-tag>
              <el-tag v-else-if="a.correct === false" size="small" type="danger" effect="plain" round>答错</el-tag>
              <el-tag v-else size="small" type="warning" effect="plain" round>未标记</el-tag>
            </div>
            <el-icon class="transition-transform ml-2" :class="expandedIds.has(idx) ? 'rotate-180' : ''">
              <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
            </el-icon>
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
              <div class="flex items-center justify-between pt-1">
                <span class="text-xs text-navy-400">
                  <template v-if="isUnanswered(a)">未作答的题目已自动加入错题本</template>
                  <template v-else-if="isInWrongBook(a)">已收录到错题本</template>
                  <template v-else>对照参考答案，标记本题对错</template>
                </span>
                <div class="flex items-center gap-2">
                  <el-button
                    size="small"
                    :type="a.correct === true ? 'success' : 'default'"
                    :plain="a.correct !== true"
                    :disabled="isUnanswered(a)"
                    @click.stop="handleMark(idx, true)"
                  >标记答对</el-button>
                  <el-button
                    size="small"
                    :type="a.correct === false ? 'danger' : 'default'"
                    :plain="a.correct !== false"
                    :disabled="isUnanswered(a)"
                    @click.stop="handleMark(idx, false)"
                  >标记答错</el-button>
                </div>
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
