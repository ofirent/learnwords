export type SourceKey = 'routine' | 'nomophobia'

export interface VocabItem {
  word: string
  translation: string
  example?: string
  source: SourceKey
}

export interface PracticeItem {
  sentenceWithBlank: string // contains '____'
  answer: string
  hint?: string
}
