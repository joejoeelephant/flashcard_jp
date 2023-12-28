<template lang="">
    <div :class="`bg-blue-100 p-4 assistant-r-side ${open? ' open' : ' close'}`">
        <el-switch size="small" v-model="open" />
        <div :class="open? '' : 'hidden'">
            <el-checkbox-group v-model="checkList" class="grid grid-cols-2" :loading="loading">
                <el-checkbox v-for="(item, index) in cardsList" :key="index" :label="item.front" />
            </el-checkbox-group>
            <div v-if="cardsList.length" class="flex justify-center mt-4">
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
import {useCardsFetcher} from '~/composables/useCardsFetcher'
    const emits = defineEmits(['setCards'])
    const checkList = ref([])
    const route = useRoute()
    const [deckId] = route.params.slug
    const page = ref<number>(1)
    const pageSize = ref<number>(32)
    const open = ref(true)
    const { cardsList, loading, totalCardsCount, fetchCards } = useCardsFetcher()
    await fetchCards(deckId, page.value, pageSize.value)

    watch(() => page.value, (newVal) => {
        fetchCards(deckId, page.value, pageSize.value)
    })

    watch(() =>  checkList.value, (newVal) => {
        emits('setCards', checkList.value)
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
<style scoped lang="css">
    .assistant-r-side{
        transition: width 0.5s
    }
    .open {
        width: 300px;
    }

    .close {
        width: 60px;
    }

</style>