<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  House, Collection, ChatLineSquare, DataLine,
  Sunny, Moon, User, SwitchButton
} from '@element-plus/icons-vue'

const emit = defineEmits(['login', 'logout'])
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isDark = ref(false)

const navItems = [
  { path: '/', label: '首页', icon: House },
  { path: '/questions', label: '题库', icon: Collection },
  { path: '/interview', label: '模拟面试', icon: ChatLineSquare },
  { path: '/records', label: '学习记录', icon: DataLine }
]

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
})

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-navy-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-navy-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-10">
          <router-link to="/" class="flex items-center gap-2.5 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-sm group-hover:shadow-md transition-shadow">
              B
            </div>
            <span class="font-display font-bold text-lg text-navy-900 dark:text-white hidden sm:block">
              InterviewBoost
            </span>
          </router-link>
          <nav class="hidden md:flex items-center gap-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
              :class="isActive(item.path)
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-950/30'
                : 'text-navy-500 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-navy-800'"
            >
              <el-icon :size="16"><component :is="item.icon" /></el-icon>
              {{ item.label }}
            </router-link>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <el-button :icon="isDark ? Sunny : Moon" circle size="small" @click="toggleDark" />
          <template v-if="authStore.isLoggedIn">
            <el-dropdown trigger="click">
              <div class="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors">
                <el-avatar :size="32" class="bg-brand-400 text-white">
                  {{ authStore.user?.name?.charAt(0) || 'U' }}
                </el-avatar>
                <span class="text-sm font-medium text-navy-700 dark:text-navy-200 hidden sm:block">{{ authStore.user?.name }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="emit('logout')">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <el-button v-else type="primary" size="small" round @click="emit('login')">
            <el-icon class="mr-1"><User /></el-icon>
            登录
          </el-button>
        </div>
      </div>
    </div>
  </header>
</template>
