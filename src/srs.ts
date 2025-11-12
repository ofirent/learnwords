import { vocab } from './data'
import type { VocabItem } from './types'

export type Rating = 'forgot' | 'hard' | 'good' | 'easy'

export type SrsCard = {
  word: string        // vocab.word (unique key)
  level: number       // 1..6
  due: number         // epoch millis when due next
  history?: { t: number, rating: Rating }[]
}

const KEY = 'srs_v1_cards'
const DAILY_LIMIT = 25 // 2B

function load(): Record<string, SrsCard> {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function save(db: Record<string, SrsCard>) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function initIfNeeded() {
  const db = load()
  const now = Date.now()
  for (const v of vocab) {
    if (!db[v.word]) {
      db[v.word] = { word: v.word, level: 1, due: now }
    }
  }
  save(db)
}

export function getDueToday(): SrsCard[] {
  const db = load()
  const now = Date.now()
  const due = Object.values(db)
    .filter(c => c.due <= now)
    .sort((a,b) => a.due - b.due)
  return due.slice(0, DAILY_LIMIT)
}

export function getByWord(word: string): SrsCard | null {
  const db = load()
  return db[word] || null
}

function minutes(min: number) { return min * 60 * 1000 }
function days(d: number) { return d * 24 * 60 * 60 * 1000 }

// T1 schedule (fast): 10m, 1d, 3d, 7d, 14d
function nextDueFrom(level: number, rating: Rating): { nextLevel: number, addMs: number } {
  // Forgot: reset/near reset
  if (rating === 'forgot') return { nextLevel: 1, addMs: minutes(10) }
  if (rating === 'hard') {
    const add =
      level <= 1 ? minutes(30) :
      level === 2 ? days(1) :
      level === 3 ? days(2) :
      days(3)
    return { nextLevel: Math.max(1, level), addMs: add }
  }
  if (rating === 'good') {
    const nl = Math.min(6, level + 1)
    const add =
      nl === 2 ? minutes(10) :
      nl === 3 ? days(1) :
      nl === 4 ? days(3) :
      nl === 5 ? days(7) :
      days(14)
    return { nextLevel: nl, addMs: add }
  }
  // easy
  const nl = Math.min(6, level + 2)
  const add =
    nl <= 2 ? days(1) :
    nl === 3 ? days(2) :
    nl === 4 ? days(5) :
    nl === 5 ? days(10) :
    days(21)
  return { nextLevel: nl, addMs: add }
}

export function rate(word: string, rating: Rating): SrsCard | null {
  const db = load()
  const c = db[word]
  if (!c) return null
  const { nextLevel, addMs } = nextDueFrom(c.level, rating)
  const now = Date.now()
  const updated: SrsCard = {
    ...c,
    level: nextLevel,
    due: now + addMs,
    history: [...(c.history || []), { t: now, rating }]
  }
  db[word] = updated
  save(db)
  return updated
}

export function findVocab(word: string): VocabItem | undefined {
  return vocab.find(v => v.word === word)
}
