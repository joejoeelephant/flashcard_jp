<template lang="">
    <el-card class="mb-8 cursor-pointer aspect-square" >
        <template #header>
            <div class="flex justify-end">
                <el-button class="button" :icon="Edit" @click.stop="showModal"></el-button>
            </div>
        </template>
        <div class="w-full h-full flex flex-col justify-center items-center pt-4">
            {{cardData.front}}
        </div>

        <!-- <div class="flex flex-wrap gap-4">
            <el-tag v-for="(item , index) in cardData.tags">{{item.name}}</el-tag>
        </div> -->
        <EditCardModal :isVisible="modalVisible" :cardData="cardData" @hideModal="hideModal"/>
    </el-card>
</template>
<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue';
const { cardData } = defineProps(['cardData'])

const modalVisible = ref(false)

const showModal = () => {
    modalVisible.value = true
    console.log(123)
}

const hideModal = () => {
    modalVisible.value = false
}

</script>
<style lang="">
    
</style>