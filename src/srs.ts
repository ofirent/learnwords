import { vocab } from './data'
import type { VocabItem } from './types'

interface SrsStateItem {
  word: string
  interval: number // days
  due: string // ISO date
}

const KEY = 'vocab-trainer-srs-v1'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(dateISO: string, days: number) {
  const d = new Date(dateISO)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function loadAll(): SrsStateItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as SrsStateItem[]
  } catch {
    return []
  }
}

function saveAll(items: SrsStateItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function initIfNeeded() {
  const existing = loadAll()
  if (existing.length > 0) return
  const today = todayISO()
  const initial: SrsStateItem[] = vocab.map(v => ({
    word: v.word,
    interval: 1,
    due: today,
  }))
  saveAll(initial)
}

export function getDueToday(): VocabItem[] {
  const all = loadAll()
  const today = todayISO()
  const dueWords = all.filter(it => it.due <= today).map(it => it.word.toLowerCase())
  return vocab.filter(v => dueWords.includes(v.word.toLowerCase()))
}

export function reviewResult(word: string, grade: 'again' | 'good' | 'easy') {
  const all = loadAll()
  const idx = all.findIndex(it => it.word.toLowerCase() === word.toLowerCase())
  const today = todayISO()
  if (idx === -1) {
    all.push({ word, interval: 1, due: addDays(today, 1) })
  } else {
    const current = all[idx]
    let interval = current.interval
    if (grade === 'again') {
      interval = 1
    } else if (grade === 'good') {
      interval = Math.min(30, interval * 2)
    } else if (grade === 'easy') {
      interval = Math.min(60, interval * 3)
    }
    all[idx] = { word: current.word, interval, due: addDays(today, interval) }
  }
  saveAll(all)
}
