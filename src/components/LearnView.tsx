import * as React from 'react'
import { useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import WordCard from './WordCard'
import { Button } from '@mui/material'
import { AppContext } from '../appState'
import { initIfNeeded, getDueToday } from '../srs'
import { vocab } from '../data'
import type { SourceKey } from '../types'

function difficultyLabel(level?: string) {
  if (!level) return ''
  if (level === 'easy') return 'קל'
  if (level === 'medium') return 'בינוני'
  if (level === 'hard') return 'קשה'
  return ''
}

function difficultyColor(level?: string): 'default' | 'success' | 'warning' | 'error' {
  if (level === 'easy') return 'success'
  if (level === 'medium') return 'warning'
  if (level === 'hard') return 'error'
  return 'default'
}

export default function LearnView() {
  const { setTab } = React.useContext(AppContext)
  React.useEffect(() => {
    initIfNeeded()
  }, [])
  const [dueCount, setDueCount] = React.useState(0)
  React.useEffect(() => {
    setDueCount(getDueToday().length)
  }, [])
  const [query, setQuery] = useState('')
  const [source, setSource] = useState<'all' | SourceKey>('all')
  const [mode, setMode] = useState<'cards' | 'table'>('cards')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vocab.filter(v => {
      const inSource = source === 'all' ? true : v.source === source
      const inText =
        !q || [v.word, v.translation, v.example ?? ''].some(s =>
          s.toLowerCase().includes(q)
        )
      return inSource && inText
    })
  }, [query, source])

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        <TextField
          fullWidth
          label="חיפוש מילה / תרגום"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Select
          value={source}
          onChange={e => setSource(e.target.value as any)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="all">כל הרשימות</MenuItem>
          <MenuItem value="competition">Competition & Cooperation</MenuItem>
        </Select>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          sx={{ display: 'flex', flexDirection: 'row-reverse' }}
        >
          <ToggleButton value="table">טבלה</ToggleButton>
          <ToggleButton value="cards">כרטיסיות</ToggleButton>
        </ToggleButtonGroup>
        <Chip
          sx={{ mt: '10px' }}
          label={'נמצאו ' + filtered.length + ' מילים'}
          variant="outlined"
        />
        <Button variant="contained" onClick={() => setTab('srs')}>
          בדיקת היום (SRS) {dueCount ? `• ${dueCount}` : ''}
        </Button>
      </Stack>

      {mode === 'cards' ? (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filtered.map(it => (
            <Grid key={it.word} xs={12} sm={6} md={4}>
              <WordCard item={it} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filtered.map(it => (
            <Grid key={it.word} xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {it.word}
                      </Typography>
                      <Typography color="text.secondary">
                        {it.translation}
                      </Typography>
                    </Box>
                    {it.difficulty && (
                      <Chip
                        label={difficultyLabel(it.difficulty)}
                        color={difficultyColor(it.difficulty)}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                  {it.example && (
                    <Typography sx={{ mt: 1 }}>📘 {it.example}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
