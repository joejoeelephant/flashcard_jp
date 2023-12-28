<template lang="">
    <div class="container mx-auto flex flex-col justify-between" :style="{minHeight: '760px'}">
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
                        :total="totalCardsCount"
                        @prev-click="prevPage"
                        @next-click="nextPage"
                        @current-change="changePage"
                    />
                </div>
            </div>
    </div>
    
</template>
<script setup lang="ts">
import { useCardsFetcher } from '~/composables/useCardsFetcher'

    definePageMeta({
        middleware: ["auth"]
    })
    const route = useRoute()
    const [deckId] = route.params.slug
    const page = ref<number>(1)
    const pageSize = ref<number>(18)

    if(!deckId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'deckId is required',
        });
    }

    const { cardsList, totalCardsCount, loading, fetchCards } = useCardsFetcher()
    await fetchCards(deckId, page.value, pageSize.value)

    watch(() => page.value, async (newVal) => {
        await fetchCards(deckId, page.value, pageSize.value)
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