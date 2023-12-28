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
                    <el-button type="primary" @click="handleCheckAnswer">confirm</el-button>
                </div>
            </div>
        </el-dialog>
    </ClientOnly>  
</template>
<script setup lang="ts">
    import { useSecurityQuestion } from '~/composables/useSecurityQuestion';
    const props = defineProps(['isVisible'])
    const emits = defineEmits(['hideModal'])
    const answer = ref("")
    const {question, fetchQuestion, checkAnswer} = useSecurityQuestion()
    await fetchQuestion()

    const handleCheckAnswer = async () => {
        const {data, error} = await checkAnswer(answer.value)
        if(data.value) {
            navigateTo('/resetPass')
        }
        if(error.value) {
            ElMessage({
                message: error.value.statusMessage,
                type: 'warning'
            })
        }
    }

    const hideModal = () => {
        emits('hideModal')
    }

</script>
<style lang="">
    
</style>