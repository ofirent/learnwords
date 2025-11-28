import * as React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import LearnView from './components/LearnView'
import PracticeView from './components/PracticeView'
import QuizView from './components/QuizView'
import SRSReview from './components/SRSReview'
import HardPracticeView from './components/HardPracticeView'
import { AppContext, TabKey } from './appState'

export default function App() {
  const [tab, setTab] = React.useState<TabKey>('learn')
  const [hardWords, setHardWords] = React.useState([])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1.5, sm: 3 },
          }}
        >
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Vocabulary Trainer
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 40, sm: 48 },
              '& .MuiTab-root': {
                minHeight: { xs: 40, sm: 48 },
                minWidth: { xs: 'auto', sm: 120 },
                fontSize: { xs: 12, sm: 14 },
                paddingInline: { xs: 1, sm: 2.5 },
              },
            }}
          >
            <Tab value="learn" label="לימוד מילים" />
            <Tab value="practice" label="השלמת משפטים" />
            <Tab value="quiz" label="בחן אותי" />
            <Tab value="srs" label="SRS Review" />
            <Tab value="practiceHard" label="קשות בלבד" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <AppContext.Provider value={{ tab, setTab, hardWords, setHardWords }}>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3 },
            px: { xs: 1.5, sm: 2 },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: { xs: 2, sm: 3 },
            }}
          >
            {tab === 'learn' && <LearnView />}
            {tab === 'practice' && <PracticeView />}
            {tab === 'quiz' && <QuizView />}
            {tab === 'srs' && <SRSReview />}
            {tab === 'practiceHard' && <HardPracticeView />}
          </Paper>
        </Container>
      </AppContext.Provider>
    </Box>
  )
}
