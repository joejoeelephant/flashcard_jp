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
                    <el-button @click="createApiKey">create</el-button>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import {customFetch} from '~/utils/customFetch'
import { ElNotification } from 'element-plus'
    const ApiKeys = ref<any>([])
    const apiKey = ref('')
    const showCreate = ref(false)

    watch(() => ApiKeys.value, (newVal) => {
        showCreate.value = (newVal.length === 0)
    })

    const getApiKey = async () => {
        const {data, error} = await customFetch<any, any>('/api/voiceKey', {method: 'get'})
        if(data.value.body) {
            ApiKeys.value = [data.value.body]
        }else {
            showCreate.value = true
        }
        console.log(data.value)
        console.log(error.value)
    }
    await getApiKey()

    const createApiKey = async () => {
        const {data, error} = await customFetch<any, any>('/api/voiceKey', {
            method: 'post',
            body: {
                voiceKey: apiKey.value
            }
        })

        console.log(data.value)
        console.log(error.value)

        if(data.value && data.value.body) {
            ApiKeys.value = [data.value.body]
            apiKey.value = ""
        }

        if(error.value) {
            ElNotification({
                title: 'error',
                message: String(error.value),
                type: 'warning',
            })
        }
    }

    const deleteApiKey = async (id: number) => {
        const {data, error} = await customFetch('/api/voiceKey', {
            method: "delete",
            query: {
                id
            }
        })
        if(data.value) {
            ApiKeys.value = []
        }
        console.log(data.value)
        console.log(error.value)
    }

</script>
<style lang="">
    
</style>