<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interview'
import { formatDate } from '@/utils/date'

const router = useRouter()
const store = useInterviewStore()

onMounted(() => {
  store.loadResults()
})

const results = computed(() => store.allResults)

function getScore(result) {
  const answered = result.answers.filter((a) => a.userAnswer.trim().length > 0)
  return Math.round((answered.length / result.answers.length) * 100)
}

function scoreColor(s) {
  if (s >= 80) return 'text-brand-400'
  if (s >= 50) return 'text-amber-500'
  return 'text-rose-400'
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">面试记录</h1>

    <div v-if="results.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">暂无面试记录</p>
      <p class="text-sm">去开始一次模拟面试吧</p>
    </div>

    <div
      v-for="r in results"
      :key="r.id"
      class="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-100 dark:border-navy-700 card-hover cursor-pointer"
      @click="router.push(`/interview/result/${r.id}`)"
    >
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <el-tag size="small" effect="plain" round>{{ r.type }}</el-tag>
            <el-tag size="small" effect="plain" round>{{ r.difficulty }}</el-tag>
          </div>
          <p class="text-xs text-navy-400 mt-1">{{ formatDate(r.createdAt) }} · {{ r.answers.length }} 道题</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-display font-bold" :class="scoreColor(getScore(r))">{{ getScore(r) }}%</div>
          <div class="text-xs text-navy-400">完成度</div>
        </div>
      </div>
    </div>
  </div>
</template>
