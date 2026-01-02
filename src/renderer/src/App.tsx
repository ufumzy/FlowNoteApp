import {
    ActionButtonsRow,
    Content,
    DraggableTopBar,
    FloatingNoteTitle,
    MarkdownEditor,
    NotePreviewList,
    RootLayout,
    Sidebar
} from '@/components'
import { settingsAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { useRef } from 'react'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const settings = useAtomValue(settingsAtom)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <div
      className="h-full transition-colors duration-200"
      style={{
        backgroundColor: `${settings.backgroundColor}${Math.round(settings.opacity * 255)
          .toString(16)
          .padStart(2, '0')}`,
        fontSize: `${settings.fontSize}px`,
        color: settings.fontColor
      }}
    >
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2 border-r border-white/10">
          <ActionButtonsRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>

        <Content ref={contentContainerRef} className="border-l border-white/10 bg-transparent">
          <FloatingNoteTitle className="pt-2 relative z-[60]" />
          <MarkdownEditor />
        </Content>
      </RootLayout>
    </div>
  )
}

export default App
