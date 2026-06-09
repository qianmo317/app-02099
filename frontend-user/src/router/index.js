import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', breadcrumb: '首页' }
  },
  {
    path: '/questions',
    name: 'QuestionList',
    component: () => import('@/views/questions/QuestionList.vue'),
    meta: { title: '题库', breadcrumb: '题库' }
  },
  {
    path: '/questions/:id',
    name: 'QuestionDetail',
    component: () => import('@/views/questions/QuestionDetail.vue'),
    meta: { title: '题目详情', breadcrumb: '题目详情', parent: 'QuestionList' }
  },
  {
    path: '/interview',
    name: 'InterviewConfig',
    component: () => import('@/views/interview/InterviewConfig.vue'),
    meta: { title: '模拟面试', breadcrumb: '模拟面试' }
  },
  {
    path: '/interview/session',
    name: 'InterviewSession',
    component: () => import('@/views/interview/InterviewSession.vue'),
    meta: { title: '面试进行中', breadcrumb: '面试进行中', parent: 'InterviewConfig' }
  },
  {
    path: '/interview/result/:id',
    name: 'InterviewResult',
    component: () => import('@/views/interview/InterviewResult.vue'),
    meta: { title: '面试结果', breadcrumb: '面试结果', parent: 'InterviewConfig' }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('@/views/records/RecordsOverview.vue'),
    meta: { title: '学习记录', breadcrumb: '学习记录' }
  },
  {
    path: '/records/questions',
    name: 'QuestionRecords',
    component: () => import('@/views/records/QuestionRecords.vue'),
    meta: { title: '刷题记录', breadcrumb: '刷题记录', parent: 'Records' }
  },
  {
    path: '/records/interviews',
    name: 'InterviewRecords',
    component: () => import('@/views/records/InterviewRecords.vue'),
    meta: { title: '面试记录', breadcrumb: '面试记录', parent: 'Records' }
  },
  {
    path: '/records/favorites',
    name: 'Favorites',
    component: () => import('@/views/records/Favorites.vue'),
    meta: { title: '收藏夹', breadcrumb: '收藏夹', parent: 'Records' }
  },
  {
    path: '/records/wrong-book',
    name: 'WrongBook',
    component: () => import('@/views/records/WrongBook.vue'),
    meta: { title: '错题本', breadcrumb: '错题本', parent: 'Records' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || '页面'} | 面试提升平台`
})

export default router
