<template lang="">
    <ClientOnly>
        <el-dialog
            :model-value="isVisible"
            width="80%"
            destroy-on-close
            align-center
            @close="hideModal"
            :style="{maxWidth:'600px'}"
        >
            <div>
                <el-input
                    v-model="text"
                    :rows="2"
                    type="textarea"
                    placeholder="Please input"
                />
                <div class="mt-4 flex justify-center">
                    <audio :src="blobUrl" controls></audio>
                </div>
                <div class="mt-4">
                    <el-button type="primary" @click="genVoice">Generate Voice</el-button>
                </div>
            </div>
        </el-dialog>
    </ClientOnly>
</template>
<script setup lang="ts">
    import { ElLoading } from 'element-plus'
import { RenameAndNestPayloadKeys } from '@prisma/client/runtime/library';
    const props =  defineProps(['isVisible']);
    const emits = defineEmits(['hideModal'])
    const text = ref("")
    const blobUrl = ref<any>(null)
    const hideModal = () => {
        emits('hideModal')
    }

    const getVoiceKey = async () => {
        const {data, error} = await useFetch<any, any>('/api/voiceKey', {method: 'get'})
        return data.value.body
    }

    const genVoice = async () => {
        const voiceKey = await getVoiceKey()
        console.log(voiceKey)
        if(!voiceKey) {
            ElMessage('please add a eleven-lab key to the voice key.')
            navigateTo('/dashboard/assistant')
            return;
        }

        const loadingIcon = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        
        const options = {
            method: 'POST' as const, // Corrected to a specific string literal
            headers: {
                'Content-Type': 'application/json',
                "xi-api-key": voiceKey.value,
                'User-Agent': 'Mozilla/5.0',
                "Accept": "audio/mpeg",
            },
            body: JSON.stringify({
                model_id: "eleven_multilingual_v2",
                text: text.value,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                    use_speaker_boost: true
                }
            })
        };

        const {data, error} = await useFetch<any, any>('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB', options)
        loadingIcon.close()
        console.log(data.value)
        console.log(error.value)

        const blob_url = URL.createObjectURL(data.value);
        blobUrl.value = blob_url 
    }
</script>
<style lang="">
    
</style>