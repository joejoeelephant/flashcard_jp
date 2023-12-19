<template lang="">
    <el-dialog
        :model-value="isVisible"
        fullscreen
        destroy-on-close
        center
        @close="hideModal"
    >
        <div class="flex flex-col justify-center items-center h-[70vh] gap-8">
            <p class="text-3xl font-semibold">
                {{cardData.back}}
            </p>
            <p class="text-3xl font-semibold">
                {{cardData.frontPronunciation}}
            </p>
            <p class="text-3xl font-semibold">
                {{cardData.frontCharacter}}
            </p>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
    const { isVisible, cardData } = defineProps(['isVisible', 'cardData']); // Renamed for clarity
    const emit = defineEmits(['hideModal'])

    const hideModal = () => {
        emit('hideModal')
    }
</script>
<style lang="">
    
</style>