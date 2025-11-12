import * as React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import type { VocabItem } from '../types'

type Props = { item: VocabItem }

export default function WordCard({ item }: Props) {
  const [flipped, setFlipped] = React.useState(false)

  return (
    <Box
      sx={{ perspective: '1000px' }}
      onClick={() => setFlipped(v => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped(v => !v) }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 180,
          transformStyle: 'preserve-3d',
          transition: 'transform .5s',
          transform: `rotateY(${flipped ? 180 : 0}deg)`,
          cursor: 'pointer',
        }}
      >
        <Card
          variant="outlined"
          sx={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700}>{item.word}</Typography>
            <Typography variant="body2" color="text.secondary">הקלק/י כדי לראות תרגום</Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>{item.translation}</Typography>
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
