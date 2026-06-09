<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWrongQuestionStore } from '@/stores/wrongQuestion'
import { formatDate } from '@/utils/date'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useWrongQuestionStore()

const selectedCategory = ref('全部')
const showMastered = ref(true)
const expandedIds = ref(new Set())

const filteredItems = computed(() => {
  let list = store.items
  if (selectedCategory.value !== '全部') {
    list = list.filter((i) => i.category === selectedCategory.value)
  }
  if (!showMastered.value) {
    list = list.filter((i) => !i.mastered)
  }
  return list
})

const filterCategories = computed(() => ['全部', ...store.categories])

function toggleExpand(id) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

function handleRemove(id) {
  store.remove(id)
  ElMessage.success('已从错题本移除')
}

function handleToggleMastered(id) {
  store.toggleMastered(id)
  const item = store.items.find((i) => i.id === id)
  if (item?.mastered) {
    ElMessage.success('已标记为掌握')
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold text-navy-900 dark:text-white">错题本</h1>
      <span class="text-sm text-navy-400">{{ store.unmasteredCount }} 道未掌握</span>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <el-select v-model="selectedCategory" size="default" style="width: 140px">
        <el-option v-for="cat in filterCategories" :key="cat" :label="cat" :value="cat" />
      </el-select>
      <el-checkbox v-model="showMastered">显示已掌握</el-checkbox>
    </div>

    <div v-if="store.items.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">错题本为空</p>
      <p class="text-sm">面试中答错或未答的题目会自动收录到这里</p>
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-16 text-navy-400">
      <p class="text-lg mb-2">没有匹配的错题</p>
      <p class="text-sm">试试调整筛选条件</p>
    </div>

    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="bg-white dark:bg-navy-900 rounded-xl border border-slate-100 dark:border-navy-700 overflow-hidden"
      :class="{ 'opacity-60': item.mastered }"
    >
      <div
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
        @click="toggleExpand(item.id)"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
            :class="item.mastered ? 'bg-brand-400 text-white' : 'bg-rose-400 text-white'"
          >
            <svg v-if="item.mastered" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            <span v-else>!</span>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <el-tag size="small" effect="plain" round>{{ item.category }}</el-tag>
              <el-tag v-if="item.mastered" size="small" type="success" effect="plain" round>已掌握</el-tag>
            </div>
            <h3 class="text-sm font-medium text-navy-900 dark:text-white truncate">{{ item.title }}</h3>
          </div>
        </div>
        <el-icon class="transition-transform shrink-0 ml-2" :class="expandedIds.has(item.id) ? 'rotate-180' : ''">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
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
          <div class="flex items-center justify-between pt-1">
            <span class="text-xs text-navy-400">收录于 {{ formatDate(item.addedAt) }}</span>
            <div class="flex items-center gap-2">
              <el-button size="small" :type="item.mastered ? 'warning' : 'success'" text @click.stop="handleToggleMastered(item.id)">
                {{ item.mastered ? '取消掌握' : '标记已掌握' }}
              </el-button>
              <el-button size="small" type="danger" text @click.stop="handleRemove(item.id)">移除</el-button>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
