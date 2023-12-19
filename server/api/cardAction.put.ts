// cardActions.put.ts
import { updateCard } from './card.put';
import { getCard } from './card.get';


// Constants for intervals and ease factors
const INITIAL_INTERVAL = 1; // days
const AGAIN_INTERVAL = 60 * 1 / (24 * 60 * 60) ; // days
const EASE_INCREMENT = 0.1;
const MIN_EASE = 1.3;

const calculateNextReview = (easeFactor: number, interval: number, button: string) => {
    switch (button) {
        case 'again':
            return new Date(Date.now() + AGAIN_INTERVAL * 24 * 60 * 60 * 1000);
        case 'good':
            return new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
        case 'easy':
            const newInterval = interval * easeFactor;
            return new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);
        default:
            throw new Error('Invalid button action');
    }
};

const updateCardDataHandler = (card: any, action: string) => {
    let easeFactor = card?.easeFactor || 2.5;
    let interval = card?.interval || INITIAL_INTERVAL;

    if (action === 'again') {
        easeFactor = Math.max(easeFactor - EASE_INCREMENT, MIN_EASE);
    } else if (action === 'easy') {
        easeFactor += EASE_INCREMENT;
    }

    const nextReview = calculateNextReview(easeFactor, interval, action);

    return {
        easeFactor,
        interval: action === 'easy' ? interval * 2 : interval, // double interval for easy
        nextReview,
        lastReviewed: new Date(),
    }
}

export default defineEventHandler(async (event) => {
    if (event.context.error) {
        throw createError(event.context.error);
    }

    const {action, id} = await readBody(event);
    const {body: card} = await getCard(id);
    if (['again', 'good', 'easy'].includes(action)) {
        const cardData = updateCardDataHandler(card, action);
        return await updateCard(id, cardData);
    } else {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid card action.',
        });
    }
});
