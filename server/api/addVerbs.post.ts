import { prismaClient } from '../utils/prisma';

function validateVerbData(data: any): void {
    if (!data.nai || !data.masu || !data.ba || !data.te || !data.volitional) {
        throw createError({
            statusCode: 400,
            statusMessage: 'details of the verb are required.'
        });
    }
}

export const addVerbs = async (deckId: number,verbsData: any[]) => {
    try {
        const prismaPromises = [];

        for (const verbData of verbsData) {
            validateVerbData(verbData); // validate each card data
            prismaPromises.push(
                prismaClient.verb.create({
                    data: {
                    value: verbData.base,
                    meaning: verbData.meaning,
                    type: 'g1', // Assuming 'g1' is a default type or adjust accordingly
                    deckId: deckId,
                    conjugations: {
                        create: [
                            { type: 'nai', value: verbData.nai },
                            { type: 'masu', value: verbData.masu },
                            { type: 'ba', value: verbData.assume || verbData.ba }, // Use 'ba' if 'assume' is not provided
                            { type: 'volitional', value: verbData.thought || verbData.volitional }, // Use 'volitional' if 'thought' is not provided
                            { type: 'te', value: verbData.te },
                        ],
                    },
                    },
                })
            )
        }

        const results = await prismaClient.$transaction(prismaPromises); // Execute all card insertions in a transaction

        return {
            statusCode: 200,
            statusMessage: 'verbs added successfully',
            data: results
        };
    } catch (error: any) {
        console.error("Error creating verbs:", error);

        // More specific error handling can be added here
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error adding verbs.',
        });
    }
}

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error);
    }

    const {deckId, verbsData} = await readBody(event);
    if(isNaN(Number(deckId))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'deckId required',
        });
    }

    // Validate if cardsData is an array
    if (!Array.isArray(verbsData)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'verbsData should be an array.',
        });
    }

    return await addVerbs(Number(deckId), verbsData);
});
