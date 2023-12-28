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
                <div class="font-semibold flex flex-col gap-4">
                    <span>Deck Name</span>
                    <el-input v-model="nameRef" type="text" />
                </div>
                <div class="font-semibold flex flex-col gap-4">
                    <span>Deck Description</span>
                    <el-input v-model="descRef" type="text"/>
                </div>
                <div class="flex justify-between">
                    <el-button @click="hideModal">Cancle</el-button>
                    <el-button type="success" @click="putDeck">Confirm</el-button>
                </div>
            </div>
        </el-dialog>
    </ClientOnly>
</template>
<script setup lang="ts">
import {useDeckApi} from '~/composables/useDeckApi'
    const props =  defineProps(['isVisible', 'deckData']);
    const emit = defineEmits(['hideModal'])
    const nameRef = ref('')
    const descRef = ref('') 
    const {updateDeck} = useDeckApi()
    watch(
        () => props.deckData,  // <-- watching deckData
        (newVal) => {
            if(!newVal) return
            nameRef.value = newVal.name;
            descRef.value = newVal.description;
        },
        { immediate: true, deep: true }
    );

    const hideModal = () => {
        emit('hideModal')
    }

    const checkName = () => {
        if(!nameRef.value) {
            ElNotification({
                title: 'Warning',
                message: 'Deck name required',
                type: 'warning',
            })
            return false;
        }
        return true
    }

    const putDeck = async () => {
        if(!checkName()) return;
        const {data, error} = await updateDeck(props.deckData.id, nameRef.value, descRef.value)

        if(data.value) {
            ElMessage({
                type: 'success',
                message: 'deck updated'
            })
        }

        if(error.value) {
            ElMessage({
                type: 'warning',
                message: error.value.statusMessage
            })
        }
    }
</script>
<style lang="">
    
</style>