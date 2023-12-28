<template lang="">
    <div class="container mx-auto">
        <div class="bg-white p-4">
            <el-select v-model="deckId" class="m-2" placeholder="Select" size="large">
                <el-option label="all" value="" />
                <el-option
                    v-for="item in decks"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </div>
        <div class="bg-white p-4 shadow-md rounded-md">
            <div class="mt-4">
                <el-table :data="verbs" v-loading="loading" style="width: 100%">
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
                            <el-button link type="warning" size="small" @click.prevent="handleDeleteItem(scope.$index, scope.row.id)">delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useDecksFetcher } from '~/composables/useDecksFetcher'
    import { useVerbsFetcher } from '~/composables/useVerbsFetcher';
    import {useVerbApi} from '~/composables/useVerbApi';
    definePageMeta({
        middleware: ["auth"]

    })

    const deckId = ref(1)
    const { decks, fetchDecks } = useDecksFetcher()
    const { verbs, loading, fetchVerbs } = useVerbsFetcher()
    const {deleteItem} = useVerbItemDeleter()
    await fetchDecks()
    await fetchVerbs(deckId.value)

    watch(() => deckId.value, (newVal) => {
        fetchVerbs(newVal)
    })


    const handleDeleteItem = async (index:number, id: number) => {
        console.log(id)
        const {data, error} = await deleteItem(id)
        if(data.value) {
           verbs.value.splice(index, 1)
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