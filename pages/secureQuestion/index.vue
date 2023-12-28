<template lang="">
    <div class="flex-1 flex flex-col justify-center items-center">
        <div class="bg-white p-8 flex flex-col justify-center items-center w-11/12 md:w-[480px] gap-4 rounded-lg shadow-lg shadow-slate-300">
            <div class="w-full relative">
                <el-select v-model="question" class="w-full" placeholder="Select Question" size="large">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>
            <div class="w-full">
                
                <div>
                    <el-input v-model="answer" placeholder="Please input anwer" size="large"/>
                </div>
            </div>
            <div>
                <el-button @click="confirm" type="primary" :loading="loading">Confirm</el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    definePageMeta({
        layout: 'login',
        middleware: ["auth"]
    })
    const options = [
        {
            value: 'What is your favorite book?',
            label: 'What is your favorite book?',
        },
        {
            value: 'What is your mother maiden name?',
            label: 'What is your mother maiden name?',
        },
        {
            value: 'What was your first school?',
            label: 'What was your first school?',
        }
    ]
    const question = ref("")
    const answer = ref("")
    const loading = ref(false)
    const confirm = async () => {
        loading.value = true
        const {data, error} = await useFetch('/api/securityQuestion', {
            method: 'put',
            body: {
                securityQuestion: question.value,
                securityAnswer: answer.value
            }
        })
        loading.value = true
        navigateTo('/')
        console.log(data.value)
        console.log(error.value)
    }
</script>
<style lang="">
    
</style>