<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '@/stores/questions'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const store = useQuestionStore()

const keyword = ref('')
const selectedCategory = ref('')
const selectedDifficulty = ref('')
const currentPage = ref(1)
const pageSize = 12

const categories = ['全部', '前端', '后端', '算法', '系统设计', '行为面试']
const difficulties = ['全部', '简单', '中等', '困难']

onMounted(() => {
  store.fetchQuestions()
})

const filtered = computed(() => {
  let list = store.allQuestions
  if (selectedCategory.value && selectedCategory.value !== '全部') {
    list = list.filter((q) => q.category === selectedCategory.value)
  }
  if (selectedDifficulty.value && selectedDifficulty.value !== '全部') {
    list = list.filter((q) => q.difficulty === selectedDifficulty.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.toLowerCase()
    list = list.filter((q) => q.title.toLowerCase().includes(kw) || q.description.toLowerCase().includes(kw))
  }
  return list
})

const paged = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

watch([selectedCategory, selectedDifficulty, keyword], () => {
  currentPage.value = 1
})

const difficultyColor = (d) => {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[d] || 'info'
}

function getCompletionStatus(id) {
  const records = JSON.parse(localStorage.getItem('questionRecords') || '[]')
  return records.some((r) => r.questionId === id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">题库</h1>
        <p class="text-sm text-navy-500 dark:text-navy-400 mt-1">共 {{ filtered.length }} 道题目</p>
      </div>
      <el-input
        v-model="keyword"
        placeholder="搜索题目..."
        :prefix-icon="Search"
        clearable
        class="!w-64"
      />
    </div>

    <div class="flex flex-wrap gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-navy-500 dark:text-navy-400">分类:</span>
        <el-radio-group v-model="selectedCategory" size="small">
          <el-radio-button v-for="c in categories" :key="c" :value="c">{{ c }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-navy-500 dark:text-navy-400">难度:</span>
        <el-radio-group v-model="selectedDifficulty" size="small">
          <el-radio-button v-for="d in difficulties" :key="d" :value="d">{{ d }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="q in paged"
        :key="q.id"
        class="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-100 dark:border-navy-700 card-hover cursor-pointer group"
        @click="router.push(`/questions/${q.id}`)"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <el-tag size="small" :type="difficultyColor(q.difficulty)" effect="plain" round>{{ q.difficulty }}</el-tag>
            <el-tag size="small" effect="plain" round>{{ q.category }}</el-tag>
          </div>
          <div v-if="getCompletionStatus(q.id)" class="w-5 h-5 rounded-full bg-brand-400 flex items-center justify-center">
            <span class="text-white text-xs">✓</span>
          </div>
        </div>
        <h3 class="font-medium text-navy-900 dark:text-white text-sm leading-snug mb-2 group-hover:text-brand-500 transition-colors">{{ q.title }}</h3>
        <p class="text-xs text-navy-400 dark:text-navy-500 line-clamp-2">{{ q.description }}</p>
      </div>
    </div>

    <div v-if="paged.length === 0" class="text-center py-16 text-navy-400 dark:text-navy-500">
      <p class="text-lg mb-2">暂无匹配题目</p>
      <p class="text-sm">请调整筛选条件</p>
    </div>

    <div v-if="filtered.length > pageSize" class="flex justify-center pt-4">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filtered.length"
        layout="prev, pager, next"
        background
      />
    </div>
  </div>
</template>
