<script setup lang="ts">
import SignupForm from './SignupForm.vue'
</script>

<template>
  <div class="container">
    <SignupForm />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 20px;
  background-color: #f4f7f9;
}
</style>
