export type Difficulty = 'easy' | 'medium' | 'hard'

export type SourceKey = 'routine' | 'nomophobia' | 'friends'

export interface VocabItem {
  word: string
  translation: string
  example?: string
  source: SourceKey
  difficulty?: Difficulty
}

export interface PracticeItem {
  sentenceWithBlank: string 
  answer: string
  hint?: string
}
