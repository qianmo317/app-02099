<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interview'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useInterviewStore()

const answer = ref('')
const timeLeft = ref(180)
let timer = null

const session = computed(() => store.currentSession)
const currentQ = computed(() => {
  if (!session.value) return null
  return session.value.questions[session.value.currentIndex]
})
const progress = computed(() => {
  if (!session.value) return 0
  return ((session.value.currentIndex + 1) / session.value.questions.length) * 100
})

onMounted(() => {
  if (!session.value) {
    ElMessage.warning('请先配置面试')
    router.replace('/interview')
    return
  }
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})

watch(() => session.value?.currentIndex, () => {
  answer.value = ''
  timeLeft.value = 180
  restartTimer()
})

function startTimer() {
  if (!session.value?.timed) return
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleNext()
    }
  }, 1000)
}

function restartTimer() {
  clearInterval(timer)
  startTimer()
}

const formattedTime = computed(() => {
  const min = Math.floor(timeLeft.value / 60)
  const sec = timeLeft.value % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
})

function handleNext() {
  store.submitAnswer(session.value.currentIndex, answer.value)
  if (session.value.currentIndex < session.value.questions.length - 1) {
    store.nextQuestion()
  } else {
    clearInterval(timer)
    const resultId = store.finishSession()
    router.push(`/interview/result/${resultId}`)
  }
}

function handleSkip() {
  store.submitAnswer(session.value.currentIndex, '')
  if (session.value.currentIndex < session.value.questions.length - 1) {
    store.nextQuestion()
  } else {
    clearInterval(timer)
    const resultId = store.finishSession()
    router.push(`/interview/result/${resultId}`)
  }
}

async function handleQuit() {
  try {
    await ElMessageBox.confirm('确定要退出面试吗？当前进度将丢失。', '退出面试', {
      confirmButtonText: '确认退出',
      cancelButtonText: '继续面试',
      type: 'warning'
    })
    clearInterval(timer)
    store.clearSession()
    router.push('/interview')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div v-if="session && currentQ" class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-navy-500 dark:text-navy-400">
          第 {{ session.currentIndex + 1 }} / {{ session.questions.length }} 题
        </span>
        <el-tag size="small" effect="plain" round>{{ currentQ.category }}</el-tag>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="session.timed" class="font-display font-bold text-lg" :class="timeLeft < 30 ? 'text-red-500' : 'text-navy-900 dark:text-white'">
          {{ formattedTime }}
        </div>
        <el-button size="small" type="danger" text @click="handleQuit">退出</el-button>
      </div>
    </div>

    <el-progress :percentage="progress" :stroke-width="6" :show-text="false" color="#42c793" class="!mb-2" />

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h2 class="font-display text-lg font-bold text-navy-900 dark:text-white mb-4">{{ currentQ.title }}</h2>
      <p class="text-navy-600 dark:text-navy-300 leading-relaxed whitespace-pre-line">{{ currentQ.description }}</p>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <label class="block font-display font-semibold text-navy-900 dark:text-white mb-3">你的回答</label>
      <el-input
        v-model="answer"
        type="textarea"
        :rows="8"
        placeholder="在此输入你的答案..."
        resize="vertical"
      />
    </div>

    <div class="flex items-center justify-between pt-2">
      <el-button @click="handleSkip">跳过</el-button>
      <el-button type="primary" size="large" @click="handleNext">
        {{ session.currentIndex < session.questions.length - 1 ? '下一题' : '完成面试' }}
      </el-button>
    </div>
  </div>
</template>
