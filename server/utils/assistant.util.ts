import {prismaClient} from './prisma'
import {openAIClient} from './openAIClient'

export const getAssistantId = async () => {
    try {
        const assistant = await prismaClient.assistant.findFirst()
        if(!assistant) {
            throw "assistant not existed";
        }
        return assistant?.value
    } catch (error) {
        throw JSON.stringify(error)
    }
}

export const getAssistantList = async () => {
    try {
        const assistants = await prismaClient.assistant.findMany()
        return assistants
    } catch (error) {
        throw JSON.stringify(error)
    }
}

export const createAssistantInDB = async () => {
    try {
        const OpenAIClient  = await openAIClient
        const newAssistant = await OpenAIClient.beta.assistants.create({
            instructions:
              "You are a personal japanese language tutor.",
            name: "Japanese Language Tutor",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-3.5-turbo",
        });
        const apiKey = await prismaClient.openApiKey.findFirst()
        if(!apiKey) {
            throw "apiKey undefined"
        }
        const response = await prismaClient.assistant.create({
            data: {
                openApiKeyId: apiKey.id,
                value: String(newAssistant.id)
            }
        })
        return response
    } catch (error) {
        console.log(error)
        throw JSON.stringify(error)
    }
}