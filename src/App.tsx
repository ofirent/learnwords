import * as React from 'react'
import { AppBar, Toolbar, Typography, Tabs, Tab, Container, Paper, Box } from '@mui/material'
import LearnView from './components/LearnView'
import PracticeView from './components/PracticeView'
import QuizView from './components/QuizView'
import SRSReview from './components/SRSReview'
import HardPracticeView from './components/HardPracticeView'

type TabKey = 'learn' | 'practice' | 'quiz' | 'srs' | 'practiceHard'

import { AppContext } from './appState'
import type { VocabItem } from './types'

export default function App() {
  const [tab, setTab] = React.useState<TabKey>('learn')
  const [hardWords, setHardWords] = React.useState<VocabItem[]>([])

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>Vocabulary Trainer</Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
            <Tab value="learn" label="לימוד מילים" />
            <Tab value="practice" label="השלמת משפטים" />
            <Tab value="srs" label="SRS Review" />
          <Tab value="quiz" label="בחן אותי" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <AppContext.Provider value={{ tab, setTab, hardWords, setHardWords }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {tab === 'learn' && <LearnView />}
          {tab === 'practice' && <PracticeView />}
          {tab === 'quiz' && <QuizView />}
          {tab === 'srs' && <SRSReview />}
          {tab === 'practiceHard' && <HardPracticeView />}
        </Paper>

       <Typography
         variant="caption"
         color="text.secondary"
         align="center"
         sx={{ display: 'block', mt: 2 }}
       >
         Copyright © {new Date().getFullYear()} Shalev Ofir 
       </Typography>
      </Container>
      </AppContext.Provider>
    </Box>
  )
}
