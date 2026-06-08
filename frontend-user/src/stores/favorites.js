import { defineStore } from 'pinia'
import { ref } from 'vue'
import logger from '@/utils/logger'

export const useFavoriteStore = defineStore('favorites', () => {
  const favoriteIds = ref([])

  function init() {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      try {
        favoriteIds.value = JSON.parse(saved)
      } catch {
        favoriteIds.value = []
      }
    }
  }

  function isFavorite(id) {
    return favoriteIds.value.includes(id)
  }

  function toggle(id) {
    const idx = favoriteIds.value.indexOf(id)
    if (idx >= 0) {
      favoriteIds.value.splice(idx, 1)
      logger.info('Removed from favorites:', id)
    } else {
      favoriteIds.value.push(id)
      logger.info('Added to favorites:', id)
    }
    localStorage.setItem('favorites', JSON.stringify(favoriteIds.value))
  }

  init()

  return { favoriteIds, isFavorite, toggle }
})
