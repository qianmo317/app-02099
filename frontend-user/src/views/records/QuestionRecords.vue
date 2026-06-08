<script setup>
import { computed, onMounted } from 'vue'
import { useRecordStore } from '@/stores/records'
import { formatDate } from '@/utils/date'

const store = useRecordStore()

onMounted(() => {
  store.fetchQuestionRecords()
})

const grouped = computed(() => {
  const records = store.questionRecords
  const groups = {}
  records.forEach((r) => {
    const day = r.date.split(' ')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(r)
  })
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }))
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">刷题记录</h1>

    <div v-if="grouped.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">暂无刷题记录</p>
      <p class="text-sm">去题库开始练习吧</p>
    </div>

    <div v-for="group in grouped" :key="group.date" class="space-y-3">
      <h3 class="text-sm font-medium text-navy-500 dark:text-navy-400 sticky top-16 bg-slate-50 dark:bg-navy-950 py-2 z-10">
        {{ group.date }}
        <span class="text-navy-300 dark:text-navy-600 ml-2">{{ group.items.length }} 题</span>
      </h3>
      <div class="space-y-2">
        <div
          v-for="item in group.items"
          :key="item.id"
          class="bg-white dark:bg-navy-900 rounded-xl p-4 border border-slate-100 dark:border-navy-700 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-2 h-2 rounded-full"
              :class="item.correct ? 'bg-brand-400' : 'bg-rose-400'"
            />
            <span class="text-sm text-navy-900 dark:text-white">{{ item.questionTitle }}</span>
          </div>
          <span class="text-xs text-navy-400">{{ item.date.split(' ')[1] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
