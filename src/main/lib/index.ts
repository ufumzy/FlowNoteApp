import { fileEncoding } from '@shared/constants'
import {
    CreateNote,
    DeleteNote,
    ExportData,
    GetNotes,
    ImportData,
    ReadNote,
    WriteNote
} from '@shared/types'
import { app, dialog } from 'electron'
import { copy, ensureDir, pathExists, readFile, writeFile } from 'fs-extra'
import * as path from 'path'

type NoteStore = {
  notes: {
    [title: string]: {
      title: string
      content: string
      lastEditTime: number
    }
  }
}

const getStorePath = () => {
  return path.join(app.getPath('userData'), 'notes.json')
}

const loadStore = async (): Promise<NoteStore> => {
  const storePath = getStorePath()
  if (await pathExists(storePath)) {
    const content = await readFile(storePath, { encoding: fileEncoding })
    try {
      return JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse notes store', e)
      return { notes: {} }
    }
  }
  return { notes: {} }
}

const saveStore = async (store: NoteStore) => {
  const storePath = getStorePath()
  await ensureDir(path.dirname(storePath))
  await writeFile(storePath, JSON.stringify(store, null, 2), { encoding: fileEncoding })
}

export const getNotes: GetNotes = async () => {
  const store = await loadStore()
  const notes = Object.values(store.notes).map((note) => ({
    title: note.title,
    lastEditTime: note.lastEditTime
  }))

  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

export const readNote: ReadNote = async (title) => {
  const store = await loadStore()
  const note = store.notes[title]
  return note ? note.content : ''
}

export const writeNote: WriteNote = async (title, content) => {
  const store = await loadStore()
  store.notes[title] = {
    title,
    content,
    lastEditTime: Date.now()
  }
  await saveStore(store)
}

export const createNote: CreateNote = async () => {
  const store = await loadStore()

  // prompt for title? For now let's generate a unique "Untitled"
  let title = 'Untitled'
  let counter = 1
  while (store.notes[title]) {
    title = `Untitled ${counter}`
    counter++
  }

  store.notes[title] = {
    title,
    content: '',
    lastEditTime: Date.now()
  }

  await saveStore(store)
  return title
}

export const deleteNote: DeleteNote = async (title) => {
  const store = await loadStore()
  if (store.notes[title]) {
    delete store.notes[title]
    await saveStore(store)
    return true
  }
  return false
}

export const renameNote: RenameNote = async (title, newTitle) => {
  const store = await loadStore()

  if (store.notes[newTitle]) {
    console.warn('Note with new title already exists')
    return false
  }

  const note = store.notes[title]
  if (!note) return false

  store.notes[newTitle] = {
    ...note,
    title: newTitle,
    lastEditTime: Date.now()
  }

  delete store.notes[title]
  await saveStore(store)
  return true
}

export const exportData: ExportData = async () => {
  const storePath = getStorePath()
  if (!(await pathExists(storePath))) return false

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Export Backup',
    defaultPath: 'flownote-backup.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })

  if (canceled || !filePath) return false

  try {
    await copy(storePath, filePath)
    return true
  } catch (error) {
    console.error('Export failed', error)
    return false
  }
}

export const importData: ImportData = async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: 'Import Notes Data',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  })

  if (canceled || filePaths.length === 0) return false

  try {
    const importPath = filePaths[0]
    const content = await readFile(importPath, { encoding: fileEncoding })
    // Verify it's valid JSON and has valid structure (basic check)
    const data = JSON.parse(content)
    if (!data.notes) throw new Error('Invalid backup file')

    // Replace current store
    const storePath = getStorePath()
    await writeFile(storePath, content, { encoding: fileEncoding })
    return true
  } catch (error) {
    console.error('Import failed', error)
    await dialog.showMessageBox({
      type: 'error',
      title: 'Import Failed',
      message: 'The selected file is not a valid FlowNote backup.'
    })
    return false
  }
}
