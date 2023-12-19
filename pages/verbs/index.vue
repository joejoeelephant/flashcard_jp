<template lang="">
    <div class="container mx-auto">
        <div class="bg-white p-4">
            <el-select v-model="deckId" class="m-2" placeholder="Select" size="large">
                <el-option label="all" value="" />
                <el-option
                    v-for="item in deckOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </div>
        <div class="bg-white p-4 shadow-md rounded-md">
            <div class="mt-4">
                <el-table :data="verbsArr" v-loading="loading" style="width: 100%">
                    <el-table-column prop="meaning" label="meaning" />
                    <el-table-column prop="nai" label="-ない" />
                    <el-table-column prop="masu" label="-ます" />
                    <el-table-column label="base">
                        <template #default="scope">
                            <div>
                                <span class="font-bold">{{ scope.row.base }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ba" label="-ば"/>
                    <el-table-column prop="volitional" label="volitional"/>
                    <el-table-column prop="te" label="て-"/>
                    <el-table-column fixed="right" label="Operations" width="120">
                        <template #default="scope">
                            <!-- <el-button link type="primary" size="small" >Edit</el-button> -->
                            <el-button link type="warning" size="small" @click.prevent="deleteItem(scope.$index, scope.row.id)">delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { da } from 'element-plus/es/locale';
    import {customFetch} from '~/utils/customFetch'
    definePageMeta({
        middleware: ["auth"]

    })
    interface Deck {
        id: string;
        name: string;
        description: string;
    }
    interface ApiResponse {
        body: Deck[];
        statusCode: number;
        statusMessage: string;
    }

    const deckOptions = ref<Deck[]>([])
    const deckId = ref(1)
    const verbsArr = ref<any[]>([])
    const loading = ref(true)

    watch(() => deckId.value, (newVal) => {
        console.log(newVal)
        fetchVerbs()
    })

    const fetchDecks = async () => {
        const { data, pending, error } = await customFetch<ApiResponse, any>('/api/decks')
        if(data.value) {
            deckOptions.value = data.value.body
        }
        
    }

    await fetchDecks();

    const fetchVerbs = async () => {
        loading.value = true;
        const {data, error} = await customFetch<any, any>('/api/verbs', {
            method: 'get',
            query: {
                deckId: deckId.value
            }
        })
        if(data.value) {
            console.log(data.value.body)
            verbsArr.value = data.value.body
            loading.value = false
        }
        console.log(data.value)
        console.log(error.value)
    }

    await fetchVerbs()

    const deleteItem = async (index:number, id: number) => {
        const {data, error} = await customFetch<any, any>('/api/verb', {
            method: 'delete',
            query: {
                verbId: id
            }
        })
        if(data.value) {
            const temp = verbsArr.value.splice(index, 1)
            ElMessage({
                showClose: true,
                message: 'Delete success',
                type: 'success'
            })
        }
        if(error.value) {
            ElMessage({
                showClose: true,
                message: JSON.stringify(error.value),
                type: 'warning'
            })
        }
    }
</script>
<style>
    
</style>