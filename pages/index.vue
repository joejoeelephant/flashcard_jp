<template lang="">
    <div class="container mx-auto px-4 pb-24">
        <CurrentDeck v-if="currentDeck" :deckData="currentDeck"/>
        <DeckList @setCurrentDeck="setCurrentDeck"/>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: [
        async (to, from) => {
            const {data, error} = await useFetch('/api/checkInit',{method: 'get'})
            if(!data.value) {
                return '/signup'
            }
        },"auth"]
});
interface Deck {
    id: string;
    name: string;
    description: string;
    lastReviewed?: Date
}
const currentDeck = ref<Deck | null>(null)

const setCurrentDeck = (deck: Deck) => {
    currentDeck.value = deck
}


</script>

<style lang="css">
    
</style>
