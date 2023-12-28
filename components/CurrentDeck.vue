<template lang="">
    <div class="rounded-lg overflow-hidden flex justify-between items-center p-4 gap-8 shadow-md shadow-slate-200 md:w-1/2 mx-auto bg-white">
        <div class="flex flex-col gap-2">
            <p class="font-semibold">{{deckData.name}}</p>
            <p class="text-sm text-slate-500">
                You have learned {{state.reviewingCards + state.learningCards}} words
            </p>
            <div class="flex flex-wrap">
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
                    class="mx-1 mt-1 md:mt-0"
                    effect="dark"
                >
                    {{state.reviewingCards}} Reviewing
                </el-tag>
            </div>
            <div>
                <el-button type="primary" @click="gotoLearn">continue learning</el-button>
            </div>
        </div>
        <div class="w-1/3 md:w-32">
            <div class="w-full aspect-square overflow-hidden relative rounded-full bg-slate-200 text-blue-500 flex justify-center items-center deck-progress" :style="{'--percent': `${percent}%`}">
                <span class="relative z-10 text-blue-500 text-xl font-bold">{{percent}}%</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useCardState } from '~/composables/useCardState'

    const {deckData} = defineProps(['deckData'])
    const router = useRouter()
    const { state, fetchCardState } = useCardState()
    await fetchCardState(deckData.id)

    let percent = Math.ceil((Number(state.value.reviewingCards) + Number(state.value.learningCards)) / (Number(state.value.newCards) + Number(state.value.learningCards) + Number(state.value.reviewingCards)) * 100)
    percent = isNaN(percent) ? 0 : percent
    
    const gotoLearn = () => {
        router.push({path: `/learn/${deckData.id}`})
    }
</script>
<style lang="css">
    .deck-progress::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        --themeColor: rgb(59 130 246 );
        background: repeating-conic-gradient(from 0, var(--themeColor) 0%, var(--themeColor) var(--percent) , transparent var(--percent), transparent 100%);
    }
    .deck-progress::after {
       content: "";
       position: absolute;
       inset: 0.5rem;
       border-radius: 50%;
       background-color: #fff;
    }
</style>