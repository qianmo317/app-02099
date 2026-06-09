<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useWrongQuestionStore } from '@/stores/wrongQuestions'
import { formatDate } from '@/utils/date'

const router = useRouter()
const store = useWrongQuestionStore()

const activeCategory = ref('全部')
const showMastered = ref(true)
const expandedIds = ref(new Set())

onMounted(() => {
  store.init()
})

const allCategories = computed(() => {
  const cats = Object.keys(store.groupedByCategory)
  return ['全部', ...cats]
})

const filteredItems = computed(() => {
  let list = store.items
  if (activeCategory.value !== '全部') {
    list = list.filter((i) => (i.category || '未分类') === activeCategory.value)
  }
  if (!showMastered.value) {
    list = list.filter((i) => !i.mastered)
  }
  return list
})

function toggleExpand(id) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

async function handleRemove(item) {
  try {
    await ElMessageBox.confirm(`确定从错题本中移除「${item.title}」吗？`, '移除错题', {
      confirmButtonText: '确认移除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    store.remove(item.id)
    ElMessage.success('已移除')
  } catch {
    /* cancelled */
  }
}

function handleMastered(item) {
  store.toggleMastered(item.id)
  ElMessage.success(item.mastered ? '已取消标记' : '已标记为掌握')
}

async function handleClearAll() {
  if (store.items.length === 0) return
  try {
    await ElMessageBox.confirm('确定要清空整个错题本吗？此操作不可恢复。', '清空错题本', {
      confirmButtonText: '确认清空',
      cancelButtonText: '取消',
      type: 'warning'
    })
    store.clearAll()
    ElMessage.success('错题本已清空')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">错题本</h1>
      <el-button v-if="store.items.length > 0" size="small" type="danger" text @click="handleClearAll">清空错题本</el-button>
    </div>

    <!-- 总览统计卡片 -->
    <div class="grid sm:grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="text-xs text-navy-400 mb-1">错题总数</div>
        <div class="text-2xl font-display font-bold text-navy-900 dark:text-white">{{ store.totalCount }}</div>
      </div>
      <div class="stat-card">
        <div class="text-xs text-navy-400 mb-1">待掌握</div>
        <div class="text-2xl font-display font-bold text-rose-400">{{ store.pendingCount }}</div>
      </div>
      <div class="stat-card">
        <div class="text-xs text-navy-400 mb-1">已掌握</div>
        <div class="text-2xl font-display font-bold text-brand-400">{{ store.masteredCount }}</div>
      </div>
    </div>

    <!-- 分类统计 -->
    <div v-if="store.categoryStats.length > 0" class="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-100 dark:border-navy-700">
      <h2 class="section-title mb-4">按知识点分布</h2>
      <div class="space-y-3">
        <div v-for="cs in store.categoryStats" :key="cs.category" class="flex items-center gap-4">
          <span class="text-sm text-navy-600 dark:text-navy-300 w-24 text-right">{{ cs.category }}</span>
          <el-progress
            :percentage="cs.total === 0 ? 0 : Math.round((cs.mastered / cs.total) * 100)"
            :stroke-width="8"
            :show-text="false"
            class="flex-1"
          />
          <span class="text-sm text-navy-500 w-32">已掌握 {{ cs.mastered }}/{{ cs.total }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选 -->
    <div v-if="store.items.length > 0" class="bg-white dark:bg-navy-900 rounded-2xl p-4 border border-slate-100 dark:border-navy-700 flex flex-wrap items-center gap-3">
      <span class="text-sm text-navy-500">分类：</span>
      <el-tag
        v-for="cat in allCategories"
        :key="cat"
        :effect="activeCategory === cat ? 'dark' : 'plain'"
        round
        class="cursor-pointer"
        @click="activeCategory = cat"
      >{{ cat }}</el-tag>
      <div class="flex-1" />
      <el-checkbox v-model="showMastered">显示已掌握</el-checkbox>
    </div>

    <!-- 空状态 -->
    <div v-if="store.items.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">错题本暂时是空的</p>
      <p class="text-sm">完成一次模拟面试后，系统会自动收录答错或未作答的题目</p>
      <el-button type="primary" class="mt-4" @click="router.push('/interview')">去开始面试</el-button>
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-12 text-navy-400">
      <p class="text-sm">当前筛选条件下没有错题</p>
    </div>

    <!-- 错题列表 -->
    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="bg-white dark:bg-navy-900 rounded-xl border border-slate-100 dark:border-navy-700 overflow-hidden"
      :class="item.mastered ? 'opacity-70' : ''"
    >
      <div
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
        @click="toggleExpand(item.id)"
      >
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div class="flex flex-col gap-1 mt-0.5">
            <el-tag size="small" effect="plain" round>{{ item.category }}</el-tag>
            <el-tag v-if="item.mastered" size="small" type="success" effect="plain" round>已掌握</el-tag>
          </div>
          <div class="flex-1 min-w-0">
            <h3
              class="text-sm font-medium text-navy-900 dark:text-white"
              :class="item.mastered ? 'line-through text-navy-400' : ''"
            >{{ item.title }}</h3>
            <p class="text-xs text-navy-400 mt-1">收录于 {{ formatDate(item.createdAt) }}<span v-if="item.sessionType"> · {{ item.sessionType }}</span></p>
          </div>
        </div>
        <el-icon class="transition-transform text-navy-400 ml-2" :class="expandedIds.has(item.id) ? 'rotate-180' : ''">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
        </el-icon>
      </div>

      <el-collapse-transition>
        <div v-show="expandedIds.has(item.id)" class="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-navy-700 pt-3">
          <div>
            <h4 class="text-xs font-medium text-navy-500 mb-1">你的回答</h4>
            <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-slate-50 dark:bg-navy-800 p-3 rounded-lg">{{ item.userAnswer || '（未作答）' }}</p>
          </div>
          <div>
            <h4 class="text-xs font-medium text-navy-500 mb-1">参考答案</h4>
            <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-brand-50 dark:bg-brand-950/10 p-3 rounded-lg">{{ item.referenceAnswer }}</p>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <el-button size="small" :type="item.mastered ? 'info' : 'success'" @click.stop="handleMastered(item)">
              {{ item.mastered ? '取消掌握' : '标记已掌握' }}
            </el-button>
            <el-button size="small" type="danger" text @click.stop="handleRemove(item)">移除</el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
