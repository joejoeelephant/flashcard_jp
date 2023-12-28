<template lang="">
    <div>
        <ApiKeysTable @setAssistants="setAssistants" @setApiKeyExist="setApiKeyExist"/>
        <AssistantsTable :apiKeyExist="apiKeyExist" :assistants="assistants" @setAssistants="setAssistants"/>
        <VoiceKeyTable />
    </div>
</template>
<script setup lang="ts">

    definePageMeta({
        layout: 'dashboard',
        middleware: ["auth"]

    })

    type Assistant = {
        value: String,
        model: String,
        createdAt: String,
    }

    const assistants = ref<Assistant[]>([])
    const apiKeyExist = ref(false)

    const setApiKeyExist = (value: boolean) => {
        apiKeyExist.value = value
    }

    const setAssistants = (value: Assistant[]) => {
        assistants.value = value
    }
</script>
<style lang="">
    
</style>