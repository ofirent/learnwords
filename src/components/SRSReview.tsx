import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Box, Card, CardContent, Typography, Button, Stack, Chip, LinearProgress, Alert, Collapse } from '@mui/material'
import { initIfNeeded, getDueToday, rate, findVocab, type Rating } from '../srs'
import type { VocabItem } from '../types'
import { AppContext } from '../appState'

type SessionItem = { word: string, v: VocabItem }

export default function SRSReview() {
  const { setTab, setHardWords } = React.useContext(AppContext)
  const [queue, setQueue] = useState<SessionItem[]>([])
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [hardToday, setHardToday] = useState<VocabItem[]>([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    initIfNeeded()
    const due = getDueToday()
    const items: SessionItem[] = due
      .map(c => findVocab(c.word))
      .filter(Boolean)
      .map(v => ({ word: (v as VocabItem).word, v: v as VocabItem }))
    setQueue(items)
    setIdx(0)
  }, [])

  const current = queue[idx]
  const progress = useMemo(() => queue.length ? ((idx) / queue.length) * 100 : 0, [idx, queue.length])

  function handleRate(r: Rating) {
    if (!current) return
    rate(current.word, r)
    if (r === 'forgot' || r === 'hard') {
      setHardToday(arr => [...arr, current.v])
    }
    const next = idx + 1
    if (next >= queue.length) {
      setFinished(true)
    } else {
      setIdx(next)
      setRevealed(false)
    }
  }

  if (!queue.length && !finished) {
    return <Alert severity="info">אין כרטיסים לבדיקה כרגע. חזור מאוחר יותר 🙂</Alert>
  }

  if (finished) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="success">סיימת את הסשן להיום! 🎉</Alert>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => { setFinished(false); setIdx(0) }}>בדוק שוב</Button>
          <Button variant="outlined" onClick={() => {
            setHardWords(hardToday)
            setTab('practiceHard') // 3C: open targeted practice
          }} disabled={!hardToday.length}>
            אימון מילים קשות ({hardToday.length})
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Chip color="primary" label={"נבדק " + idx + " מתוך " + queue.length} />
        <Box sx={{ minWidth: 240 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Typography variant="body2" color="text.secondary">יומי: עד 25 כרטיסים</Typography>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            {current?.v.word}
          </Typography>
          <Collapse in={revealed}>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              תרגום: <strong>{current?.v.translation}</strong>
            </Typography>
            {current?.v.example && (
              <Typography sx={{ mb: 2 }}>📘 {current.v.example}</Typography>
            )}
          </Collapse>

          <Stack direction="row" spacing={1}>
            {!revealed ? (
              <Button variant="contained" onClick={() => setRevealed(true)}>הצג תשובה</Button>
            ) : (
              <>
                <Button color="error" variant="contained" onClick={() => handleRate('forgot')}>Forgot</Button>
                <Button color="warning" variant="contained" onClick={() => handleRate('hard')}>Hard</Button>
                <Button color="primary" variant="contained" onClick={() => handleRate('good')}>Good</Button>
                <Button color="success" variant="contained" onClick={() => handleRate('easy')}>Easy</Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
