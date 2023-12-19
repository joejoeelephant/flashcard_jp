<template lang="">
    <ClientOnly>
        <el-dialog
            :model-value="isVisible"
            width="80%"
            destroy-on-close
            align-center
            @close="hideModal"
            :style="{maxWidth:'600px'}"
        >
            <div class="flex flex-col justify-center   gap-8">
                <p>
                    Question: {{question}}
                </p>
                <div>
                    <el-input v-model="answer" placeholder="Please input anwer" size="large"/>
                </div>
                <div class="flex justify-center">
                    <el-button type="primary" @click="sendAnswer">confirm</el-button>
                </div>
            </div>
        </el-dialog>
    </ClientOnly>  
</template>
<script setup lang="ts">
import {customFetch} from '~/utils/customFetch'

    const props = defineProps(['isVisible'])
    const emits = defineEmits(['hideModal'])
    const question = ref("")
    const answer = ref("")

    const getQuestion = async () => {
        const {data, error} = await customFetch<any, any>('/api/securityQuestion', {method: 'get'})
        if(data.value) {
            question.value = data.value.body.securityQuestion
        }
        console.log(data.value)
        console.log(error.value)
    }

    await getQuestion()

    const sendAnswer = async () => {
        const {data, error} = await customFetch<any, any>('/api/securityQuestionCheck', {
            method: 'post',
            body: {
                answer: answer.value
            }
        })
        if(data.value) {
            navigateTo('/resetPass')
        }
        console.log(data.value)
        console.log(error.value)
    }

    const hideModal = () => {
        emits('hideModal')
    }

</script>
<style lang="">
    
</style>