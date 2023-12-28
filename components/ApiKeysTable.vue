<template lang="">
    <ClientOnly>
        <div>
            <h3 class="font-bold">Open Api Key</h3>
            <div class="mt-2">
                <el-table :data="ApiKeys" style="width: 100%">
                    <el-table-column prop="value" label="value" width="500" />
                    <el-table-column prop="createdAt" label="createdAt" />
                    <el-table-column fixed="right" label="Operations">
                        <template #default="scope">
                            <!-- <el-button link type="primary" size="small" >Edit</el-button> -->
                            <el-button link type="warning" size="small" @click.prevent="clearApiKey(scope.row.id)">delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex items-center mt-2 gap-4" v-if="showCreate">
                <div class="text-gray-600">
                    apiKey:
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
import { useOpenApi } from '~/composables/useOpenApi';
    const emits = defineEmits(['setAssistants', 'setApiKeyExist'])
    const ApiKeys = ref<any>([])
    const apiKey = ref('')
    const showCreate = ref(false)
    const {getApiKey, createApiKey, deleteApiKey, createAssistant, deleteAsistants} = useOpenApi()

    watch(() => ApiKeys.value, (newVal) => {
        showCreate.value = (newVal.length === 0)
    })

    const handleGetApiKey = async () => {
        const {data, error} = await getApiKey()
        if(!data.value?.body) {
            showCreate.value = true
            console.log(error.value)
            return;
        }
        ApiKeys.value = [data.value.body]
        emits('setApiKeyExist', true)
    }
    await handleGetApiKey()

    const handleCreateApiKey = async () => {
        const {data, error} = await createApiKey(apiKey.value)

        if(data.value?.body) {
            ApiKeys.value = [data.value.body]
            apiKey.value = ""
            await handleCreateAssistant()
        }

        if(error.value) {
            ElNotification({
                title: 'error',
                message: String(error.value),
                type: 'warning',
            })
        }
    }

    const handleCreateAssistant = async () => {
        const {data, error} = await createAssistant()
        if(data.value) {
            emits('setAssistants', [data.value.body])
        }

        if(error.value) {
            ElNotification({
                title: 'error',
                message: error.value.statusMessage,
                type: 'warning',
            })
        }
    }


    const clearApiKey = (id: number) => {
        ElMessageBox.confirm(
                'It will permanently delete the apikey and assistant and related assistant message data. Continue?',
                'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        )
        .then(async () => {
            await deleteAsistants(id)
            await deleteApiKey(id)
            ApiKeys.value = []
            emits('setAssistants', [])
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
    }

</script>
<style lang="">
    
</style>