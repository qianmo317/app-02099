<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoriteStore } from '@/stores/favorites'
import { useQuestionStore } from '@/stores/questions'
import { ElMessage } from 'element-plus'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const questionStore = useQuestionStore()

onMounted(async () => {
  await questionStore.fetchQuestions()
})

const favoriteQuestions = computed(() => {
  const ids = favoriteStore.favoriteIds
  return questionStore.allQuestions.filter((q) => ids.includes(q.id))
})

const difficultyColor = (d) => {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[d] || 'info'
}

function removeFavorite(id) {
  favoriteStore.toggle(id)
  ElMessage.success('已取消收藏')
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">收藏夹</h1>
      <span class="text-sm text-navy-400">{{ favoriteQuestions.length }} 道题</span>
    </div>

    <div v-if="favoriteQuestions.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">收藏夹为空</p>
      <p class="text-sm">在题目详情页点击星标收藏</p>
    </div>

    <div
      v-for="q in favoriteQuestions"
      :key="q.id"
      class="bg-white dark:bg-navy-900 rounded-xl p-5 border border-slate-100 dark:border-navy-700 flex items-center justify-between group card-hover"
    >
      <div class="cursor-pointer flex-1" @click="router.push(`/questions/${q.id}`)">
        <div class="flex items-center gap-2 mb-1">
          <el-tag size="small" :type="difficultyColor(q.difficulty)" effect="plain" round>{{ q.difficulty }}</el-tag>
          <el-tag size="small" effect="plain" round>{{ q.category }}</el-tag>
        </div>
        <h3 class="text-sm font-medium text-navy-900 dark:text-white group-hover:text-brand-500 transition-colors">{{ q.title }}</h3>
      </div>
      <el-button size="small" type="danger" text @click.stop="removeFavorite(q.id)">取消收藏</el-button>
    </div>
  </div>
</template>
