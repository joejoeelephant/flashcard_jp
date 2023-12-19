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
                <span>Card Front</span>
                <el-input type="text" readonly :value="props.cardData.front"/>
            </div>
            <div class="font-semibold flex flex-col gap-4">
                <span>Card Front frontCharacter</span>
                <el-input type="text" readonly :value="props.cardData.frontCharacter"/>
            </div>
            <div class="font-semibold flex flex-col gap-4">
                <span>Card Back</span>
                <el-input type="text" readonly :value="props.cardData.back"/>
            </div>
            <div class="font-semibold flex flex-col gap-4">
                <span>Card exampleSentence</span>
                <el-input type="text" v-model="exampleSentence"/>
            </div>
            <div class="flex justify-between">
                <el-button @click="hideModal">Cancle</el-button>
                <el-button type="success" @click="updateCard">Confirm</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import {customFetch} from '~/utils/customFetch'
import { ElNotification } from 'element-plus'

    // const {isVisible, cardData} =  defineProps(['isVisible', 'cardData']);
    const props =  defineProps(['isVisible', 'cardData']);
    
    const emits = defineEmits(['hideModal'])

    const exampleSentence = ref<string>("")

    watch(() => props.isVisible, (newVal) => {
        if(newVal) exampleSentence.value = props.cardData.exampleSentence
    })

    const hideModal = () => {
        emits('hideModal')
        exampleSentence.value = ""
    }

    const updateCard = async () => {
        const {data, error} = await customFetch<any, any>('/api/card', {
            method: 'put',
            body: {
                id: props.cardData.id,
                cardData: {
                    exampleSentence: exampleSentence.value
                }
            }
        })
        if(data.value) {
            ElNotification({
                title: 'success',
                message: "update card successfully",
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
</script>
<style lang="">
    
</style>