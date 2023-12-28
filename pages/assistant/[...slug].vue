<template lang="">
    <div class="container mx-auto bg-white p-4">
        <div class='flex justify-between'>
            <div ref="scrollContainer" class="h-[70vh] md:h-[68vh] overflow-y-scroll bg-blue-100 flex-1">
                <ul>
                    <li v-for="(item, index) in messages" :key="index" :class="`p-8 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-slate-100'} border-b-2 border-slate-300`">
                        <div class="self-start font-bold pb-8 text-xl">
                            {{index % 2 === 0 ? 'user' : 'assistant'}}:
                        </div>
                        <div v-html="item" >

                        </div>
                    </li>
                </ul>
            </div>
           <AssistantCards @setCards="setCards" />
        </div>
        <div class="w-5/6 mx-auto my-4">
            <div class="flex justify-between gap-4">
                <el-input
                    v-model="textarea"
                    :rows="4"
                    type="textarea"
                    placeholder="Please input"
                />
                <div class="p-4 bg-slate-200 font-semibold text-slate-500 rounded-md self-end cursor-pointer" @click="sendMessageFromInput">
                    Send
                </div>
            </div>
        </div>
        <div class=" w-5/6 mx-auto flex flex-wrap gap-2">
            <el-button @click="showWordsExample">words examples</el-button>
            <el-button @click="wordsConversation">Q&A</el-button>
            <el-button @click="showVerbModal">Verbs</el-button>
            <el-button @click="showVoiceModal">Voice</el-button>
            <el-button @click="handleDeleteThread">delete thread</el-button>
            <el-button @click="getMessages(deckId)">get Messages</el-button>
        </div>
        <AssistantVerbs :isVisible="verbDialogVisible" @hideModal="hideVerbModal" @sendMessage="handleSendMessage"/>
        <AssistantVoiceModal :isVisible="voiceDialogVisible" @hideModal="hideVoiceModal"/>
    </div>
</template>
<script setup lang="ts">
    import { c } from 'vitest/dist/reporters-5f784f42';
import { useMessagesApi } from '~/composables/useMessagesApi'
    definePageMeta({
        middleware: [ async (to, from) => {
            const {data, error} = await useFetch<any>('/api/apiKey',{method: 'get'})
            if(!data.value.body) {
                return '/dashboard/assistant'
            }
        },"auth"]
    })
    const textarea = ref('')
    const cards = ref<any[]>([])
    const route = useRoute()
    const [deckId] = route.params.slug
    const verbDialogVisible = ref(false)
    const voiceDialogVisible = ref(false)
    const scrollContainer = ref<HTMLDivElement | null>(null);
    const { messages, getMessages, sendMessage, deleteThread } = useMessagesApi()
    if(isNaN(Number(deckId))) {
        throw "deckId invalid"
    }

    await getMessages(deckId)

    const scrollToBottom = () => {
        nextTick(() => {
            if (scrollContainer.value) {
                scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
            }
        })
    }

    onMounted(async () => {
        scrollToBottom()
    });

    const setCards = (value: any[]) => {
        cards.value = value
        console.log(cards.value)
    }

    const showVerbModal = () => {
        verbDialogVisible.value = true
    }

    const hideVerbModal = () => {
        verbDialogVisible.value = false
    }

    const showVoiceModal = () => {
        voiceDialogVisible.value = true
    }

    const hideVoiceModal = () => {
        voiceDialogVisible.value = false
    }

    const handleSendMessage = async (content: string) => {
        const loadingIcon = ElLoading.service({ 
            text: 'Loading',
            lock: true
         })
        const { data, error } = await sendMessage(deckId, content)
        loadingIcon.close()
        if (data.value) {
            scrollToBottom()
        }
        // Handle error if necessary
    }

    const handleDeleteThread = async () => {
        const {data, error} = await deleteThread(deckId)
        console.log(data.value)
        console.log(error.value)
        messages.value = []
    }

    const showWordsExample = async () => {
        if(!cards.value.length) return
        await handleSendMessage(`I am a primative Japanese language learner.
        Show me examples of using japanese word ${JSON.stringify(cards.value)} in daily life. 
        And I need the each example with romaji after it.`)
    }

    const wordsConversation = async () => {
        if(!cards.value.length) return
        await handleSendMessage(` Using simple vocabulary from my list, such as ${JSON.stringify(cards.value)}, 
                            and I need you to ask me basic questions in Japanese with romaji after it.
                            I'll respond your questions in Japanese, I need you to provide feedback on grammar and vocabulary usage. 
                            I need you to feedback my response in english.
                            If I make mistakes, kindly correct them and explain the right natural way to say it in Japanese.`)
    }
    const sendMessageFromInput = async () => {
        const message = textarea.value
        await handleSendMessage(message)
    }

</script>
<style lang="">
    
</style>