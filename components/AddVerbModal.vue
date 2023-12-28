<template lang="">
    <el-dialog
        :model-value="isVisible"
        width="80%"
        destroy-on-close
        align-center
        @close="hideModal"
        :style="{maxWidth:'600px'}"
    >
        <div>
            <el-select v-model="deckId" placeholder="please select a deck">
                <el-option v-for="(item, index) in decks" ::key="index" :label="item.name" :value="item.id" />
            </el-select>
            <div class="mt-8">
                <el-input v-model="verbData" placeholder="input verb"/>
            </div>
            <div class="mt-8 flex items-center">
                <el-button type="primary" @click="addVerb" :loading="postLoading">AddVerb</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import _ from 'lodash';
import { useDecksFetcher } from '~/composables/useDecksFetcher';
import { useVerbApi } from '~/composables/useVerbApi';

    const {isVisible} = defineProps(['isVisible'])
    const emit = defineEmits(['hideModal'])
    const deckId = ref('')
    const postLoading = ref(false)
    const verbData = ref("")
    const {decks, fetchDecks} = useDecksFetcher()
    const {createVerb} = useVerbApi()
    await fetchDecks()

    const addVerb = async () => {
        if(!deckId.value) {
            ElMessage({
                message: "deckId undefined",
                type: 'warning'
            })
            return;
        }
        if(!verbData.value) {
            ElMessage({
                message: "verb undefined",
                type: 'warning'

            })
            return;
        }
        postLoading.value = true
        const {data,error} = await createVerb(Number(deckId.value), verbData.value)

        
        postLoading.value = false
        if(data.value) {
            ElMessage({
                showClose: true,
                message: 'Ver added success',
                type: 'success'
            })

        }
        if(error.value) {
            ElMessage({
                message: error.value.statusMessage,
                type: 'warning'

            })
        }

    }

    const hideModal = () => {
        emit('hideModal')
    }

</script>
<style lang="">
    
</style>