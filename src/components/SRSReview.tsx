import * as React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
} from '@mui/material'
import { getDueToday, reviewResult } from '../srs'

export default function SRSReview() {
  const [queue, setQueue] = React.useState(() => getDueToday())
  const [idx, setIdx] = React.useState(0)

  const current = queue[idx]

  function handle(grade: 'again' | 'good' | 'easy') {
    if (!current) return
    reviewResult(current.word, grade)
    const nextQueue = getDueToday()
    setQueue(nextQueue)
    setIdx(i => (i + 1 >= nextQueue.length ? 0 : i + 1))
  }

  if (!current || queue.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography>אין כרגע מילים לבדיקה. כל הכבוד! 🎉</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">בדיקת היום (SRS)</Typography>
        <Chip label={`נותרו ${queue.length} מילים`} />
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" fontWeight={700}>
            {current.word}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {current.translation}
          </Typography>
          {current.example && (
            <Typography sx={{ mt: 1 }}>📘 {current.example}</Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" color="error" onClick={() => handle('again')}>
              שכחתי
            </Button>
            <Button variant="contained" color="primary" onClick={() => handle('good')}>
              זוכר בערך
            </Button>
            <Button variant="contained" color="success" onClick={() => handle('easy')}>
              קל מאוד
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
