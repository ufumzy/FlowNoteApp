import { notesAtom, selectedNoteAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const setNotes = useSetAtom(notesAtom)
  const [title, setTitle] = useState(selectedNote?.title || '')

  useEffect(() => {
    setTitle(selectedNote?.title || '')
  }, [selectedNote?.title])

  const handleRename = async () => {
    if (!selectedNote || !title || title === selectedNote.title) return

    const success = await window.context.renameNote(selectedNote.title, title)
    if (success) {
      setNotes((prev) => {
        if (!prev || !Array.isArray(prev)) return prev
        return prev.map((note) => {
          if (note.title === selectedNote.title) {
            return { ...note, title, lastEditTime: Date.now() }
          }
          return note
        })
      })
    } else {
      setTitle(selectedNote.title) // Revert on failure
    }
  }

  if (!selectedNote) return null

  return (
    <div className={twMerge('flex justify-center pointer-events-none', className)} {...props}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleRename}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        className="text-center bg-transparent border-none outline-none text-gray-400 focus:text-white transition-colors w-full max-w-md pointer-events-auto"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      />
    </div>
  )
}
