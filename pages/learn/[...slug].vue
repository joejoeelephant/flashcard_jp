<template lang="">
    <div>
        <CardsState :deckId="deckId"></CardsState>
        <div class="flex gap-2 items-center px-4 mt-4">
            <div class="flex-1 rounded-full h-3 bg-slate-300">
                <div class="rounded-full h-full bg-blue-300" :style="{width:`${Math.ceil((cardIndex + 1)/(cardsArr.length) * 100)}%`}"></div>
            </div>
            <div class="text-sm">
                {{cardIndex + 1}}/{{cardsArr.length}}
            </div>
        </div>
    </div>
    <div v-if="cardsArr.length">
        <div class="flex justify-center px-8 py-10 ">
            <div class="w-full h-[45vh] rounded-lg bg-white flex justify-center items-center text-6xl font-bold flip-card ">
                <div :class="`flip-card-inner rounded-lg ${isFlipped ? 'flip-back' : ''}`">
                    <div class="flip-card-front">
                        {{cardsArr[cardIndex].front}}
                    </div>
                    
                    <div class="flip-card-back text-xl">
                        <div class="w-2/3 overflow-x-scroll ">
                            <p>
                                frontCharacter: 
                            </p>
                            <p class="italic">
                                {{cardsArr[cardIndex].frontCharacter}}
                            </p>
                        </div>
                        <div class="w-2/3 overflow-x-scroll ">
                            <p>
                                romaji: 
                            </p>
                            <p class="italic">
                                {{cardsArr[cardIndex].frontPronunciation}}
                            </p>
                        </div>
                        <div class="w-2/3 overflow-x-scroll mt-4 ">
                            <p>
                                meaning:
                            </p>
                            <p class="italic">
                                {{cardsArr[cardIndex].back}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isFlipped" class="p-8">
            <div class="w-full px-2 py-3 bg-blue-400 active:bg-blue-500 text-white text-center rounded-lg"  @click="toggleFlip">
                Show Answer
            </div>
        </div>
        <div v-if="isFlipped" class="p-8 grid grid-cols-3 gap-4 text-center text-white">
            <div class="rounded-md py-2 bg-rose-400" @click="sendCardAction('again')">
                <div>
                    Again
                </div>
                <div class="text-xs mt-2">
                    1min
                </div>
            </div>
            <div class="rounded-md py-2 bg-blue-400" @click="sendCardAction('good')">
                <div>
                    Good
                </div>
                <div class="text-xs mt-2">
                    1d
                </div>
            </div>
            <div class="rounded-md py-2 bg-green-400" @click="sendCardAction('easy')">
                <div>
                    Easy
                </div>
                <div class="text-xs mt-2">
                    2d
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="dialogVisible" fullscreen center>
        <div class="h-96 flex justify-center items-center">
            Completed !
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="gotoHome">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
    import { CardData} from '~/types/types'
    import {useDueCardsApi} from '~/composables/useDueCardsApi'
    definePageMeta({
        middleware: ["auth"]

    })

    const route = useRoute()
    const router = useRouter()
    const { getCards, updateLastReviewed, cardAction } = useDueCardsApi()
    const [deckId] = route.params.slug
    const isFlipped = ref<boolean>(false)
    const cardsArr = ref<CardData[]>([])
    const cardIndex = ref(0)
    const dialogVisible = ref<boolean>(false)
    
    if(!deckId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'deckId is required',
        });
    }

    const initCards = async () => {
        const {data, error} = await getCards(deckId)

        if(data.value) {
            const {cards} = data.value.body
            cardsArr.value = cards
        }
    }

    await initCards();
    await updateLastReviewed(deckId);

    if(!cardsArr.value.length) {
        dialogVisible.value = true
    }

   

    const sendCardAction = async (action: string) => {
        const {id} = cardsArr.value[cardIndex.value]
        const {data} = await cardAction(id, action)
        nextCard()
    }
    
    const gotoHome = () => {
        router.push({path: '/'})
    }

    const nextCard = () => {
        console.log(cardIndex.value)
        if(cardIndex.value >= cardsArr.value.length - 1) {
            showDialog()
            return
        }
        toggleFlip()
        setTimeout(() => cardIndex.value += 1 , 700)
    }

    const showDialog = () => {
        dialogVisible.value = true
    }

    const toggleFlip = () => {
        isFlipped.value = !(isFlipped.value)
    }
</script>
<style scoped>
    .flip-card {
        background-color: transparent;
        perspective: 1000px;
    }

    .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        background-color: #fff;
    }

    .flip-card-inner.flip-back {
        transform: rotateY(-180deg);
    }

    .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .flip-card-back {
        transform: rotateY(180deg);
    }
</style>