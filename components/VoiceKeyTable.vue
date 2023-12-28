<template lang="">
    <ClientOnly>
        <div class="mt-8">
            <h3 class="font-bold">Voice Key</h3>
            <div class="mt-2">
                <el-table :data="ApiKeys" style="width: 100%">
                    <el-table-column prop="value" label="value" width="500" />
                    <el-table-column prop="createdAt" label="createdAt" />
                    <el-table-column fixed="right" label="Operations">
                        <template #default="scope">
                            <!-- <el-button link type="primary" size="small" >Edit</el-button> -->
                            <el-button link type="warning" size="small" @click.prevent="deleteApiKey(scope.row.id)">delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex items-center mt-2 gap-4" v-if="showCreate">
                <div class="text-gray-600">
                    VoiceKey:
                </div>
                <div class="flex-1">
                    <el-input v-model="apiKey"/>
                </div>
                <div>
                    <el-button @click="handleCreateApiKey">create</el-button>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
    import { useVoiceApiKeys } from '~/composables/useVoiceApiKeys';
    const { apiKeys: ApiKeys, fetchApiKeys, createApiKey, deleteApiKey } = useVoiceApiKeys()
    const apiKey = ref('')
    const showCreate = ref(true)
    await fetchApiKeys()
    watch(() => ApiKeys.value, (newVal) => {
        showCreate.value = (newVal.length === 0)
    })

    const handleCreateApiKey = async () => {
        const {data, error} = await createApiKey(apiKey.value)
    }

    const handleDeleteApiKey = async (id: number) => {
        const {data, error} = await deleteApiKey(id)
    }

</script>
<style lang="">
    
</style>