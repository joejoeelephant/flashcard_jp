<template lang="">
    <div class="grid grid-cols-3">
        <div class="text-center flex flex-col gap-1">
            <div class="flex justify-center">
                <div class="w-8 h-8 rounded-full bg-rose-400"></div>
            </div>
            <div class="text-sm">
                New
            </div>
            <div class="font-semibold">
                {{states.newCards}}
            </div>
        </div>
        <div class="text-center flex flex-col gap-1">
            <div class="flex justify-center">
                <div class="w-8 h-8 rounded-full bg-blue-400"></div>
            </div>
            <div class="text-sm">
                Learning
            </div>
            <div class="font-semibold">
                {{states.learningCards}}
            </div>
        </div>
        <div class="text-center flex flex-col gap-1">
            <div class="flex justify-center">
                <div class="w-8 h-8 rounded-full bg-green-400"></div>
            </div>
            <div class="text-sm">
                Reviewing
            </div>
            <div class="font-semibold">
                {{states.reviewingCards}}
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
    const {deckId} = defineProps(["deckId"])
    const states = reactive<CardsState>({
        newCards: 0,
        learningCards: 0,
        reviewingCards: 0
    })
    const getCardsState = async () => {
        const {data, error} = await useFetch<CardsStateApiResponse, any>('/api/cardStateFetcher', {
            method: "get",
            query: {
                deckId
            }
        })
        if(data.value) {
            states.newCards = data.value.body.newCards
            states.learningCards = data.value.body.learningCards
            states.reviewingCards = data.value.body.reviewingCards
        }
        console.log(data.value)
    }

    await getCardsState()
</script>
<style lang="">
    
</style>