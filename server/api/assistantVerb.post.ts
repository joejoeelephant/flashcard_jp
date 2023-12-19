import {prismaClient} from '../utils/prisma'
import {openAIClient} from '../utils/openAIClient'

export default defineEventHandler(async (event) => {
    if(event.context.error) {
      throw createError(event.context.error)
    }

    try {
        const {deckId, verb} = await readBody(event)
        const OpenAIClient = await openAIClient
        const verbResponse = await OpenAIClient.chat.completions.create({
            messages: [
                { 
                    role: "assistant", 
                    content: `
                        You are a professional japanese language learning assistant.
                        example:
                        ----------------------------
                        input: いく;
                        output: {base: "いく" ,meaning: "to go", "nai": "いかない","masu":"いきます","ba":"いけば","volitional":"いこう","te": "いって"}
                        ----------------------------
                        The user want to get the types data of of a input verb.
                        The user need you reponse the output data with json format as I showed in my example.
                    ` 
                },
                { 
                    role: "user", 
                    content: `input: ${verb}` 
                }
            ],
            model: "gpt-3.5-turbo",
        });
        const verbString = verbResponse.choices[0].message.content
        if(!verbString) {
            throw 'verbString invalid'
        }
        const verbData = JSON.parse(verbString.replace('\n',''))
        const responseDB = await prismaClient.verb.create({
            data: {
            value: verbData.base,
            meaning: verbData.meaning,
            type: 'g1', // Assuming 'g1' is a default type or adjust accordingly
            deckId: deckId,
            conjugations: {
                create: [
                    { type: 'nai', value: verbData.nai },
                    { type: 'masu', value: verbData.masu },
                    { type: 'ba', value: verbData.ba }, // Use 'ba' if 'assume' is not provided
                    { type: 'volitional', value: verbData.volitional }, // Use 'volitional' if 'thought' is not provided
                    { type: 'te', value: verbData.te },
                ],
            },
            },
        })
        return {
            statusCode: 200,
            statusMessage: 'success',
            body: responseDB
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        });
    }
    
})