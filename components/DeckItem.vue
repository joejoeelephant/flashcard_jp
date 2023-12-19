<template lang="">
    <div class="rounded overflow-hidden p-4 shadow-lg shadow-slate-300 bg-white">
        <div class="flex flex-col gap-4">
            <div class="font-semibold flex justify-between">
                <span>
                    {{deckData.name}}
                </span>
                <div :class="`w-4 h-4 border-b-2 border-l-2 md:hidden border-slate-500 ${showInfo ? 'rotate-[135deg]' : '-rotate-45'}`" @click="toggle"></div>
            </div>
            <div class="text-sm text-slate-500">
                {{reviewGap >= 0 ? `Last preview ${reviewGap} days ago` : "" }}
            </div>
            <div class="flex gap-4 flex-wrap">
                <el-tag
                    type='warning'
                    class="mx-1"
                    effect="dark"
                >
                    {{states.newCards}} New
                </el-tag>
                <el-tag
                    type='success'
                    class="mx-1"
                    effect="dark"
                >
                    {{states.learningCards}} Learning
                </el-tag>
                <el-tag
                    type=''
                    class="mx-1"
                    effect="dark"
                >
                    {{states.reviewingCards}} Reviewing
                </el-tag>
            </div>
            <div :class="`py-4 overflow-hidden ${showInfo ? 'md:block' : 'hidden md:block'}`">
                <div class="border-t-2 border-b-2 border-slate-200 py-4">
                    <div class="grid grid-cols-3">
                        <div>
                            Studied today
                        </div>
                        <div class="font-semibold text-center">
                            {{states.cardsStudiedToday}}
                        </div>
                        <div>
                            Cards
                        </div>
                    </div>
                    <div class="grid grid-cols-3 mt-2">
                        <div>
                            New Cards
                        </div>
                        <div class="font-semibold text-center">
                            {{states.newCards}}
                        </div>
                        <div>
                            Cards
                        </div>
                    </div>
                </div>
                <div class="flex justify-between mt-4 text-slate-600 items-center">
                    <div>
                        <el-link :href="`/cards/${deckData.id}`" class="mr-4">view</el-link>
                        <el-link :href="`/assistant/${deckData.id}`" class="mr-4">assistant</el-link>
                        <el-button @click="showEditModal">edit</el-button>
                    </div>
                    <span>
                        <el-button type="primary" @click="gotoLearn">learn</el-button>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

    interface CardsState {
        newCards: Number,
        learningCards: Number,
        reviewingCards: Number,
        cardsStudiedToday: Number
    }
    interface CardsStateApiResponse {
        body: CardsState;
        statusCode: number;
        statusMessage: string;
    }

    const {deckData} = defineProps(['deckData'])
    const emit = defineEmits(['showEditModal'])
    const router = useRouter()
    const showInfo = ref(false)
    const reviewGap = ref<number>(-1)
    const states = reactive<CardsState>({
        newCards: 0,
        learningCards: 0,
        reviewingCards: 0,
        cardsStudiedToday: 0
    })

    const getCardsState = async () => {
        const {data, error} = await customFetch<CardsStateApiResponse, any>('/api/cardStateFetcher', {
            method: "get",
            query: {
                deckId: Number(deckData.id)
            }
        })
        if(data.value) {
            states.newCards = data.value.body.newCards
            states.learningCards = data.value.body.learningCards
            states.reviewingCards = data.value.body.reviewingCards
            states.cardsStudiedToday =  data.value.body.cardsStudiedToday
        }
        if(error.value) {
            console.log(error.value)
        }
        // console.log(data.value)
        
    }

    await getCardsState()

    const calculateTimeGap = (timeStamp: Date) => {
        // Ensure timeStamp is a Date object
        if (!(timeStamp instanceof Date)) {
            timeStamp = new Date(timeStamp);
        }

        const now = new Date();
        const millisecondsDifference = now.getTime() - timeStamp.getTime();

        // Convert the milliseconds difference into respective units
        const secondsDifference = Math.floor(millisecondsDifference / 1000);
        const minutesDifference = Math.floor(secondsDifference / 60);
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);

        return {
            days: daysDifference,
            hours: hoursDifference % 24, // modulo to get remaining hours less than a day
            minutes: minutesDifference % 60, // modulo to get remaining minutes less than an hour
            seconds: secondsDifference % 60, // modulo to get remaining seconds less than a minute
        };
    }

    if(deckData.lastReviewed) {
        const {days} = calculateTimeGap(deckData.lastReviewed)
        reviewGap.value = days
    }

    const toggle = () => {
        showInfo.value = !showInfo.value
    }
    const showEditModal = () => {
        emit('showEditModal', deckData)
    }
    const gotoLearn = () => {
        router.push({path: `/learn/${deckData.id}`})
    }
</script>
<style lang="">
    
</style>