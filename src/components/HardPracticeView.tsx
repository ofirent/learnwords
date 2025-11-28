import * as React from 'react'
import { Box, Typography, Stack, Button, Card, CardContent } from '@mui/material'
import { practice, vocab } from '../data'
import { useStats } from '../useStats'

export default function HardPracticeView() {
  const { stats, accuracy, markCorrect, markWrong } = useStats()
  const hardWords = React.useMemo(
    () => vocab.filter(v => v.difficulty === 'hard').map(v => v.word.toLowerCase()),
    []
  )
  const hardPractice = React.useMemo(
    () => practice.filter(p => hardWords.includes(p.answer.toLowerCase())),
    [hardWords]
  )
  const [idx, setIdx] = React.useState(0)
  const current = hardPractice[idx] ?? hardPractice[0]

  function mark(knew: boolean) {
    if (knew) {
      markCorrect()
    } else {
      markWrong()
    }
    setIdx(i => (i + 1 >= hardPractice.length ? 0 : i + 1))
  }

  if (!current || hardPractice.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography>
          כרגע אין מילים מסומנות כ״קשות״ (hard). נסה ללמוד קודם בכרטיסיות ואז לחזור
          לכאן.
        </Typography>
      </Box>
    )
  }

  const vocabItem = vocab.find(v => v.word.toLowerCase() === current.answer.toLowerCase())

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        אימון מילים קשות
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        ניקוד: <strong>{stats.score}</strong> • דיוק: <strong>{accuracy}%</strong>
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {current.sentenceWithBlank.replace('____', '_____')}
          </Typography>
          {vocabItem && (
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              (התשובה היא מילה מסומנת כקשה)
            </Typography>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" color="success" onClick={() => mark(true)}>
              ידעתי
            </Button>
            <Button variant="outlined" color="error" onClick={() => mark(false)}>
              לא ידעתי
            </Button>
          </Stack>
          {vocabItem && (
            <Typography sx={{ mt: 2 }}>
              תשובה: <strong>{vocabItem.word}</strong> — {vocabItem.translation}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
