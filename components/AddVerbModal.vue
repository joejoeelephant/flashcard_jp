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
                <el-option v-for="(item, index) in decksSelect" ::key="index" :label="item.name" :value="item.id" />
            </el-select>
            <div class="mt-8">
                <el-input v-model="verbValue" placeholder="input verb"/>
            </div>
            <div class="mt-8 flex items-center">
                <el-button type="primary" @click="addVerb" :loading="postLoading">AddVerb</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type {Card} from  '~/types/types'
import * as wanakana from 'wanakana';
import {customFetch} from '~/utils/customFetch'
import _ from 'lodash';

    interface Deck {
        id: string;
        name: string;
        description: string;
    }

    interface ApiDeckResponse {
        body: Deck[];
        statusCode: number;
        statusMessage: string;
    }

    const {isVisible} = defineProps(['isVisible'])
    const emit = defineEmits(['hideModal'])
    const decksSelect = ref<Deck[]>([])
    const deckId = ref('')
    const selectLoading = ref(false)
    const postLoading = ref(false)
    const verbValue = ref("")
    
    const initDeckSelect = async () => {
        const {data} = await customFetch<ApiDeckResponse, any>('/api/decks')
        const decks = data.value?.body
        decks && (decksSelect.value = decks)
    }
    initDeckSelect();

    const addVerb = async () => {
        if(!deckId.value) {
            ElMessage({
                message: "deckId undefined",
                type: 'warning'
            })
            return;
        }
        if(!verbValue.value) {
            ElMessage({
                message: "verb undefined",
                type: 'warning'

            })
            return;
        }
        postLoading.value = true
        const {data,error} = await customFetch<any, any>('/api/assistantVerb', {
            method: 'post',
            body: {
                deckId: deckId.value,
                verb: verbValue.value
            }
        })
        postLoading.value = false
        if(data.value) {
            ElMessage({
                showClose: true,
                message: 'Ver added success',
                type: 'success'
            })
        }

        console.log(data.value.body)
        console.log(error.value)
    }

    const hideModal = () => {
        emit('hideModal')
    }

</script>
<style lang="">
    
</style>