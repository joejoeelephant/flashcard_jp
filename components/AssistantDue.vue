<template lang="">
    <div :class="`bg-blue-100 p-4 assistant-r-side ${open? ' open' : ' close'}`">
        <el-switch size="small" v-model="open" />
        <div :class="open? '' : 'hidden'">
            <el-checkbox-group v-model="checkList" class="grid grid-cols-2">
                <el-checkbox v-for="(item, index) in cardsList" :key="index" :label="item.front" />
            </el-checkbox-group>
            <div v-if="cardsList.length" class="flex justify-center mt-4">
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

    const emits = defineEmits(['setCards'])

    const checkList = ref([])
    const route = useRoute()
    const [deckId] = route.params.slug
    const cardsList = ref<CardData[]>([])
    const page = ref<number>(1)
    const pageSize = ref<number>(32)
    const totalCardsCounts = ref<number>(0)
    const loading = ref<boolean>(false)
    const open = ref(true)
    watch(() => page.value, (newVal) => {
        fetchCards()
    })

    watch(() =>  checkList.value, (newVal) => {
        emits('setCards', checkList.value)
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

    await fetchCards()

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