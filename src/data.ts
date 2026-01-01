import friendsSet from './friends-vocab.json'
import type { VocabItem, PracticeItem, Difficulty } from './types'

export const vocab: VocabItem[] = friendsSet.vocab.map((v) => ({
  word: v.word,
  translation: v.translation,
  example: v.example,
  difficulty: v.difficulty as Difficulty | undefined,
  source: 'competition',
}))

export const practice: PracticeItem[] = friendsSet.practice
