import * as React from 'react'
import { useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  const [infinite, setInfinite] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const { stats, accuracy, markCorrect, markWrong } = useStats()

  const current = practice[idx]

  const progress = useMemo(
    () => ((idx + 1) / practice.length) * 100,
    [idx]
  )

  // יצירת 4 אופציות – אחת נכונה, 3 אחרות רנדומליות
  const options = useMemo(() => {
    const correct = current.answer
    const others = practice
      .filter((_, i) => i !== idx)
      .map(p => p.answer)

    const shuffledOthers = [...others]
    for (let i = shuffledOthers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledOthers[i], shuffledOthers[j]] = [
        shuffledOthers[j],
        shuffledOthers[i],
      ]
    }

    const distractors = shuffledOthers.slice(0, 3)
    const all = [correct, ...distractors]

    // ערבוב 4 האופציות
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[all[i], all[j]] = [all[j], all[i]]
    }

    return all
  }, [idx, current.answer])

  function resetForNewQuestion() {
    setSelected(null)
    setAnswered(false)
  }

  function shuffle() {
    for (let i = practice.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[practice[i], practice[j]] = [practice[j], practice[i]]
    }
    setIdx(0)
    resetForNewQuestion()
  }

  function prev() {
    setIdx(i => Math.max(0, i - 1))
    resetForNewQuestion()
  }

  function handleSelect(option: string) {
    setSelected(option)

    // אם כבר ענינו על השאלה – לא להחשיב שוב
    if (answered) return

    setAnswered(true)

    if (option === current.answer) {
      markCorrect()
    } else {
      markWrong()
    }
  }

  function next() {
    // קודם מאפסים את המשוב, כדי שלא יופיע על השאלה הבאה
    resetForNewQuestion()

    setIdx(prevIdx => {
      if (prevIdx >= practice.length - 1) {
        if (infinite) {
          // ערבוב חוזר והתחלה מחדש
          for (let i = practice.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[practice[i], practice[j]] = [practice[j], practice[i]]
          }
          return 0
        } else {
          return practice.length - 1
        }
      } else {
        return prevIdx + 1
      }
    })
  }

  const isCorrectSelection =
    selected != null && selected === current.answer
  const hasSelection = selected != null

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
          <Button variant="outlined" onClick={shuffle}>
            ערבוב
          </Button>
          <Button variant="contained" onClick={prev}>
            הקודם
          </Button>
          <Button variant="contained" onClick={next}>
            הבא
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 1 }}
        alignItems="center"
      >
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

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 2 }}
      />

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {current.sentenceWithBlank.replace('____', '_____')}
          </Typography>

          <Stack spacing={1}>
            {options.map(option => {
              const isSelected = selected === option
              const isCorrect = option === current.answer

              let color:
                | 'inherit'
                | 'success'
                | 'error'
                | 'primary'
                | 'secondary' = 'primary'

              if (answered) {
                if (isCorrect) color = 'success'
                if (isSelected && !isCorrect) color = 'error'
              }

              return (
                <Button
                  key={option}
                  variant={isSelected ? 'contained' : 'outlined'}
                  color={color}
                  onClick={() => handleSelect(option)}
                  sx={{ justifyContent: 'flex-start' }}
                  fullWidth
                >
                  {option}
                </Button>
              )
            })}
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Collapse
              in={answered && hasSelection && !isCorrectSelection}
              unmountOnExit
            >
              <Alert severity="warning">
                לא מדויק… <br />
                התשובה הנכונה:{' '}
                <strong>{current.answer}</strong>
                <br />
                התרגום:{' '}
                <strong>{current.hint}</strong>
              </Alert>
            </Collapse>

            <Collapse
              in={answered && isCorrectSelection}
              unmountOnExit
            >
              <Alert severity="success">
                בול! תשובה נכונה ✅
                <br />
                <strong>{current.answer}</strong> —{' '}
                {current.hint}
              </Alert>
            </Collapse>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
