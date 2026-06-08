<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interview'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const interviewStore = useInterviewStore()
const authStore = useAuthStore()

const config = ref({
  type: '技术面试',
  difficulty: '中等',
  count: 10,
  timed: true
})

const types = ['技术面试', '行为面试', '综合面试']
const difficulties = ['简单', '中等', '困难']
const counts = [5, 10, 15, 20]

function startInterview() {
  if (!authStore.requireLogin()) {
    ElMessage.warning('请先登录再开始模拟面试')
    return
  }
  interviewStore.createSession(config.value)
  ElMessage.success('面试即将开始，准备好了吗？')
  router.push('/interview/session')
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="text-center mb-8">
      <h1 class="font-display text-3xl font-bold text-navy-900 dark:text-white mb-2">模拟面试</h1>
      <p class="text-navy-500 dark:text-navy-400">配置你的面试参数，开始一场高仿真训练</p>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 border border-slate-100 dark:border-navy-700 space-y-8">
      <div>
        <label class="block font-display font-semibold text-navy-900 dark:text-white mb-3">面试类型</label>
        <el-radio-group v-model="config.type" size="large">
          <el-radio-button v-for="t in types" :key="t" :value="t">{{ t }}</el-radio-button>
        </el-radio-group>
      </div>

      <div>
        <label class="block font-display font-semibold text-navy-900 dark:text-white mb-3">难度级别</label>
        <el-radio-group v-model="config.difficulty" size="large">
          <el-radio-button v-for="d in difficulties" :key="d" :value="d">{{ d }}</el-radio-button>
        </el-radio-group>
      </div>

      <div>
        <label class="block font-display font-semibold text-navy-900 dark:text-white mb-3">题目数量</label>
        <el-radio-group v-model="config.count" size="large">
          <el-radio-button v-for="c in counts" :key="c" :value="c">{{ c }} 题</el-radio-button>
        </el-radio-group>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <label class="block font-display font-semibold text-navy-900 dark:text-white">开启计时</label>
          <p class="text-xs text-navy-400 mt-1">每题限时 3 分钟</p>
        </div>
        <el-switch v-model="config.timed" active-color="#42c793" />
      </div>
    </div>

    <div class="flex justify-center pt-4">
      <el-button type="primary" size="large" round class="!px-12" @click="startInterview">
        开始面试
      </el-button>
    </div>
  </div>
</template>
