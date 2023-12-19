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
                            <el-button link type="warning" size="small" @click.prevent="deleteItem(scope.$index, scope.row.id)">delete</el-button>
                        </template>
                    </el-table-column>

                </el-table>
           </div>
            <div class="flex justify-center">
                <div class="md:hidden">
                    <el-pagination 
                        background 
                        layout="prev, pager, next" 
                        small 
                        :page-size="12" 
                        :total="100" 
                        @prev-click="prevPage"
                        @next-click="nextPage"
                        @current-change="changePage"
                    />
                </div>

                <div class="hidden md:block">
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
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import { CardData } from '~/types/types';
import { ElNotification } from 'element-plus'
import {customFetch} from '~/utils/customFetch'
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

    interface CardsApiResponse {
        body: {
            cards:CardData[],
            totalCards: number
        };
        statusCode: number;
        statusMessage: string;
    }

    const filter = ref<Filter>({
        deckId: '',
        frontText: '',
        backText: ''
    })
    const cardsList = ref<CardData[]>([])
    const PAGE_SIZE = 10
    const page = ref<number>(1)
    const pageSize = ref<number>(PAGE_SIZE)
    const totalCardsCounts = ref<number>(0)
    const loading = ref<boolean>(false)
    
    watch(() => page.value, (newVal) => {
        fetchCards()
    })

    const fetchCards = async () => {
        loading.value = true;
        const pageValue = Number(page.value)
        const pageSizeValue = Number(pageSize.value)
        const filterValue = _.cloneDeep(filter.value);
        const {data, error} = await customFetch<CardsApiResponse, any>('/api/cards', {
            method: 'get',
            query: {
                page: pageValue,
                pageSize: pageSizeValue,
                ...filterValue
            }
        })
        loading.value = false
        cardsList.value = data.value?.body.cards || []
        totalCardsCounts.value = data.value?.body.totalCards || 0
    }
    fetchCards()

    const setFilter = (filterVal: Filter) => {
        filter.value = filterVal
        fetchCards()
    }

    const prevPage = () => {
        if(page.value < 2) return
        page.value--
    }

    const nextPage = () => {
        page.value++
    }

    const changePage = (val: number) => {
        page.value = val
        console.log(val)
    }

    const deleteItem = async (index: number, id: number) => {
        const {data, error} = await customFetch<any, any>("/api/card", {
            method: 'delete',
            query: {
                cardId: id
            }
        })

        if(data.value) {
            ElNotification({
                title: 'success',
                message: "delete card successfully",
                type: 'success',
            })
            cardsList.value.splice(index, 1)
        }

        if(error.value) {
            ElNotification({
                title: 'error',
                message: error.value?.statusMessage,
                type: 'warning',
            })
        }
    }

</script>
<style lang="">
    
</style>