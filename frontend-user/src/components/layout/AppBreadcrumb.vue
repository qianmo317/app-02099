<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const crumbs = []
  let current = route

  function findRoute(name) {
    return router.getRoutes().find((r) => r.name === name)
  }

  const visited = new Set()
  let cursor = current
  while (cursor?.meta?.breadcrumb) {
    if (visited.has(cursor.name)) break
    visited.add(cursor.name)
    crumbs.unshift({
      label: cursor.meta.breadcrumb,
      path: cursor.path?.includes(':') ? null : cursor.path,
      name: cursor.name
    })
    if (cursor.meta.parent) {
      cursor = findRoute(cursor.meta.parent)
    } else {
      break
    }
  }

  if (crumbs.length > 0 && crumbs[0].name !== 'Home') {
    crumbs.unshift({ label: '首页', path: '/', name: 'Home' })
  }

  return crumbs
})
</script>

<template>
  <el-breadcrumb v-if="breadcrumbs.length > 1" separator="/">
    <el-breadcrumb-item
      v-for="(crumb, idx) in breadcrumbs"
      :key="crumb.name"
      :to="idx < breadcrumbs.length - 1 && crumb.path ? { path: crumb.path } : undefined"
    >
      {{ crumb.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
