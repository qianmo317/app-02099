<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './AppHeader.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AuthDialog from '@/components/common/AuthDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

function handleLogin() {
  authStore.showLoginDialog = true
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 transition-colors">
    <AppHeader
      @login="handleLogin"
      @logout="handleLogout"
    />
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AppBreadcrumb class="mb-5" />
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="text-center py-6 text-sm text-navy-400 dark:text-navy-500 border-t border-slate-100 dark:border-navy-800">
      © 2026 InterviewBoost · 面试提升平台
    </footer>
    <AuthDialog v-model="authStore.showLoginDialog" />
  </div>
</template>
