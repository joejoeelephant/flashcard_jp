
export interface CardData {
    id: number
    front: string
    back:  string
    frontPronunciation: string   // e.g. "nihon"
    frontCharacter: string   // e.g. "日本"
    sentencePronunciation?: string   // e.g. "kyou wa nichiyoubi desu"
    sentenceCharacter?: string // e.g. "今日は日曜日です"
    exampleSentence?: string
    tags?: Tag[]
    deckName: string
}

export type Card = {
    front: string;
    back: string;
    exampleSentence?: string;
    frontPronunciation?: string;
    frontCharacter?: string;
    sentencePronunciation?: string;
    sentenceCharacter?: string;
    deckId: string;
}

export type Deck = {
    id: number;
    name: string;
    description?: string;
}

export type Mistake = {
    id: number;
    card: Card;
    cardId: number;
    timestamp: Date;
  }