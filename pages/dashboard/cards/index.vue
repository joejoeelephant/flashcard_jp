<template lang="">
    <ClientOnly>
        <div class='h-full flex flex-col justify-between pb-8'>
           <div>
                <TableFilter :filter="filter" @setFilter="setFilter"/>
                <el-table :data="cardsList" v-loading="loading" style="width: 100%">
                    <el-table-column prop="id" label="id" />
                    <el-table-column prop="front" label="front" />
                    <el-table-column prop="frontCharacter" label="front_ch" />
                    <el-table-column prop="back" label="back" />
                    <el-table-column prop="deckName" label="deckName" width="100"/>
                    <el-table-column fixed="right" label="Operations" width="120">
                        <template #default="scope">
                            <!-- <el-button link type="primary" size="small" >Edit</el-button> -->
                            <el-button link type="warning" size="small" @click.prevent="handleDelete(scope.$index, scope.row.id)">delete</el-button>
                        </template>
                    </el-table-column>

                </el-table>
           </div>
            <div class="flex justify-center">
                <el-pagination 
                    background 
                    layout="prev, pager, next" 
                    :page-size="pageSize" 
                    :total="totalCardsCounts"
                    @prev-click="prevPage"
                    @next-click="nextPage"
                    @current-change="changePage"
                />
            </div>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import { CardData } from '~/types/types';
import { ElNotification } from 'element-plus'
import { useCardsApi } from '~/composables/useCardsApi'
import _ from 'lodash';

    interface Filter {
        deckId: string,
        frontText: string,
        backText: string
    }

    definePageMeta({
        layout: 'dashboard',
        middleware: ["auth"]

    })
    const PAGE_SIZE = 10
    const filter = ref<Filter>({
        deckId: '',
        frontText: '',
        backText: ''
    })
    const cardsList = ref<CardData[]>([])
    const page = ref<number>(1)
    const pageSize = ref<number>(PAGE_SIZE)
    const totalCardsCounts = ref<number>(0)
    const loading = ref<boolean>(false)
    const { fetchCards, deleteCard, showNotification } = useCardsApi()

    watch(() => page.value, (newVal) => {
        fetchCardsWithCurrentFilter()
    })

    const fetchCardsWithCurrentFilter = async () => {
        loading.value = true
        const query = { page: page.value, pageSize: PAGE_SIZE, ..._.cloneDeep(filter.value) }
        const { data, error } = await fetchCards(query)
        loading.value = false
        cardsList.value = data.value?.body.cards || []
        totalCardsCounts.value = data.value?.body.totalCards || 0
    }

    fetchCardsWithCurrentFilter()

    
    const setFilter = (filterVal: Filter) => {
        filter.value = filterVal
        fetchCardsWithCurrentFilter()
    }

    const prevPage = () => {
        if(page.value < 2) return
        page.value--
    }

    const nextPage = () => {
        page.value++
    }

    const changePage = (newPage: number) => {
        page.value = newPage
    }

    const handleDelete = async (index: number, cardId: number) => {
        const { data, error } = await deleteCard(cardId)
        if (data.value) {
            showNotification('Success', 'Card deleted successfully', 'success')
            cardsList.value.splice(index, 1)
        } else if (error.value) {
            showNotification('Error', error.value?.statusMessage, 'warning')
        }
    }

</script>
<style lang="">
    
</style>