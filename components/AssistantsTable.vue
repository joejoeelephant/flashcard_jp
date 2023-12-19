<template lang="">
    <ClientOnly>
        <div class="mt-8">
            <h3 class="font-bold">Assistants</h3>
            <div>
                <el-table :data="assistants" style="width: 100%">
                    <el-table-column prop="value" label="assistant_id"/>
                    <el-table-column label="model" width="280">
                        <template #default="scope">
                            <div class="flex items-center">
                                <el-select v-model="modelValue" class="m-2" placeholder="Select" size="small">
                                    <el-option
                                    v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                                <el-button type="primary" size="small" v-if="currentModelValue !== modelValue" @click="updateModel(scope.row.id, scope.row.value)"> 
                                    update
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdAt" label="createdAt" />
                </el-table>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import {customFetch} from '~/utils/customFetch'

    type Option = {
        value: String,
        label: String
    }

    const props = defineProps(['assistants', 'apiKeyExist'])
    const emits = defineEmits(['setAssistants'])
    const modelValue = ref('')
    const currentModelValue = ref('')
    const options = ref<Option[]>([])
    watch(() => props.apiKeyExist, async (newVal) => {
        console.log(newVal)
        await getAssistant()
        await getAssistantModels()
    })

    const getAssistant = async () => {
        const {data, error} = await customFetch<any,any>('/api/assistant', {method: 'get'})
        if(data.value) {
            emits('setAssistants', [data.value.body])
            modelValue.value = data.value.body.model
            currentModelValue.value = data.value.body.model
        }
        console.log(data.value)
        console.log(error.value)
    }

    const getAssistantModels = async () => {
        const {data, error} = await customFetch<any, any>('/api/openModels',{method: 'get'})
        if(data.value) {
            const optionsList = data.value.body.map((item: any) => {return {value: item.id, label: item.id}})
            optionsList.push({value: "gpt-3.5-turbo-1106", label: "gpt-3.5-turbo-1106"})
            options.value = optionsList
        }
        console.log(data.value)
        console.log(error.value)
    }

    const updateModel = async (id: number, assistantId: string) => {
        console.log(id, assistantId)
        const {data, error} = await customFetch<any, any>('/api/assistant', {
            method: 'put',
            body: {
                id,
                assistantId,
                model: modelValue.value
            }
        })
        if(data.value) {
            currentModelValue.value = modelValue.value
        }
        console.log(data.value)
        console.log(error.value)
    }

    
</script>
<style lang="">
    
</style>