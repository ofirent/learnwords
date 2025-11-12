import * as React from 'react'
import { useContext, useMemo, useState } from 'react'
import { AppContext } from '../appState'
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Alert, Collapse, LinearProgress } from '@mui/material'
import type { VocabItem } from '../types'

export default function HardPracticeView() {
  const { hardWords, setTab } = useContext(AppContext)
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')

  const current = hardWords[idx]
  const progress = useMemo(() => hardWords.length ? ((idx + 1) / hardWords.length) * 100 : 0, [idx, hardWords.length])
  const norm = (s: string) => s.trim().toLowerCase()
  const isCorrect = Boolean(norm(input)) && norm(input) === norm(current?.word || '')

  if (!hardWords.length) {
    return <Alert severity="info">אין מילים “קשות” מהסשן האחרון. בצע סשן SRS תחילה.</Alert>
  }

  function next() {
    const n = idx + 1
    if (n >= hardWords.length) {
      setTab('learn')
    } else {
      setIdx(n); setInput('')
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography color="text.secondary">מילה {idx + 1} / {hardWords.length}</Typography>
        <Button variant="outlined" onClick={() => setTab('learn')}>סיום</Button>
      </Stack>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            כתבו את המילה באנגלית עבור: <strong>{current.translation}</strong>
          </Typography>
          <TextField
            fullWidth
            autoFocus
            label="המילה באנגלית"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') next() }}
          />
          <Box sx={{ mt: 2 }}>
            <Collapse in={Boolean(norm(input)) && !isCorrect}>
              <Alert severity="warning">כמעט... המילה: <strong>{current.word}</strong></Alert>
            </Collapse>
            <Collapse in={isCorrect}>
              <Alert severity="success">בול! {current.word}</Alert>
            </Collapse>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" onClick={next}>הבא</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
