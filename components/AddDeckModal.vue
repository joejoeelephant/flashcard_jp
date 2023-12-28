<template lang="">
    <el-dialog
        :model-value="isVisible"
        width="80%"
        destroy-on-close
        align-center
        @close="hideModal"
        :style="{maxWidth:'600px'}"
    >
        <div class="flex flex-col justify-center   gap-8">
            <div class="font-semibold flex flex-col gap-4">
                <span>Deck Name</span>
                <el-input v-model="nameRef" />
            </div>
            <div class="font-semibold flex flex-col gap-4">
                <span>Deck Description</span>
                <el-input v-model="descRef" />
            </div>
            <div class="flex justify-between">
                <el-button @click="hideModal">Cancle</el-button>
                <el-button type="success" @click="postDeck">Confirm</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { Deck} from '~/types/types'

import _ from 'lodash'
import {useDeckApi} from '~/composables/useDeckApi'

interface DeckList {
  decksData: any; // or a more specific type if you have it
  updateDeckList: (decks: Deck[]) => void; // adjust the function signature as needed
}
    const {isVisible} = defineProps(['isVisible'])
    const emit = defineEmits(['hideModal'])
    const nameRef = ref("")
    const descRef = ref("")

    const {decksData, updateDeckList} = inject('deckList') as DeckList
    const {createDeck} = useDeckApi()
    const hideModal = () => {
        emit('hideModal')
    }

    const checkName = () => {
        if(!nameRef.value) {
            ElNotification({
                title: 'Warning',
                message: 'Deck name required',
                type: 'warning',
            })
            return false;
        }
        return true
    }

    const postDeck = async () => {
        if(!checkName()) return;
        const {data, error} = await createDeck(nameRef.value, descRef.value)
        if(data.value) {
            addDeckToList(data.value.body)
        }
        if(error.value) {
            ElMessage({
                type: 'warning',
                message: error.value.statusMessage
            })
        }
    }

    const addDeckToList = (deck: Deck) => {
        const decksTemp = _.cloneDeep(decksData.value)
        decksTemp.push(deck)
        updateDeckList(decksTemp)
        hideModal()
    }
</script>
<style lang="">
    
</style>