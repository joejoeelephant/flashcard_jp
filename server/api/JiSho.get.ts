export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error)
    }

    try {
        const {keyword} = getQuery(event)
        const res = await $fetch.raw(`https://jisho.org/api/v1/search/words?keyword=${keyword}`, {headers: {'User-Agent': 'Mozilla/5.0'}})
        const result = extractWordDetails(res._data);
        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: result
        };
    } catch (error) {
        console.error("Error retrieving data:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error retrieving data',
        })
    }
})

const extractWordDetails = (data:any) => {
    // Ensure that 'data' is an object and has a 'data' property which is an array
    if (typeof data !== 'object' || !Array.isArray(data.data)) {
        throw new Error('Invalid data format');
    }

    return data.data.map((entry: any) => {
        const character = entry.japanese[0]?.reading; // Get the reading (hiragana/katakana)
        const meaning = entry.senses[0]?.english_definitions.join(', '); // Get the first sense's English definition(s)
        return { character, meaning };
    });
};