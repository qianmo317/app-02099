<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="text-8xl font-display font-extrabold text-brand-400/20 mb-4">404</div>
    <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white mb-2">页面未找到</h1>
    <p class="text-navy-500 dark:text-navy-400 mb-8">你访问的页面不存在或已被移除</p>
    <el-button type="primary" round @click="router.push('/')">返回首页</el-button>
  </div>
</template>
