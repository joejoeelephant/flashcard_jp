<template lang="">
    <div class="h-full bg-blue-100">
        <div class="h-[60px] bg-blue-300 flex justify-center items-center font-bold" >
            <NuxtLink to="/">
                Logo
            </NuxtLink>
        </div>
        <ul class="flex flex-col font-bold text-gray-700">
            <li v-for="(item, index) in links" :key="index" :class="`p-4 ${path === item.path ? 'bg-blue-200' : ''} `">
                <NuxtLink :to="item.path">
                    {{item.name}}
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
    const links = [
        {
            path: '/dashboard/cards',
            name: 'cards'
        },
        {
            path: '/dashboard/assistant',
            name: 'assistant'
        },
        {
            path: '/dashboard/statics',
            name: 'statics'
        },
        {
            path: '/dashboard/importCards',
            name: 'import cards'
        },
        {
            path: '/dashboard/importVerbs',
            name: 'import verbs'
        }
    ]

    const route = useRoute()
    const path = computed(() => route.path);
    
</script>
<style lang="">
    
</style>