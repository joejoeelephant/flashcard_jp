<template lang="">
    <div class="rounded-lg overflow-hidden flex justify-between items-center p-4 gap-8 shadow-md shadow-slate-200 md:w-1/2 mx-auto bg-white">
        <div class="flex flex-col gap-2">
            <p class="font-semibold">{{deckData.name}}</p>
            <p class="text-sm text-slate-500">
                You have learned {{states.reviewingCards + states.learningCards}} words
            </p>
            <div class="flex flex-wrap">
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
                    class="mx-1 mt-1 md:mt-0"
                    effect="dark"
                >
                    {{states.reviewingCards}} Reviewing
                </el-tag>
            </div>
            <div>
                <el-button type="primary" @click="gotoLearn">continue learning</el-button>
            </div>
        </div>
        <div class="w-1/3 md:w-32">
            <div class="w-full aspect-square overflow-hidden relative rounded-full bg-slate-200 text-blue-500 flex justify-center items-center deck-progress" :style="{'--percent': `${percent}%`}">
                <span class="relative z-10 text-blue-500 text-xl font-bold">{{percent}}%</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    interface CardsState {
        newCards: Number,
        learningCards: Number,
        reviewingCards: Number
    }
    interface CardsStateApiResponse {
        body: CardsState;
        statusCode: number;
        statusMessage: string;
    }
    const {deckData} = defineProps(['deckData'])
    const router = useRouter()
    const states = reactive<CardsState>({
        newCards: 0,
        learningCards: 0,
        reviewingCards: 0
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
        }
        // console.log(data.value)
        
    }

    await getCardsState()

    let percent = Math.ceil((Number(states.reviewingCards) + Number(states.learningCards)) / (Number(states.newCards) + Number(states.learningCards) + Number(states.reviewingCards)) * 100)
    percent = isNaN(percent) ? 0 : percent
    
    const gotoLearn = () => {
        router.push({path: `/learn/${deckData.id}`})
    }
</script>
<style lang="css">
    .deck-progress::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        --themeColor: rgb(59 130 246 );
        background: repeating-conic-gradient(from 0, var(--themeColor) 0%, var(--themeColor) var(--percent) , transparent var(--percent), transparent 100%);
    }
    .deck-progress::after {
       content: "";
       position: absolute;
       inset: 0.5rem;
       border-radius: 50%;
       background-color: #fff;
    }
</style>