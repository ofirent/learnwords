import * as React from 'react'

type Stats = {
  total: number
  correct: number
  wrong: number
  streak: number
  bestStreak: number
  score: number
}

const KEY = 'vocab_stats_v1'

const defaultStats: Stats = {
  total: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0, score: 0
}

export function useStats() {
  const [stats, setStats] = React.useState<Stats>(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? { ...defaultStats, ...JSON.parse(raw) } as Stats : defaultStats
    } catch {
      return defaultStats
    }
  })

  React.useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(stats))
  }, [stats])

  function markCorrect() {
    setStats(s => {
      const next = {
        ...s,
        total: s.total + 1,
        correct: s.correct + 1,
        streak: s.streak + 1,
        bestStreak: Math.max(s.bestStreak, s.streak + 1),
        score: s.score + 10
      }
      return next
    })
  }

  function markWrong() {
    setStats(s => ({
      ...s,
      total: s.total + 1,
      wrong: s.wrong + 1,
      streak: 0,
      score: Math.max(0, s.score - 2)
    }))
  }

  function reset() {
    setStats(defaultStats)
  }

  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0

  return { stats, accuracy, markCorrect, markWrong, reset }
}
