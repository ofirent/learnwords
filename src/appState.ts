import * as React from 'react'
import type { VocabItem } from './types'

export type TabKey = 'learn' | 'practice' | 'quiz' | 'srs' | 'practiceHard'

interface AppContextValue {
  tab: TabKey
  setTab: (tab: TabKey) => void
  hardWords: VocabItem[]
  setHardWords: React.Dispatch<React.SetStateAction<VocabItem[]>>
}

export const AppContext = React.createContext<AppContextValue>({
  tab: 'learn',
  setTab: () => {},
  hardWords: [],
  setHardWords: () => {},
})
