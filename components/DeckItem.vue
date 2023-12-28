<template lang="">
    <div class="rounded overflow-hidden p-4 shadow-lg shadow-slate-300 bg-white">
        <div class="flex flex-col gap-4">
            <div class="font-semibold flex justify-between">
                <span>
                    {{deckData.name}}
                </span>
                <div :class="`w-4 h-4 border-b-2 border-l-2 md:hidden border-slate-500 ${showInfo ? 'rotate-[135deg]' : '-rotate-45'}`" @click="toggle"></div>
            </div>
            <div class="text-sm text-slate-500">
                {{timeGap >= 0 ? `Last preview ${timeGap} days ago` : "" }}
            </div>
            <div class="flex gap-4 flex-wrap">
                <el-tag
                    type='warning'
                    class="mx-1"
                    effect="dark"
                >
                    {{state.newCards}} New
                </el-tag>
                <el-tag
                    type='success'
                    class="mx-1"
                    effect="dark"
                >
                    {{state.learningCards}} Learning
                </el-tag>
                <el-tag
                    type=''
                    class="mx-1"
                    effect="dark"
                >
                    {{state.reviewingCards}} Reviewing
                </el-tag>
            </div>
            <div :class="`py-4 overflow-hidden ${showInfo ? 'md:block' : 'hidden md:block'}`">
                <div class="border-t-2 border-b-2 border-slate-200 py-4">
                    <div class="grid grid-cols-3">
                        <div>
                            Studied today
                        </div>
                        <div class="font-semibold text-center">
                            {{state.cardsStudiedToday}}
                        </div>
                        <div>
                            Cards
                        </div>
                    </div>
                    <div class="grid grid-cols-3 mt-2">
                        <div>
                            New Cards
                        </div>
                        <div class="font-semibold text-center">
                            {{state.newCards}}
                        </div>
                        <div>
                            Cards
                        </div>
                    </div>
                </div>
                <div class="flex justify-between mt-4 text-slate-600 items-center">
                    <div>
                        <el-link :href="`/cards/${deckData.id}`" class="mr-4">view</el-link>
                        <el-link :href="`/assistant/${deckData.id}`" class="mr-4">assistant</el-link>
                        <el-button @click="showEditModal">edit</el-button>
                    </div>
                    <span>
                        <el-button type="primary" @click="gotoLearn">learn</el-button>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useCardState } from '~/composables/useCardState'
    import { useTimeGapCalculator } from '~/composables/useTimeGapCalculator'

    const {deckData} = defineProps(['deckData'])
    const emit = defineEmits(['showEditModal'])
    const router = useRouter()
    const showInfo = ref(false)
    const { state, fetchCardState } = useCardState()
    const { timeGap, calculateTimeGap } = useTimeGapCalculator()
    await fetchCardState(deckData.id)

    if(deckData.lastReviewed) {
        calculateTimeGap(deckData.lastReviewed)
    }

    const toggle = () => {
        showInfo.value = !showInfo.value
    }
    const showEditModal = () => {
        emit('showEditModal', deckData)
    }
    const gotoLearn = () => {
        router.push({path: `/learn/${deckData.id}`})
    }
</script>
<style lang="">
    
</style>