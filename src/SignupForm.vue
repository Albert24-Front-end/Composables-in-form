<script setup lang="ts">
import { reactive, watchEffect, watch, ref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  agree: false,
})

const errors = reactive<{ email: string | null; password: string | null; agree: string | null }>({
  email: null,
  password: null,
  agree: null,
})

const loading = ref(false)
const toast = (msg: string) => alert(msg) // псевдо-тост

onMounted(() => {
  try {
    const raw = localStorage.getItem('signup:draft')
    if (!raw) return
    const data = JSON.parse(raw)
    Object.assign(form, data)
  } catch {
    /* ignore */
  }
})

watchEffect(() => {
  errors.email = /.+@.+/.test(form.email) ? null : 'Invalid email'
  errors.password = form.password.length >= 8 ? null : 'min length: 8'
  errors.agree = form.agree ? null : 'You must agree'
})

watch(
  form,
  () => {
    localStorage.setItem('signup:draft', JSON.stringify(form))
  },
  { deep: true },
)

async function submit() {
  if (errors.email || errors.password || errors.agree) return
  loading.value = true
  try {
    await new Promise((r) => setTimeout(r, 400)) // имитация API
    toast('Account created')
    // router.push('/done')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <label>Email <input v-model="form.email" /></label>
    <span class="error" v-if="errors.email">{{ errors.email }}</span>

    <label>Password <input type="password" v-model="form.password" /></label>
    <span class="error" v-if="errors.password">{{ errors.password }}</span>

    <label><input type="checkbox" v-model="form.agree" /> I agree</label>
    <span class="error" v-if="errors.agree">{{ errors.agree }}</span>

    <button :disabled="loading">Create account</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 340px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  font-family: system-ui, sans-serif;
}

label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #333;
}

label:has(input[type='checkbox']) {
  flex-direction: row;
  align-items: center;
}

input[type='text'],
input[type='password'],
input[type='email'] {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.error {
  color: #d33;
  font-size: 12px;
  margin-top: -8px;
}

button {
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  background: #0074f0;
  color: white;
}
</style>
