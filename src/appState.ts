import * as React from 'react'
import type { VocabItem } from './types'

type AppState = {
  tab: 'learn' | 'practice' | 'quiz' | 'srs' | 'practiceHard'
  setTab: (t: AppState['tab']) => void
  hardWords: VocabItem[]
  setHardWords: (w: VocabItem[]) => void
}

export const AppContext = React.createContext<AppState>({
  tab: 'learn',
  setTab: () => {},
  hardWords: [],
  setHardWords: () => {},
})
