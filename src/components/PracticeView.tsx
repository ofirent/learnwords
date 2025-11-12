import * as React from 'react'
import { useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  LinearProgress,
  Alert,
  Collapse,
} from '@mui/material'
import { practice } from '../data'
import { useStats } from '../useStats'

export default function PracticeView() {
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [infinite, setInfinite] = useState(true)

  const { stats, accuracy, markCorrect, markWrong } = useStats()

  const current = practice[idx]
  const normalized = (s: string) => s.trim().toLowerCase()
  const isCorrect =
    normalized(input).length > 0 &&
    normalized(input) === normalized(current.answer)

  const progress = useMemo(
    () => ((idx + 1) / practice.length) * 100,
    [idx]
  )

  function shuffle() {
    for (let i = practice.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[practice[i], practice[j]] = [practice[j], practice[i]]
    }
    setIdx(0)
    setInput('')
  }

  function prev() {
    setIdx(i => Math.max(0, i - 1))
    setInput('')
  }

  function checkAndScore() {
    if (!normalized(input)) return
    if (isCorrect) {
      markCorrect()
    } else {
      markWrong()
    }
  }

  function next() {
    // קודם נבדוק/נעניק ניקוד אם הוזנה תשובה
    if (normalized(input)) {
      checkAndScore()
    }

    // מעבר לשאלה הבאה + טיפול במצב אין-סופי
    if (idx >= practice.length - 1) {
      if (infinite) {
        shuffle() // מערבב ומתחיל מהתחלה
        setIdx(0)
      } else {
        setIdx(practice.length - 1)
      }
    } else {
      setIdx(i => i + 1)
    }
    setInput('')
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Typography color="text.secondary">
          שאלה {idx + 1} / {practice.length}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={shuffle}>ערבוב</Button>
          <Button variant="contained" onClick={prev}>הקודם</Button>
          <Button variant="contained" onClick={next}>הבא</Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
        <Typography variant="body2">
          ניקוד: <strong>{stats.score}</strong>
        </Typography>
        <Typography variant="body2">
          דיוק: <strong>{accuracy}%</strong>
        </Typography>
        <Typography variant="body2">
          רצף: <strong>{stats.streak}</strong> (שיא: {stats.bestStreak})
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setInfinite(v => !v)}
        >
          מצב אין-סופי: {infinite ? 'פעיל' : 'כבוי'}
        </Button>
      </Stack>

      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {current.sentenceWithBlank.replace('____', '_____')}
          </Typography>

          <TextField
            fullWidth
            label="הקלד/י את המילה החסרה"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') next()
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Collapse in={Boolean(normalized(input)) && !isCorrect}>
              <Alert severity="warning">
                לא מדויק עדיין. רמז: {current.hint || 'נסו שוב 🙂'}
              </Alert>
            </Collapse>
            <Collapse in={Boolean(isCorrect)}>
              <Alert severity="success">בול! תשובה נכונה ✅</Alert>
            </Collapse>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  checkAndScore()
                }}
                disabled={!normalized(input)}
              >
                בדוק
              </Button>
              <Button variant="outlined" onClick={next}>
                הבא
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              תשובה: <strong>{current.answer}</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
