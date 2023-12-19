import {prismaClient} from '../utils/prisma'

function transformVerbData(verbs: any[]) {
    return verbs.map(verb => {
        const transformed = {
            id: verb.id,
            base: verb.value,
            meaning: verb.meaning,
            nai: '',
            masu: '',
            ba: '',
            volitional: '',
            te: ''
        };
    
        verb.conjugations.forEach((conjugation: any) => {
            // Map each conjugation type to the corresponding field
            switch (conjugation.type) {
                case 'nai':
                    transformed.nai = conjugation.value;
                    break;
                case 'masu':
                    transformed.masu = conjugation.value;
                    break;
                case 'ba':
                    transformed.ba = conjugation.value;
                    break;
                case 'volitional':
                    transformed.volitional = conjugation.value;
                    break;
                case 'te':
                    transformed.te = conjugation.value;
                    break;
            }
        });
    
        return transformed;
    });
  }

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error)
    }
    const {deckId} = getQuery(event)

    try {
        if(isNaN(Number(deckId))) {
            throw "deckId invalid"
        }
        const verbs = await prismaClient.verb.findMany({
            where: {
                deckId: Number(deckId)
            },
            include: {
                conjugations: true,
            },
        });
    
        const transformedData = transformVerbData(verbs);
        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: transformedData
        };
    } catch (error: any) {
        console.error('Error fetching verbs:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error fetching verbs.',
        });
    }
})