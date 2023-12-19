<template lang="">
    <div class="flex-1 flex flex-col justify-center items-center">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            status-icon
            label-position="top"
            class="bg-white p-8 flex flex-col justify-center items-center w-80 gap-4 rounded-lg shadow-lg shadow-slate-300 "
        >
            <h1 class="font-bold text-2xl text-slate-700">Login</h1>
            <el-form-item label="Email" prop="email" class="w-full">
                <el-input v-model.email="ruleForm.email" />
            </el-form-item>
            
            <el-form-item label="Password" prop="pass" class="w-full">
                <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :disabled="loading" @click="submitForm(ruleFormRef)">Submit</el-button>
                <el-button :disabled="loading" @click="resetForm(ruleFormRef)">Reset</el-button>
            </el-form-item>
            <div >
                <el-button size="small" link @click="showModal">Forget Password?</el-button>
            </div>
        </el-form>
        <SecurityQuestionModal :isVisible="isVisible" @hideModal="hideModal"/>
    </div>
</template>
<script setup lang="ts">
    import type { FormInstance, FormRules } from 'element-plus'
    import { reactive, ref } from 'vue'

    definePageMeta({
        layout: 'login'
    })
    const token = useCookie('token')
    token.value = ""
    const isVisible = ref(false)
    const loading = ref(false)
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
        pass: '',
        email: '',
    })

    const showModal = () => {
        isVisible.value = true
    }

    const hideModal = () => {
        isVisible.value = false
    }

    const validateEmail = (rule: any, value: any, callback: any) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (value === '') {
            callback(new Error('Please input the email'))
        } else {
            if (!regex.test(value)) {
                callback(new Error('Please input the valid email'))
                
            }
            callback()
        }
    }

    const validatePass = (rule: any, value: any, callback: any) => {
        if (value.trim() === '') {
            callback(new Error('Please input the password'))
        } else {
            callback()
        }
    }

    const rules = reactive<FormRules<typeof ruleForm>>({
        pass: [{ validator: validatePass, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
    })

    const requestLogin = async () => {
        const {email, pass} = ruleForm
        loading.value = true
        const {data, pending, error, refresh} = await useFetch("/api/login", {
            method: 'post',
            body: {email, password: pass.trim()}
        })
        loading.value = false
        if(data.value?.statusCode === 200) {
            navigateTo('/')
        }
    }

    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                requestLogin()
            } else {
                console.log('error submit!')
                return false
            }
        })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }
</script>
<style lang="">
    
</style>