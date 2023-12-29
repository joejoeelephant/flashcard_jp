<template lang="">
    <div class="flex-1 flex justify-center items-center">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            status-icon
            label-position="top"
            class="bg-white p-8 flex flex-col justify-center items-center w-80 gap-4 rounded-lg shadow-lg shadow-slate-300 "
        >
            <h1 class="font-bold text-2xl text-slate-700">SignUp</h1>
            <el-form-item label="Email" prop="email" class="w-full">
                <el-input v-model.email="ruleForm.email" />
            </el-form-item>
            
            <el-form-item label="Password" prop="pass1" class="w-full">
                <el-input v-model="ruleForm.pass1" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item label="Repeat Password" prop="pass2" class="w-full">
                <el-input v-model="ruleForm.pass2" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :disabled="loading" @click="submitForm(ruleFormRef)">Submit</el-button>
                <el-button :disabled="loading" @click="resetForm(ruleFormRef)">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
    import type { FormInstance, FormRules } from 'element-plus'
    import { reactive, ref } from 'vue'
    import { validateEmail, validatePass, validatePass2 } from '~/composables/useValidation';

    definePageMeta({
        layout: 'login'
    })

    const token = useCookie('token')
    token.value = ""

    const loading = ref(false)
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
        pass1: '',
        pass2: '',
        email: 'admin@qq.com',
    })

    const validatePass1 = validatePass
    let ValidatePass2;

    watch(() => ruleForm.pass1, (newVal) => {
        ValidatePass2 = validatePass2(newVal)
    })



    const rules = reactive<FormRules<typeof ruleForm>>({
        pass1: [{ validator: validatePass1, trigger: 'blur' }],
        pass2: [{ validator: ValidatePass2, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
    })

    const requestSignUp = async () => {
        const {email, pass1, pass2} = ruleForm
        loading.value = true
        const {data, pending, error, refresh} = await useFetch("/api/signup", {
            method: 'post',
            body: {email, password: pass1.trim()}
        })
        loading.value = false
        if(data.value?.statusCode === 200) {
            navigateTo('/secureQuestion')
        }
        console.log(data.value)
        console.log(error.value)
    }

    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        console.log(ruleForm.pass1)

        formEl.validate((valid) => {
            if (valid) {
                requestSignUp()
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

    const clearUsers = async () => {
        const {data, error} = await useFetch("/api/users", {
            method: 'delete'
        })
        console.log(data.value)
        console.log(error.value)
    }
</script>
<style lang="">
    
</style>