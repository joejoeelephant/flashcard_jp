<template lang="">
    <div v-if="!loading">
        <div v-if="decks && decks.length" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <DeckItem v-for="(item, i) in decks" :key="i" :deckData="item" @showEditModal="showEditModal" />
        </div>
        <div v-else>
            <p>No decks available.</p>
        </div>
    </div>
    <EditDeckModal :isVisible="editModalVisible" :deckData="editDeckData" @hideModal="hideEditModal"/>
    <AddButton />
</template>
<script setup lang="ts">
import _ from 'lodash'
import { Deck } from '~/types/types'

import {useDecksFetcher} from '~/composables/useDecksFetcher'
const emits = defineEmits(['setCurrentDeck'])
const editModalVisible = ref(false);
const editDeckData = ref<Deck|null>(null);
const { loading, decks, fetchDecks, refreshDecks } = useDecksFetcher()
provide('deckList', {decksData: decks, updateDeckList: refreshDecks})

await fetchDecks()

const setCurrentLearningDeck = () => {
    if(!decks.value.length) return;
    const decksWithLastReviewed = decks.value.filter(item => item.lastReviewed)
    const lastDeck = _.maxBy(decksWithLastReviewed, (item) => item.lastReviewed)
    emits('setCurrentDeck', lastDeck)
}

setCurrentLearningDeck()

const showEditModal = (deckData: Deck) => {
    editDeckData.value = deckData;
    editModalVisible.value = true;
}

const hideEditModal = () => {
    editModalVisible.value = false;
}

</script>
<style lang="">
    
</style>