import { searchQueryAtom } from '@/store'
import { useAtom } from 'jotai'
import { LuSearch } from 'react-icons/lu'

export const SearchInput = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [query, setQuery] = useAtom(searchQueryAtom)

  return (
    <div className={`relative px-2 ${className}`} {...props}>
      <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full bg-zinc-800/50 text-zinc-300 text-sm rounded-md pl-9 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-nano-banana transition-all duration-200"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
