<script setup>
import { ref, computed } from 'vue'
import { useWrongQuestionStore } from '@/stores/wrongQuestions'
import { ElMessage } from 'element-plus'
import { Check, Delete } from '@element-plus/icons-vue'

const wrongStore = useWrongQuestionStore()

const activeCategory = ref('全部')
const expandedTitles = ref(new Set())

const categories = computed(() => {
  const cats = ['全部', ...wrongStore.categoryStats.map((s) => s.category)]
  return cats
})

const filteredQuestions = computed(() => {
  return wrongStore.getByCategory(activeCategory.value)
})

const difficultyColor = (d) => {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[d] || 'info'
}

function toggleExpand(title) {
  if (expandedTitles.value.has(title)) {
    expandedTitles.value.delete(title)
  } else {
    expandedTitles.value.add(title)
  }
}

function handleRemove(title) {
  wrongStore.removeWrongQuestion(title)
  ElMessage.success('已移出错题本')
}

function handleMarkMastered(title) {
  wrongStore.markMastered(title)
  ElMessage.success('已标记为掌握')
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">错题本</h1>
      <div class="flex items-center gap-4 text-sm">
        <span class="text-navy-400">待复习：{{ wrongStore.totalCount }} 道</span>
        <span class="text-brand-500">已掌握：{{ wrongStore.masteredCount }} 道</span>
      </div>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-4 border border-slate-100 dark:border-navy-700">
      <div class="flex flex-wrap gap-2">
        <el-button
          v-for="cat in categories"
          :key="cat"
          size="small"
          :type="activeCategory === cat ? 'primary' : 'default'"
          @click="activeCategory = cat"
          round
        >
          {{ cat }}
          <span v-if="cat !== '全部'" class="ml-1 text-xs opacity-75">
            ({{ wrongStore.categoryStats.find((s) => s.category === cat)?.count || 0 }})
          </span>
          <span v-else class="ml-1 text-xs opacity-75">({{ wrongStore.totalCount }})</span>
        </el-button>
      </div>
    </div>

    <div v-if="filteredQuestions.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">暂无错题</p>
      <p class="text-sm">继续加油，争取都答对！</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="q in filteredQuestions"
        :key="q.title"
        class="bg-white dark:bg-navy-900 rounded-xl border border-slate-100 dark:border-navy-700 overflow-hidden card-hover"
      >
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
          @click="toggleExpand(q.title)"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <el-tag size="small" :type="difficultyColor(q.difficulty)" effect="plain" round>{{ q.difficulty }}</el-tag>
                <el-tag size="small" effect="plain" round>{{ q.category }}</el-tag>
                <span v-if="q.wrongCount > 1" class="text-xs text-rose-400">错 {{ q.wrongCount }} 次</span>
              </div>
              <h3 class="text-sm font-medium text-navy-900 dark:text-white truncate">{{ q.title }}</h3>
            </div>
          </div>
          <div class="flex items-center gap-2 ml-2">
            <el-button
              size="small"
              type="success"
              text
              @click.stop="handleMarkMastered(q.title)"
              :icon="Check"
            >
              已掌握
            </el-button>
            <el-button
              size="small"
              type="danger"
              text
              @click.stop="handleRemove(q.title)"
              :icon="Delete"
            >
              移除
            </el-button>
            <el-icon class="transition-transform text-navy-400" :class="expandedTitles.has(q.title) ? 'rotate-180' : ''">
              <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
            </el-icon>
          </div>
        </div>

        <el-collapse-transition>
          <div v-show="expandedTitles.has(q.title)" class="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-navy-700 pt-3">
            <div v-if="q.description">
              <h4 class="text-xs font-medium text-navy-500 mb-1">题目描述</h4>
              <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-slate-50 dark:bg-navy-800 p-3 rounded-lg">{{ q.description }}</p>
            </div>
            <div>
              <h4 class="text-xs font-medium text-navy-500 mb-1">你的回答</h4>
              <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg">{{ q.userAnswer || '（未作答）' }}</p>
            </div>
            <div>
              <h4 class="text-xs font-medium text-navy-500 mb-1">参考答案</h4>
              <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-brand-50 dark:bg-brand-950/10 p-3 rounded-lg">{{ q.referenceAnswer }}</p>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>
