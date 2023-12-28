<template lang="">
    <div>
        <div class="border-b-2 border-slate-200 flex justify-start gap-4">
            <el-select v-model="deckId" class="m-2" placeholder="Select" size="large">
                <el-option label="Deck Select" value="" />
                <el-option
                    v-for="item in decks"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
            <el-text class="mx-1" v-if="!deckId" type="danger">Please select a deck</el-text>
        </div>
        <div class="mt-4">
            inputFormat example: [
                {
                    "base": "くる",
                    "meaning": "to come",
                    "nai": "こない",
                    "masu": "きます",
                    "ba": "くれば",
                    "volitional": "こよう",
                    "te": "きて"
                }
            ]
        </div>
        <div class="mt-6">
            <el-input
                v-model="jsonString"
                :rows="28"
                type="textarea"
                placeholder="Please input"
            />
        </div>
        <div class="mt-2 flex justify-end gap-4">
            <el-text class="mx-1" v-if="!isValidContent" type="danger">invalid content</el-text>
            <el-button type="primary" @click="uploadString">upload</el-button>
        </div>
    </div>
    <ClientOnly>
        <el-dialog
            v-model="dialogVisible"
            title="Check the Data"
            width="30%"
            :before-close="handleCloseDialog"
        >
            <div>
                <p>
                    deckId: {{deckId}}
                </p>
                <p>
                    verbs: {{verbsArr.length}}
                </p>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="uploadData">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </ClientOnly>
</template>
<script setup lang="ts">
    import { ElNotification } from 'element-plus'
    import { useDecksFetcher } from '~/composables/useDecksFetcher'


    definePageMeta({
        layout: 'dashboard',
        middleware: ["auth"]

    })
    interface Deck {
        id: string;
        name: string;
        description: string;
    }
    interface ApiResponse {
        body: Deck[];
        statusCode: number;
        statusMessage: string;
    }

    type InputType = {
        word: string;
        kanji: string;
        romaji: string;
        meaning: string;
    };

    type OutputType = {
        frontCharacter: string;
        front: string;
        frontPronunciation: string;
        back: string;
    };

    const deckId = ref('')
    const jsonString = ref('')
    const dialogVisible = ref<boolean>(false)
    const isValidContent = ref<boolean>(true)
    const verbsArr = ref<any[]>([])
    
    const {loading, decks, fetchDecks } = useDecksFetcher()
    fetchDecks();

    const handleCloseDialog = () => {
        dialogVisible.value = false
    }

    const isValidVerbEntry = (obj: any): boolean => {
        return typeof obj.base === 'string' &&
            typeof obj.meaning === 'string' &&
            typeof obj.nai === 'string' &&
            typeof obj.ba === 'string' &&
            typeof obj.volitional === 'string' &&
            typeof obj.masu === 'string';
    };

    const checkJsonString = () => {
        try {
            const parsedContent = JSON.parse(jsonString.value);

            // Check if parsedContent is an array
            if (!Array.isArray(parsedContent)) {
                return false;
            }

            // Check if every item in the array is a valid WordEntry
            return parsedContent.every(isValidVerbEntry);
        } catch (e) {
            // If parsing fails, content is not valid JSON
            return false;
        }
    }

    const uploadString = () => {
        if(!checkJsonString()) {
            isValidContent.value = false
            return
        }
        if(!deckId.value) return;
        verbsArr.value = JSON.parse(jsonString.value)
        isValidContent.value = true
        dialogVisible.value = true
    }

    const uploadData = async () => {
        const {data, error} = await useFetch<any, any>('/api/addVerbs', {
            method: "post",
            body: {
                deckId: deckId.value,
                verbsData: JSON.parse(jsonString.value)
            }
        })
        if(data.value) {
            initPage()
            ElNotification({
                title: 'success',
                message: "add verbs successfully",
                type: 'success',
            })

        }

        if(error.value) {
            ElNotification({
                title: 'error',
                message: error.value?.statusMessage,
                type: 'warning',
            })
        }
        console.log(data.value)
        console.log(error.value)
    }

    const initPage = () => {
        deckId.value = ""
        jsonString.value = ""
        handleCloseDialog()
    }

</script>
<style lang="">
    
</style>