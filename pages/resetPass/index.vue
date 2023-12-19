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
            <h1 class="font-bold text-2xl text-slate-700">Reset Password</h1>
            
            <el-form-item label="Password" prop="pass1" class="w-full">
                <el-input v-model="ruleForm.pass1" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item label="Repeat Password" prop="pass2" class="w-full">
                <el-input v-model="ruleForm.pass2" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :disabled="loading" @click="submitForm(ruleFormRef)">Confirm</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
    import type { FormInstance, FormRules } from 'element-plus'
    import { reactive, ref } from 'vue'

    definePageMeta({
        layout: 'login',
        middleware: ["auth"]
    })
    const isVisible = ref(false)
    const loading = ref(false)
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
        pass1: '',
        pass2: '',
    })

    const validatePass1 = (rule: any, value: any, callback: any) => {
        if (value.trim() === '') {
            callback(new Error('Please input the password'))
        } else {
            callback()
        }
    }

    const validatePass2 = (rule: any, value: any, callback: any) => {
        if (value.trim() !== ruleForm.pass1) {
            callback(new Error('Password word not match'))
        } else {
            callback()
        }
    }

    const rules = reactive<FormRules<typeof ruleForm>>({
        pass1: [{ validator: validatePass1, trigger: 'blur' }],
        pass2: [{ validator: validatePass2, trigger: 'blur' }],
    })

    const resetPassword = async () => {
        const {pass1, pass2} = ruleForm
        console.log(pass1, pass2)
        loading.value = true
        const {data, pending, error, refresh} = await useFetch("/api/password", {
            method: 'put',
            body: {password: pass1.trim()}
        })
        loading.value = false
        if(data.value?.statusCode === 200) {
            navigateTo('/login')
        }
        console.log(data.value)
        console.log(error.value)
    }

    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                resetPassword()
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