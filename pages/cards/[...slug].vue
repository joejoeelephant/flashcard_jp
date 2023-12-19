<template lang="">
    <div class="container mx-auto flex flex-col justify-between" :style="{minHeight: '760px'}">
        <ClientOnly>
            <div class="w-full grid grid-cols-2 md:grid-cols-6 gap-4" :style="{minHeight: '600px'}">
                <Card v-for="(item,i) in cardsList" :key="i" :cardData="item"/>
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
    const route = useRoute()
    const [deckId] = route.params.slug
    const currentCard = ref<CardData | null>(null);
    const cardsList = ref<CardData[]>([])
    const page = ref<number>(1)
    const pageSize = ref<number>(18)
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
                pageSize: pageSizeValue,
                deckId: deckId
            }
        })
        loadingInstance && loadingInstance.close()
        loading.value = false
        cardsList.value = data.value?.body.cards || []
        totalCardsCounts.value = data.value?.body.totalCards || 0
        console.log(data.value)
    }

    onMounted(() => {
        fetchCards()
    })

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

</script>
<style lang="">
    
</style>