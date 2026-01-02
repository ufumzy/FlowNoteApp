```
/// <reference types="vite/client" />

import {
  CloseWindow,
  CreateNote,
  DeleteNote,
  GetNotes,
  MaximizeWindow,
  MinimizeWindow,
  ReadNote,
  WriteNote
} from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
      minimizeWindow: MinimizeWindow
      maximizeWindow: MaximizeWindow
      closeWindow: CloseWindow
      exportData: ExportData
      importData: ImportData
      renameNote: RenameNote
      onWindowStateChange: (callback: (isMaximized: boolean) => void) => void
    }
  }
}
