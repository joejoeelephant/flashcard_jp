<template lang="">
     <ClientOnly>
        <el-dialog
            :model-value="isVisible"
            width="80%"
            destroy-on-close
            align-center
            @close="hideModal"
        >
            <div class="h-[320px] overflow-y-scroll flex">
                <div>
                    <el-radio-group v-model="verbRadio" class="grid grid-cols-1" :style="{'display': 'grid'}">
                        <el-radio v-for="(item, index) in verbs" :key="index" :label="item.base" />
                    </el-radio-group>
                </div>
                <div class="flex-1 ">
                    <div v-for="(item, index) in verbs" :key="index" class="grid grid-cols-6 h-8 pt-1 border-b-2 border-slate-100">
                        <span>
                            {{item.nai}}
                        </span>
                        <span>
                            {{item.masu}}
                        </span>
                        <span>
                            {{item.base}}
                        </span>
                        <span>
                            {{item.ba}}
                        </span>
                        <span>
                            {{item.volitional}}
                        </span>
                        <span>
                            {{item.te}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-4">
                <div><el-button @click="explaine">explaine</el-button></div>
                <div><el-button @click="negativeForm">negativeForm</el-button></div>
                <div><el-button @click="conditionalForm">conditionalForm</el-button></div>
                <div><el-button @click="volitionalForm">volitionalForm</el-button></div>
                <div><el-button @click="teForm">teForm</el-button></div>

            </div>
        </el-dialog>
     </ClientOnly>
</template>
<script setup lang="ts">
import { useVerbsFetcher } from '~/composables/useVerbsFetcher';


    const props =  defineProps(['isVisible']);
    const emits = defineEmits(['hideModal', 'sendMessage'])
    const route = useRoute()
    const [deckId] = route.params.slug
    const verbRadio = ref('')
    const currentVerb = ref<any>(null)
    const { verbs, loading, fetchVerbs } = useVerbsFetcher()
    await fetchVerbs(Number(deckId))

    watch(() =>  verbRadio.value, (newVal) => {
        const data = verbs.value.find(el => el.base === newVal)
        currentVerb.value = data
    })

    const hideModal = () => {
        emits('hideModal')
    }

    const explaine = () => {
        if(!currentVerb.value) return
        const text = `Let's focus on the verb '${currentVerb.value.base}' which means '${currentVerb.value.meaning}.' 
                    Could you first give a brief explanation of its general use in Japanese?`
        emits('sendMessage', text)
    }

    const negativeForm = () => {
        if(!currentVerb.value) return
        const text = `Provide some example sentences using the form '${currentVerb.value.nai}' of '${currentVerb.value.base}.' 
                        Include English translations and describe the contexts where this form is used.
                        Each example sentence with romaji after it.
                        `
        console.log(text)
        emits('sendMessage', text)
    }

    const conditionalForm = () => {
        if(!currentVerb.value) return
        const text = `Show some example sentences using the form '${currentVerb.value.ba}' of '${currentVerb.value.base}.' 
        Translate them into English and explain the scenarios in which this form is applicable.Each example sentence with romaji after it.`
        console.log(text)
        emits('sendMessage', text)
    } 

    const volitionalForm = () => {
        if(!currentVerb.value) return
        const text = `Create some example sentences using the form '${currentVerb.value.volitional}' of '${currentVerb.value.base}.'
                    What are the contexts for using this form? Please also include English translations.Each example sentence with romaji after it.`
        console.log(text)
        emits('sendMessage', text)
    }

    const teForm = () => {
        if(!currentVerb.value) return
        const text = `Create some example sentences using the form '${currentVerb.value.te}' of '${currentVerb.value.base}.'
                    Describe how this form is typically used in Japanese and provide translations for each sentence.
                    Each example sentence with romaji after it.`
        console.log(text)
        emits('sendMessage', text)
    }

</script>
<style lang="">
    
</style>