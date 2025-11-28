import { useEffect, useState } from 'react'

interface Stats {
  score: number
  total: number
  correct: number
  streak: number
  bestStreak: number
}

const KEY = 'vocab-trainer-stats-v1'

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { score: 0, total: 0, correct: 0, streak: 0, bestStreak: 0 }
    return JSON.parse(raw) as Stats
  } catch {
    return { score: 0, total: 0, correct: 0, streak: 0, bestStreak: 0 }
  }
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(() => loadStats())

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(stats))
  }, [stats])

  const accuracy = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100)

  function markCorrect() {
    setStats(prev => {
      const streak = prev.streak + 1
      return {
        score: prev.score + 10,
        total: prev.total + 1,
        correct: prev.correct + 1,
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
      }
    })
  }

  function markWrong() {
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      streak: 0,
    }))
  }

  return { stats, accuracy, markCorrect, markWrong }
}
