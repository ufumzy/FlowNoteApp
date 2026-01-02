import { NotePreview } from '@/components'
import { useNotesList } from '@/hooks/useNotesList'
import { searchQueryAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { isEmpty } from 'lodash'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type NotePreviewListProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}

export const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewListProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({ onSelect })
  const searchQuery = useAtomValue(searchQueryAtom)

  if (!notes) return null

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isEmpty(filteredNotes)) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No Notes Found!</span>
      </ul>
    )
  }

  return (
    <ul className={className} {...props}>
      {filteredNotes.map((note, index) => (
        <NotePreview
          key={note.title + note.lastEditTime}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          {...note}
        />
      ))}
    </ul>
  )
}
