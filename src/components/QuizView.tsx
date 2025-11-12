import * as React from 'react'
import { useMemo, useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Stack, LinearProgress, Alert, Collapse, Chip } from '@mui/material'
import { practice } from '../data'
import { useStats } from '../useStats'

export default function QuizView() {
  const [time, setTime] = useState(90) // seconds
  const [running, setRunning] = useState(false)
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [level, setLevel] = useState(1)
  const [correctInLevel, setCorrectInLevel] = useState(0)

  const { stats, accuracy, markCorrect, markWrong } = useStats()
  const current = practice[idx]
  const normalized = (s: string) => s.trim().toLowerCase()
  const isCorrect = Boolean(normalized(input)) && normalized(input) === normalized(current.answer)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [running])

  useEffect(() => {
    if (time === 0) setRunning(false)
  }, [time])

  function moveNext() {
    if (idx >= practice.length - 1) {
      // reshuffle for continuous quiz
      shuffle()
      setIdx(0)
    } else {
      setIdx(i => i + 1)
    }
    setInput('')
  }

  function shuffle() {
    for (let i = practice.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[practice[i], practice[j]] = [practice[j], practice[i]]
    }
  }

  function submit() {
    if (!normalized(input)) return
    if (isCorrect) {
      markCorrect()
      const nextCount = correctInLevel + 1
      const requirement = 5 + (level - 1) * 2 // harder each level
      if (nextCount >= requirement) {
        setLevel(l => l + 1)
        setCorrectInLevel(0)
      } else {
        setCorrectInLevel(nextCount)
      }
    } else {
      markWrong()
      // small penalty: drop progress-in-level
      setCorrectInLevel(c => Math.max(0, c - 1))
    }
    moveNext()
  }

  const levelRequirement = 5 + (level - 1) * 2
  const levelProgress = useMemo(() => (correctInLevel / levelRequirement) * 100, [correctInLevel, levelRequirement])
  const timeProgress = useMemo(() => (time / 90) * 100, [time])

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip color="primary" label={"Level " + level} />
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="caption">התקדמות לרמה הבאה</Typography>
            <LinearProgress variant="determinate" value={levelProgress} />
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ minWidth: 160 }}>
            <Typography variant="caption">שעון (90 שנ׳)</Typography>
            <LinearProgress variant="determinate" value={timeProgress} />
          </Box>
          <Button variant="contained" onClick={() => setRunning(r => !r)}>{running ? 'השהה' : 'התחל'}</Button>
          <Button variant="outlined" onClick={() => { setTime(90); setRunning(false); setLevel(1); setCorrectInLevel(0) }}>איפוס</Button>
        </Stack>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {current.sentenceWithBlank.replace('____', '_____')}
          </Typography>
          <TextField
            fullWidth
            autoFocus
            label="המילה החסרה"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
            disabled={!running || time === 0}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={submit} disabled={!running || time === 0}>שלח</Button>
            <Button variant="outlined" onClick={moveNext} disabled={!running || time === 0}>דלג</Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Typography variant="body2">ניקוד: <strong>{stats.score}</strong></Typography>
        <Typography variant="body2">דיוק כולל: <strong>{accuracy}%</strong></Typography>
      </Stack>
    </Box>
  )
}
