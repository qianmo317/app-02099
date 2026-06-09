<script setup>
import { computed, ref } from 'vue'
import { useMistakeStore } from '@/stores/mistakes'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/date'
import { Check, Delete, View, Hide } from '@element-plus/icons-vue'

const mistakeStore = useMistakeStore()
const activeCategory = ref('all')
const showMastered = ref(false)
const expandedIds = ref(new Set())

const filteredMistakes = computed(() => {
  let list = [...mistakeStore.mistakes]

  if (activeCategory.value !== 'all') {
    list = list.filter((m) => m.category === activeCategory.value)
  }

  if (!showMastered.value) {
    list = list.filter((m) => !m.mastered)
  }

  return list
})

const allCategories = computed(() => ['all', ...mistakeStore.categories])

function toggleExpand(id) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

async function removeMistake(id) {
  try {
    await ElMessageBox.confirm('确定要移除这道错题吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    mistakeStore.remove(id)
    ElMessage.success('已移除')
  } catch {
    // cancelled
  }
}

function toggleMastered(id) {
  mistakeStore.toggleMastered(id)
  const item = mistakeStore.mistakes.find((m) => m.id === id)
  if (item?.mastered) {
    ElMessage.success('已标记为掌握')
  }
}

function getCategoryLabel(cat) {
  return cat === 'all' ? '全部' : cat
}

function getCountForCategory(cat) {
  if (cat === 'all') return mistakeStore.totalCount
  return mistakeStore.mistakes.filter((m) => m.category === cat).length
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">错题本</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-navy-400">
          共 {{ mistakeStore.totalCount }} 题 · 未掌握 {{ mistakeStore.unmasteredCount }} 题
        </span>
      </div>
    </div>

    <div class="bg-white dark:bg-navy-900 rounded-2xl p-4 border border-slate-100 dark:border-navy-700">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="activeCategory === cat
            ? 'bg-brand-500 text-white'
            : 'bg-slate-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 hover:bg-slate-200 dark:hover:bg-navy-700'"
          @click="activeCategory = cat"
        >
          {{ getCategoryLabel(cat) }}
          <span class="ml-1 opacity-70">({{ getCountForCategory(cat) }})</span>
        </button>
        <div class="ml-auto flex items-center gap-2">
          <el-switch v-model="showMastered" />
          <span class="text-sm text-navy-500">显示已掌握</span>
        </div>
      </div>
    </div>

    <div v-if="filteredMistakes.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">暂无错题</p>
      <p class="text-sm">面试中未作答的题目会自动收入这里</p>
    </div>

    <div
      v-for="item in filteredMistakes"
      :key="item.id"
      class="bg-white dark:bg-navy-900 rounded-2xl border overflow-hidden transition-colors"
      :class="item.mastered
        ? 'border-green-200 dark:border-green-900/50 opacity-70'
        : 'border-slate-100 dark:border-navy-700'"
    >
      <div
        class="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
        @click="toggleExpand(item.id)"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
            :class="item.mastered
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              : 'bg-rose-100 dark:bg-rose-900/30 text-rose-500'"
          >
            <el-icon v-if="item.mastered"><Check /></el-icon>
            <span v-else>!</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1">
              <el-tag size="small" effect="plain" round>{{ item.category }}</el-tag>
              <el-tag v-if="item.mastered" size="small" type="success" effect="plain" round>已掌握</el-tag>
              <span class="text-xs text-navy-400">{{ formatDate(item.createdAt) }}</span>
            </div>
            <h3 class="text-sm font-medium text-navy-900 dark:text-white truncate">{{ item.title }}</h3>
          </div>
        </div>
        <el-icon class="transition-transform flex-shrink-0 ml-2" :class="expandedIds.has(item.id) ? 'rotate-180' : ''">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
        </el-icon>
      </div>

      <el-collapse-transition>
        <div v-show="expandedIds.has(item.id)" class="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-navy-700 pt-4">
          <div v-if="item.userAnswer && item.userAnswer.trim()">
            <h4 class="text-xs font-medium text-navy-500 mb-1">你的回答</h4>
            <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-slate-50 dark:bg-navy-800 p-3 rounded-lg">{{ item.userAnswer }}</p>
          </div>
          <div v-else>
            <h4 class="text-xs font-medium text-navy-500 mb-1">作答状态</h4>
            <p class="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg">未作答</p>
          </div>
          <div>
            <h4 class="text-xs font-medium text-navy-500 mb-1">参考答案</h4>
            <p class="text-sm text-navy-700 dark:text-navy-300 whitespace-pre-line bg-brand-50 dark:bg-brand-950/10 p-3 rounded-lg">{{ item.referenceAnswer }}</p>
          </div>
          <div class="flex items-center gap-2 pt-2">
            <el-button
              size="small"
              :type="item.mastered ? 'default' : 'success'"
              @click.stop="toggleMastered(item.id)"
            >
              <el-icon class="mr-1"><Check /></el-icon>
              {{ item.mastered ? '取消掌握' : '标记已掌握' }}
            </el-button>
            <el-button size="small" type="danger" plain @click.stop="removeMistake(item.id)">
              <el-icon class="mr-1"><Delete /></el-icon>
              移除
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
