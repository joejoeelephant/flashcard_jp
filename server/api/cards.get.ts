import {prismaClient} from '../utils/prisma'
import { parseInteger } from '../utils/helpers'

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error)
    }
    const { page, pageSize, deckId, frontText, backText } = getQuery(event)

    if(deckId && isNaN(Number(deckId))) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Error retrieving cards',
        })
    }

    const filterHandler = (deck_id: number, front_text: string, back_text: string) => {
        let where = {}
        if(!isNaN(deck_id) && deck_id > 0) {
            where = { deckId: deck_id };
        }
        if(front_text) {
            where = {...where, front: frontText };
        }
        if(back_text) {
            where = {...where, back: backText };
        }

        return where
    }

    function optionsHandler() {
        const parsedPage = parseInteger(String(page), 1);
        const parsedPageSize = parseInteger(String(pageSize), 18);
        const skip = (parsedPage - 1) * parsedPageSize;
    
        const select = {
            id: true,
            front: true,
            back: true,
            exampleSentence: true,
            frontPronunciation: true,
            frontCharacter: true,
            sentencePronunciation: true,
            sentenceCharacter: true,
            deckId: true,
            lastReviewed: true,
            interval: true,
            deck: {
                select: {
                    name: true
                }
            }
        };
    
        let where = filterHandler(Number(deckId), String(frontText), String(backText))
    
        return {
            skip,
            take: parsedPageSize,
            where, // Use where directly here since it's already defined
            select,
        };
    }

    function countOptionsHandler () {
        let options: {where?:any} = {}
        let where = filterHandler(Number(deckId), String(frontText), String(backText))
        options.where = where
        return options
    }
    
    
    try {
        // Create a new deck in the database
        const cardsOptions = optionsHandler()
        const cards = await prismaClient.card.findMany(cardsOptions);
        const countOptions = countOptionsHandler()
        const totalCards = await prismaClient.card.count(countOptions);

        const cardsWithDeckName = cards.map(card => ({
            ...card,
            deckName: card.deck?.name,
            deck: undefined
        }));
    
        return {
            statusCode: 200,
            statusMessage: 'Success',
            body: {cards: cardsWithDeckName, totalCards}
        };
    } catch (error) {
        console.error("Error retrieving cards:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error retrieving cards',
        })
    }
})