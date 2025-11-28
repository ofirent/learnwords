import * as React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Chip,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import type { VocabItem } from '../types'

function speakWord(word: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return
  }

  const utter = new SpeechSynthesisUtterance(word)
  utter.lang = 'en-US'
  utter.rate = 0.95
  utter.pitch = 1

  const voices = window.speechSynthesis.getVoices()
  const enVoice =
    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    null

  if (enVoice) {
    utter.voice = enVoice
  }

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
}

function difficultyLabel(level?: VocabItem['difficulty']) {
  if (!level) return ''
  if (level === 'easy') return 'קל'
  if (level === 'medium') return 'בינוני'
  if (level === 'hard') return 'קשה'
  return ''
}

function difficultyColor(level?: VocabItem['difficulty']): 'default' | 'success' | 'warning' | 'error' {
  if (level === 'easy') return 'success'
  if (level === 'medium') return 'warning'
  if (level === 'hard') return 'error'
  return 'default'
}

export default function WordCard({ item }: { item: VocabItem }) {
  const [flipped, setFlipped] = React.useState(false)

  return (
    <Box
      sx={{ perspective: '1000px' }}
      role="button"
      tabIndex={0}
      onClick={() => setFlipped(v => !v)}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 220,
          transformStyle: 'preserve-3d',
          transition: 'transform .5s',
          transform: `rotateY(${flipped ? 180 : 0}deg)`,
          cursor: 'pointer',
        }}
      >
        {/* צד קדמי */}
        <Card
          variant="outlined"
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardContent sx={{ textAlign: 'center', width: '100%' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography variant="h5" fontWeight={700}>
                {item.word}
              </Typography>
              <Tooltip title="השמע הגייה">
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation()
                    speakWord(item.word)
                  }}
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            {item.difficulty && (
              <Chip
                size="small"
                label={difficultyLabel(item.difficulty)}
                color={difficultyColor(item.difficulty)}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              הקלק/י כדי לראות תרגום
            </Typography>
          </CardContent>
        </Card>

        {/* צד אחורי */}
        <Card
          variant="outlined"
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {item.translation}
            </Typography>
            {item.example && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                📘 {item.example}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
