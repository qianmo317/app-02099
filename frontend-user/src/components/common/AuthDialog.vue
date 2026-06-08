<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { User, Message, Lock } from '@element-plus/icons-vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const authStore = useAuthStore()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const isLogin = ref(true)
const form = ref({ name: '', email: '', password: '' })
const loading = ref(false)

async function handleSubmit() {
  if (!form.value.email || !form.value.password) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (!isLogin.value && !form.value.name) {
    ElMessage.warning('请输入用户名')
    return
  }
  loading.value = true
  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password)
      ElMessage.success('登录成功')
    } else {
      await authStore.register(form.value.name, form.value.email, form.value.password)
      ElMessage.success('注册成功')
    }
    visible.value = false
    form.value = { name: '', email: '', password: '' }
  } catch {
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isLogin ? '欢迎回来' : '创建账号'"
    width="400px"
    :close-on-click-modal="false"
    class="auth-dialog"
  >
    <div class="space-y-3">
      <el-input
        v-if="!isLogin"
        v-model="form.name"
        placeholder="用户名"
        size="large"
        :prefix-icon="User"
      />
      <el-input
        v-model="form.email"
        placeholder="邮箱"
        size="large"
        :prefix-icon="Message"
      />
      <el-input
        v-model="form.password"
        type="password"
        placeholder="密码"
        size="large"
        :prefix-icon="Lock"
        show-password
        @keyup.enter="handleSubmit"
      />
    </div>
    <template #footer>
      <div class="flex flex-col gap-3">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="w-full"
          @click="handleSubmit"
        >
          {{ isLogin ? '登录' : '注册' }}
        </el-button>
        <div class="text-center text-sm text-navy-500">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <el-link type="primary" :underline="false" @click="isLogin = !isLogin">
            {{ isLogin ? '立即注册' : '去登录' }}
          </el-link>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
