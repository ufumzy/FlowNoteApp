import {
  CreateNote,
  DeleteNote,
  ExportData,
  GetNotes,
  ImportData,
  ReadNote,
  RenameNote,
  WriteNote
} from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args),
    renameNote: (...args: Parameters<RenameNote>) => ipcRenderer.invoke('renameNote', ...args),
    minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
    maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
    closeWindow: () => ipcRenderer.send('closeWindow'),
    exportData: (...args: Parameters<ExportData>) => ipcRenderer.invoke('exportData', ...args),
    importData: (...args: Parameters<ImportData>) => ipcRenderer.invoke('importData', ...args),
    onWindowStateChange: (callback) =>
      ipcRenderer.on('window-state-change', (_, isMaximized) => callback(isMaximized))
  })
} catch (error) {
  console.error(error)
}
