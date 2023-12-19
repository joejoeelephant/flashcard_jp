const Elevenlab_Api_Key = process.env.ELEVEN_LAB_KEY

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }
    if(!Elevenlab_Api_Key) {
        throw createError({
            statusCode: 500,
            statusMessage: "Elevenlab_Api_Key undefined"
        });
    }
    const {speechText} = await readBody(event);
    if (!speechText) {
        throw createError({
            statusCode: 400,
            statusMessage: "speechText is required"
        });
    }
    try {
        const options = {
            method: 'POST' as const, // Corrected to a specific string literal
            headers: {
                'Content-Type': 'application/json',
                "xi-api-key": Elevenlab_Api_Key,
                'User-Agent': 'Mozilla/5.0',
                "Accept": "audio/mpeg",
            },
            body: JSON.stringify({
                model_id: "eleven_monolingual_v1",
                text: speechText,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    use_speaker_boost: true
                }
            })
        };

        const response = await $fetch.raw(`https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB`, options) as any;
        console.log(response)
        return {
            statusCode: 200,
            statusMessage: "Success",
            body: response
        }
       
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error)
        });
    }
})
