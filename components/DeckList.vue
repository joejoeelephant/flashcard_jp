<template lang="">
    <div v-if="!loading">
        <div v-if="decksData && decksData.length" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <DeckItem v-for="(item, i) in decksData" :key="i" :deckData="item" @showEditModal="showEditModal" />
        </div>
        <div v-else>
            <p>No decks available.</p>
        </div>
    </div>
    <EditDeckModal :isVisible="editModalVisible" :deckData="editDeckData" @hideModal="hideEditModal"/>
    <AddButton />
</template>
<script setup lang="ts">
import {customFetch} from '~/utils/customFetch'
import _ from 'lodash'
interface Deck {
    id: string;
    name: string;
    description: string;
    lastReviewed?: Date
}

interface ApiResponse {
    body: Deck[];
    statusCode: number;
    statusMessage: string;
}

const emits = defineEmits(['setCurrentDeck'])

// Destructure the properties for more elegant data access
const decksData = ref<Deck[]>([])
const loading = ref<boolean>(true)

provide('deckList', {decksData, updateDeckList})

const getDeckList = async () => {
    const { data, pending} = await customFetch<ApiResponse, any>('/api/decks')
    loading.value = pending.value
    if(data.value) {
        decksData.value = data.value.body
    }

}

await getDeckList()

function updateDeckList(decks: Deck[]) {
    decksData.value = decks
}

const setCurrentLearningDeck = () => {
    if(!decksData.value.length) return;
    const decksWithLastReviewed = decksData.value.filter(item => item.lastReviewed)
    const lastDeck = _.maxBy(decksWithLastReviewed, (item) => item.lastReviewed)
    emits('setCurrentDeck', lastDeck)
}

setCurrentLearningDeck()


const editModalVisible = ref(false);
const editDeckData = ref<Deck>({
    id: '',
    name: '',
    description: '',
});

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