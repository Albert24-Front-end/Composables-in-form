<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'
import { useDraftState } from './composables/useDraftState';
import { useValidations, validationRules } from './composables/useValidations'
import { useFormState } from './composables/useFormState';
import FormField from './components/FormField.vue';
// import { useRouter } from 'vue-router'

// const router = useRouter()

const { state: form, reset: resetForm } = useDraftState('signup: draft', {
  email: '',
  password: '',
  agree: false,
})

const { state: formState, handlers, markAllBlurred, resetAll } = useFormState(form.value)

const { errors, isChecking, isValid, validateAll } = useValidations(form.value, {
  email: [validationRules.email('Invalid email'), validationRules.checkEmailTaken(25, 'Your email is too long or already taken')],
  password: [validationRules.minLength(8, 'min length: 8 symbols')],
  agree: [validationRules.required('Your consent is necessary')],
})

const loading = ref(false)
// const toast = (msg: string) => alert(msg) // псевдо-тост

async function submit() {
  markAllBlurred()
  await validateAll()
  if (!isValid.value) return

  loading.value = true
  try {
    await new Promise((r) => setTimeout(r, 400)) // имитация API
    toast.success('Account created')
    // router.push('/done')

    resetForm() // 1. Сбрасываем значения полей (и обновляем LocalStorage)
    resetAll() // 2. Сбрасываем флаги blurred/touched, чтобы UI не показал ошибки пустых полей
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <FormField label="Email" :error="errors.email" :blurred="formState.email.blurred">
      <input v-model="form.email" v-on="handlers.email" />
    </FormField>
    <FormField label="Password" :error="errors.password" :blurred="formState.password.blurred">
      <input type="password" v-model="form.password" v-on="handlers.password" />
    </FormField>
    <FormField label="" :error="errors.agree" :blurred="formState.agree.blurred">
      <input type="checkbox" v-model="form.agree" v-on="handlers.agree" /> I agree
    </FormField>
    <button :disabled="loading || isChecking">{{ isChecking ? 'Checking...' : 'Create account' }}</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 340px;
  width: 100%;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  font-family: system-ui, sans-serif;
}



button {
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  background: #0074f0;
  color: white;
  cursor: pointer;
}
</style>
