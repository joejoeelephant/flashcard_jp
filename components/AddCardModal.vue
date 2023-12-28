<template lang="">
    <el-dialog
        :model-value="isVisible"
        width="80%"
        destroy-on-close
        align-center
        @close="hideModal"
        :style="{maxWidth:'600px'}"
    >
        <div class="flex flex-col md:flex-row">
            <div class="flex-1">
                <el-form
                    ref="cardFormRef"
                    :model="cardForm"
                    :rules="rules"
                    status-icon
                    label-position="top"
                    class="flex flex-col justify-center items-center gap-4 "
                >
                    <el-form-item label="Decks" prop="deckId" class="w-full">
                        <el-select v-model="cardForm.deckId" placeholder="please select a deck">
                            <el-option v-for="(item, index) in decks" ::key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Front" prop="front" class="w-full">
                        <el-input v-model="cardForm.front" />
                    </el-form-item>
                    <el-form-item label="frontCharacter" prop="frontCharacter" class="w-full">
                        <el-input v-model="cardForm.frontCharacter" readonly />
                    </el-form-item>
                    <el-form-item label="frontPronunciation" prop="frontPronunciation" class="w-full">
                        <el-input v-model="cardForm.frontPronunciation" readonly />
                    </el-form-item>
                    <el-form-item label="Back" prop="back" class="w-full">
                        <el-input v-model="cardForm.back" />
                    </el-form-item>
                    
                </el-form>
            </div>
            <div class="m-2 p-1 border-2 border-slate-200 md:w-3/6">
                <div class="font-bold">
                    Back List:
                </div>
                <ul class="flex flex-col gap-2">
                    <li v-for="(item, index) in backList.splice(0, 10)" :key="index">
                        <div class="flex justify-between items-center border-b-2 border-slate-200">
                            <div>
                                <div>
                                    {{item.character}}
                                </div>
                                <div>
                                    {{item.meaning}}
                                </div>
                            </div>
                            <el-button @click="setBack(item.meaning)">choose</el-button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex justify-between">
            <el-button @click="hideModal">Cancle</el-button>
            <el-button type="primary" :loading="jiShoLoading" @click="fetch_JISHO">Search</el-button>
            <el-button type="success" :loading="postLoading" @click="confirmForm(cardFormRef)">Confirm</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type {Card} from  '~/types/types'
import * as wanakana from 'wanakana';
import _ from 'lodash';
import { useDecksFetcher } from '~/composables/useDecksFetcher';
import { useCardApi } from '~/composables/useCardApi';

interface ApiJISHOResponse {
    body: {character: string, meaning: string}[]
    statusCode: number;
    statusMessage: string;
}

    const props = defineProps(['isVisible'])
    const emit = defineEmits(['hideModal'])
    const selectLoading = ref(false)
    const jiShoLoading = ref(false)
    const postLoading = ref(false)
    const cardFormRef = ref<FormInstance>()
    const backList = ref<{character: string, meaning: string}[]>([])
    const {fetchDecks, decks} = useDecksFetcher()
    await fetchDecks()
    const {createCard} = useCardApi()
    const cardForm = reactive<Card>({
        front: '',
        back: '',
        deckId: '',
        frontCharacter: '',
        frontPronunciation: '',
    });

    const setBack = (meaning: string) => {
        cardForm.back = meaning
    }

    const fetch_JISHO = async () => {
        if(jiShoLoading.value) return;
        jiShoLoading.value = true
        const {data} = await useFetch<ApiJISHOResponse, any>(`/api/JiSho`, {
            query: {keyword: cardForm.front}
        })
        jiShoLoading.value = false
        cardForm.frontCharacter = data.value?.body[0].character
        cardForm.back = data.value?.body[0].meaning as string
        backList.value = data.value?.body || []
        console.log(data.value?.body)
    }
   

    watch(() => cardForm.frontCharacter, (newVal) => {
        cardForm.frontPronunciation = wanakana.toRomaji(newVal as string)
    })

    const rules = reactive<FormRules<typeof cardForm>>({
        front: [{ required: true, message: 'Please input front', trigger: 'blur' }],
        back: [{ required: true, message: 'Please input back', trigger: 'blur' }],
        deckId: [{ required: true, message: 'Please select deck id', trigger: 'change', }],
    })

    const confirmForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                console.log(cardForm)
                postCard()
            } else {
            console.log('error submit!')
                return false
            }
        })
    }

    const postCard = async () => {
        if(postLoading.value) return;
        postLoading.value = true
        const cardData = _.cloneDeep(cardForm);//this is necessary
        const {data, error} = await createCard(cardData)
        postLoading.value = false
        resetForm()
        if(data.value) {
            ElNotification({
                title: 'success',
                message: "add card successfully",
                type: 'success',
            })
            console.log(data.value)

        }

        if(error.value) {
            ElNotification({
                title: 'error',
                message: error.value?.statusMessage,
                type: 'warning',
            })
        }
    }

    const resetForm = () => {
        if (!cardFormRef) return
        cardFormRef.value?.resetFields()
    }

    const hideModal = () => {
        emit('hideModal')
    }

</script>
<style lang="">
    
</style>