<template lang="">
    <ClientOnly>
        <div @click="toggleMenue" class="fixed bottom-10 right-1/2 md:right-10 translate-x-1/2 w-16 h-16 rounded-full flex justify-center items-center">
            <div class=" bg-blue-400 cursor-pointer rounded-full flex justify-center items-center button-add absolute inset-0 z-10"></div>
                <div class="absolute -translate-y-full md:-translate-x-3/4 md:-translate-y-1/4" :style="{'display': (visible ? 'block' : 'none')}">
                    <div class="bg-white shadow-md border-2 border-slate-200 shadow-slate-200 text-center w-36 font-semibold text-sm relative items-box md:before:hidden after:hidden md:after:block">
                        <div class="py-3" @click.stop="showDeckModal">
                            AddDeck
                        </div>
                        <hr/>
                        <div class="py-3" @click.stop="showCardModal">
                            AddCard
                        </div>
                        <div class="py-3" @click.stop="showVerbModal">
                            AddVerb
                        </div>
                    </div>
                </div>
        </div>
        <AddDeckModal :isVisible="deckModalVisible" @hideModal="hideDeckModal" />
        <AddCardModal :isVisible="cardModalVisible" @hideModal="hideCardModal"/>
        <AddVerbModal :isVisible="verbModalVisible" @hideModal="hideVerbModal"/>
    </ClientOnly>

</template>
<script setup lang="ts">
import {customFetch} from '~/utils/customFetch'
    const visible = ref(false)
    const deckModalVisible = ref(false)
    const cardModalVisible = ref(false)
    const verbModalVisible = ref(false)
    
    const toggleMenue = () => {
        visible.value = !visible.value
    }
    const showDeckModal = () => {
        deckModalVisible.value = true
        toggleMenue()
    }

    const hideDeckModal = () => {
        deckModalVisible.value = false
    }

    const showCardModal = () => {
        cardModalVisible.value = true
        toggleMenue()
    }

    const hideCardModal = () => {
        cardModalVisible.value = false
    }

    const showVerbModal = () => {
        verbModalVisible.value = true
        toggleMenue()
    }

    const hideVerbModal = () => {
        verbModalVisible.value = false
    }
</script>
<style lang="css" scoped>
    .items-box::before {
        content:"";
        position: absolute;
        bottom: 0%;
        width: 0;
        height: 0;
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
        border-top: 8px solid #FFF;
        left: 50%;
        transform: translateX(-50%) translateY(100%);
    }

    .items-box::after {
        content:"";
        position: absolute;
        right: 0;
        top: 50%;
        width: 0;
        height: 0;
        border-left: 8px solid #fff;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        transform: translateY(-50%) translateX(100%);
    }
    .button-add::before {
        content: "";
        position: absolute;
        width: 1.5rem;
        height: 0.25rem;
        background: #fff;
    }
    .button-add::after {
        content: "";
        position: absolute;
        height: 1.5rem;
        width: 0.25rem;
        background: #fff;
    }
</style>