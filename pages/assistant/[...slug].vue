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
           <AssistantDue @setCards="setCards" />
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
            <el-button @click="deleteThread">delete thread</el-button>
            <el-button @click="getMessagesFromDB">get Messages</el-button>
        </div>
        <AssistantVerbs :isVisible="verbDialogVisible" @hideModal="hideVerbModal" @sendMessage="sendMessage"/>
        <AssistantVoiceModal :isVisible="voiceDialogVisible" @hideModal="hideVoiceModal"/>
    </div>
</template>
<script setup lang="ts">
    import {customFetch} from '~/utils/customFetch'
    definePageMeta({
        middleware: [ async (to, from) => {
            const {data, error} = await useFetch<any>('/api/apiKey',{method: 'get'})
            console.log(data.value)
            if(!data.value.body) {
                return '/dashboard/assistant'
            }
        },"auth"]
    })
    const messages = ref<any[]>([])
    const textarea = ref('')
    const cards = ref<any[]>([])
    const route = useRoute()
    const [deckId] = route.params.slug
    const verbDialogVisible = ref(false)
    const voiceDialogVisible = ref(false)
    const scrollContainer = ref<HTMLDivElement | null>(null);

    if(isNaN(Number(deckId))) {
        throw "deckId invalid"
    }

    const scrollToBottom = () => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        }
    }

    onMounted(() => {
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

    function formatExampleText(inputString: string) {
        const sections = inputString.split('\n\n');
        return sections.map(section => {
            const parts = section.split('\n');
            return parts.join('<br />');
        }).join('<br /><br />');
    }

   

    const sendMessage = async (content: string) => {
        const loadingIcon = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        const {data, error} = await customFetch<any, any>('/api/assistantMessage', {
            method: 'post',
            body: {
                deckId: deckId,
                message: content
            }
        })
        loadingIcon.close()
        console.log(data.value)
        console.log(error.value)
        messages.value = data.value.body.messages.reverse().map((item: any) => {
            return formatExampleText(item.content[0].text.value)
        })
    }

    const showWordsExample = async () => {
        if(!cards.value.length) return
        await sendMessage(`I am a primative Japanese language learner.
        Show me examples of using japanese word ${JSON.stringify(cards.value)} in daily life. 
        And I need the each example with romaji after it.`)
    }

    const wordsConversation = async () => {
        if(!cards.value.length) return
        await sendMessage(` Using simple vocabulary from my list, such as ${JSON.stringify(cards.value)}, 
                            and I need you to ask me basic questions in Japanese with romaji after it.
                            I'll respond your questions in Japanese, I need you to provide feedback on grammar and vocabulary usage. 
                            I need you to feedback my response in english.
                            If I make mistakes, kindly correct them and explain the right natural way to say it in Japanese.`)
    }

    const deleteThread = async () => {
        const {data, error} = await customFetch<any, any>('/api/thread', {
            method: 'delete',
            query: {
                deckId: deckId
            }
        })
        messages.value = []
        console.log(data.value)
        console.log(error.value)
    }

    const sendMessageFromInput = async () => {
        const message = textarea.value
        console.log(message)
        await sendMessage(message)
    }

    const getMessagesFromDB = async () => {
        const {data, error} = await customFetch<any, any>('/api/threadMessages', {
            method: 'get',
            query: {
                deckId: deckId
            }
        })
        console.log(data.value)
        console.log(error.value)
        if(!data.value.body.messages.length) return;
        const messagesValue = JSON.parse(data.value.body.messages[0].value)
        messages.value = messagesValue.reverse().map((item: any) => {
            return formatExampleText(item.content[0].text.value)
        })
        
    }

    await getMessagesFromDB()


</script>
<style lang="">
    
</style>