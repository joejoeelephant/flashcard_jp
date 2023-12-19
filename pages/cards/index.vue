<template lang="">
    <div class="container mx-auto flex flex-col justify-between" :style="{minHeight: '760px'}">
        <ClientOnly>
            <div v-if="!loading" class="w-full grid grid-cols-2 md:grid-cols-6 gap-4">
                <Card v-for="(item,i) in cardsList" ::key="i" :cardData="item" @click="() => {showModal(item)}"/>
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
            <CardBack :isVisible="modalVisible" :cardData="currentCard" @hideModal="hideModal"/>
        </ClientOnly>
    </div>
    
</template>
<script setup lang="ts">
import { CardData } from '~/types/types';
import { customFetch } from '#imports';
import { ElLoading } from 'element-plus'

interface CardsApiResponse {
    body: {
        cards:CardData[],
        totalCards: number
    };
    statusCode: number;
    statusMessage: string;
}
    definePageMeta({
        middleware: ["auth"]
    })
    const currentCard = ref<CardData | null>(null);
    const modalVisible = ref<boolean>(false);
    const cardsList = ref<CardData[]>([])
    const PAGE_SIZE = 18
    const page = ref<number>(1)
    const pageSize = ref<number>(PAGE_SIZE)
    const totalCardsCounts = ref<number>(0)
    const loading = ref<boolean>(false)
    
    watch(() => page.value, (newVal) => {
        fetchCards()
    })

    const fetchCards = async () => {
        loading.value = true;
        let loadingInstance = ElLoading.service(
            {
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            }
        )
        const pageValue = Number(page.value)
        const pageSizeValue = Number(pageSize.value)
        const {data, error} = await customFetch<CardsApiResponse, any>('/api/cards', {
            method: 'get',
            query: {
                page: pageValue,
                pageSize: pageSizeValue
            }
        })
        loadingInstance && loadingInstance.close()
        loading.value = false
        cardsList.value = data.value?.body.cards || []
        totalCardsCounts.value = data.value?.body.totalCards || 0
        console.log(data.value)
    }
    fetchCards()

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

    const showModal = (cardData: CardData) => {
        currentCard.value = cardData;
        modalVisible.value = true;
    }

    const hideModal = () => {
        modalVisible.value = false;
    }

</script>
<style lang="">
    
</style>