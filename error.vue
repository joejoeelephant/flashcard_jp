<template>
    <div class="h-screen flex flex-col justify-center items-center gap-8 bg-white">
        <h1 class="text-8xl font-bold status-code">
            {{ error.statusCode }}
        </h1>
        <p class="text-slate-500 font-semibold text-3xl">{{ error.statusMessage }}</p>
        <button class="py-0.5 px-1 border-2 border-slate-500" @click="handleError">Home Page</button>
    </div>
</template>
  
<script setup lang="ts">
    // Define props to receive the error object
    const {error} = defineProps(['error'])
    // Define a method to clear the error and potentially redirect to a different route
    const handleError = () => clearError({ redirect: '/' });
</script>

<style lang="css" scoped>
    .status-code {
        text-shadow: 4px 4px  aqua;
    }
</style>
  