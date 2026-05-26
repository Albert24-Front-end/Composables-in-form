<script setup lang="ts">
defineProps<{
    label: string,
    error?: string | null,
    blurred?: boolean
}>()
</script>

<template>
    <div >
        <label>{{ label }} <slot /></label>
        <span class="error" v-if="error && blurred">{{ error }}</span>
    </div>
</template>

<style scoped>
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
</style>