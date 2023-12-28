<template lang="">
    <div class="border-b-2 border-slate-200 flex justify-between ">
        <el-select v-model="deckId" class="m-2" placeholder="Select" size="large" :loading="loading">
            <el-option label="All" value="" />
            <el-option
                v-for="item in decks"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
        </el-select>
        <div class="self-center flex gap-4">
            <el-input v-model="frontText" placeholder="front search"  class="w-32 " :style="{width: '220px'}"/>
            <el-input v-model="backText" placeholder="back search"  class="w-32 " :style="{width: '220px'}"/>
            <el-button type="primary" @click.prevent="filterHandler">Search</el-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { useDecksFetcher } from '~/composables/useDecksFetcher'

    interface Filter {
        deckId: string,
        frontText: string,
        backText: string
    }

    const {filter} = defineProps({
        filter: Object as PropType<Filter>
    })
    const emits = defineEmits(['setFilter'])
    const deckId = ref('')
    const frontText = ref('')
    const backText = ref('')

    const {loading, decks, fetchDecks } = useDecksFetcher()
    fetchDecks();

    deckId.value = filter?.deckId || ""
    frontText.value = filter?.frontText || ""
    backText.value = filter?.backText || ""

    watch(() => deckId.value, () => {
        filterHandler()
    })


    const filterHandler = () => {
        const payload = {
            deckId: deckId.value,
            frontText: frontText.value.trim(),
            backText: backText.value.trim()
        }
        emits('setFilter', payload)
    }
</script>
<style lang="">
    
</style>