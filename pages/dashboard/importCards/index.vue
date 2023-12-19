<template lang="">
    <div>
        <div class="border-b-2 border-slate-200 flex justify-start gap-4">
            <el-select v-model="deckId" class="m-2" placeholder="Select" size="large">
                <el-option label="Deck Select" value="" />
                <el-option
                    v-for="item in deckOptions"
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
                    "word": "ことば",
                    "kanji": "言葉",
                    "romaji": "kotoba",
                    "meaning": "word, language"
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
                    words count: {{cardsArr.length}}
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
    import {customFetch} from '~/utils/customFetch'
    import { ElNotification } from 'element-plus'

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

    const deckOptions = ref<Deck[]>([])
    const deckId = ref('')
    const jsonString = ref('')
    const dialogVisible = ref<boolean>(false)
    const isValidContent = ref<boolean>(true)
    const cardsArr = ref<OutputType[]>([])

    const fetchDecks = async () => {
        const { data, pending, error } = await customFetch<ApiResponse, any>('/api/decks')
        if(data.value) {
            deckOptions.value = data.value.body
        }
        
    }

    await fetchDecks();

    const handleCloseDialog = () => {
        dialogVisible.value = false
    }

    const isValidWordEntry = (obj: any): obj is InputType => {
        return typeof obj.word === 'string' &&
            typeof obj.kanji === 'string' &&
            typeof obj.romaji === 'string' &&
            typeof obj.meaning === 'string';
    };

    const validateTextAreaContent = (content: string): boolean => {
        try {
            const parsedContent = JSON.parse(content);

            // Check if parsedContent is an array
            if (!Array.isArray(parsedContent)) {
                return false;
            }

            // Check if every item in the array is a valid WordEntry
            return parsedContent.every(isValidWordEntry);
        } catch (e) {
            // If parsing fails, content is not valid JSON
            return false;
        }
    };

    const transformData = (input: InputType[]): OutputType[] => {
        const deck_id = deckId.value
        return input.map(entry => ({
            frontCharacter: entry.word,
            front: entry.kanji,
            frontPronunciation: entry.romaji,
            back: entry.meaning,
            deckId: deck_id
        }));
    };


    const uploadString = () => {
        if(!deckId) return
        const string = jsonString.value
        const isValid = validateTextAreaContent(string)
        isValidContent.value = isValid
        if(!isValid) return;
        const parsedContent = JSON.parse(string);
        const transformedData = transformData(parsedContent)
        cardsArr.value = transformedData
        dialogVisible.value = true
        console.log(transformedData)

    }

    const uploadData = async () => {
        const {data, error} = await customFetch<any, any>('/api/addCards', {
            method: 'post',
            body: {
                cardsData: Object.assign([], cardsArr.value)
            }
        })
        if(data.value) {
            initPage()
            ElNotification({
                title: 'success',
                message: "add cards successfully",
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