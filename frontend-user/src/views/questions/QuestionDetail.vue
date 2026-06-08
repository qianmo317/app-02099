<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestionStore } from '@/stores/questions'
import { useFavoriteStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { Star, StarFilled, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const questionStore = useQuestionStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()

const showAnswer = ref(false)
const note = ref('')
const question = computed(() => questionStore.currentQuestion)

const isFavorited = computed(() => {
  if (!question.value) return false
  return favoriteStore.isFavorite(question.value.id)
})

onMounted(async () => {
  await questionStore.fetchQuestions()
  loadQuestion()
})

watch(() => route.params.id, () => {
  loadQuestion()
  showAnswer.value = false
})

function loadQuestion() {
  const id = Number(route.params.id)
  questionStore.setCurrentById(id)
  const saved = localStorage.getItem(`note_${id}`)
  note.value = saved || ''
}

function saveNote() {
  if (!authStore.requireLogin()) {
    ElMessage.warning('请先登录再记录笔记')
    return
  }
  const id = Number(route.params.id)
  localStorage.setItem(`note_${id}`, note.value)
  ElMessage.success('笔记已保存')
}

function toggleFavorite() {
  if (!question.value) return
  if (!authStore.requireLogin()) {
    ElMessage.warning('请先登录再收藏题目')
    return
  }
  favoriteStore.toggle(question.value.id)
  ElMessage.success(isFavorited.value ? '已收藏' : '已取消收藏')
}

const allIds = computed(() => questionStore.allQuestions.map((q) => q.id))
const currentIdx = computed(() => question.value ? allIds.value.indexOf(question.value.id) : -1)
const hasPrev = computed(() => currentIdx.value > 0)
const hasNext = computed(() => currentIdx.value < allIds.value.length - 1)

function goPrev() {
  if (hasPrev.value) router.push(`/questions/${allIds.value[currentIdx.value - 1]}`)
}
function goNext() {
  if (hasNext.value) router.push(`/questions/${allIds.value[currentIdx.value + 1]}`)
}

const difficultyColor = (d) => {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[d] || 'info'
}
</script>

<template>
  <div v-if="question" class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <el-tag :type="difficultyColor(question.difficulty)" effect="plain" round>{{ question.difficulty }}</el-tag>
        <el-tag effect="plain" round>{{ question.category }}</el-tag>
        <span class="text-sm text-navy-400 dark:text-navy-500">第 {{ currentIdx + 1 }} / {{ allIds.length }} 题</span>
      </div>
      <el-button
        :icon="isFavorited ? StarFilled : Star"
        :type="isFavorited ? 'warning' : 'default'"
        circle
        @click="toggleFavorite"
      />
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h1 class="font-display text-xl font-bold text-navy-900 dark:text-white mb-4">{{ question.title }}</h1>
      <p class="text-navy-600 dark:text-navy-300 leading-relaxed whitespace-pre-line">{{ question.description }}</p>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display font-semibold text-navy-900 dark:text-white">参考答案</h2>
        <el-button size="small" @click="showAnswer = !showAnswer">
          {{ showAnswer ? '收起' : '展开' }}
        </el-button>
      </div>
      <el-collapse-transition>
        <div v-show="showAnswer" class="text-navy-600 dark:text-navy-300 leading-relaxed whitespace-pre-line">
          {{ question.answer }}
        </div>
      </el-collapse-transition>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h2 class="font-display font-semibold text-navy-900 dark:text-white mb-4">答题笔记</h2>
      <el-input
        v-model="note"
        type="textarea"
        :rows="5"
        placeholder="记录你对这道题的思考..."
        resize="vertical"
      />
      <div class="mt-3 flex justify-end">
        <el-button type="primary" @click="saveNote">保存笔记</el-button>
      </div>
    </div>

    <div class="flex items-center justify-between pt-2">
      <el-button :icon="ArrowLeft" :disabled="!hasPrev" @click="goPrev">上一题</el-button>
      <el-button :disabled="!hasNext" @click="goNext">
        下一题
        <el-icon class="ml-1"><ArrowRight /></el-icon>
      </el-button>
    </div>
  </div>
  <div v-else class="text-center py-16 text-navy-400">题目加载中...</div>
</template>
