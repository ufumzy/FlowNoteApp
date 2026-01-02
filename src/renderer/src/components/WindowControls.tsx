import { useEffect, useState } from 'react'
import { LuCopy, LuMinus, LuSquare, LuX } from 'react-icons/lu'

export const WindowControls = () => {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    // Initial check? Electron doesn't expose sync IS_MAXIMIZED easily to renderer without IPC
    // But we can listen for changes.
    // Ideally we might want to ask main process for initial state, but default is false.
    window.context.onWindowStateChange((state) => setIsMaximized(state))
  }, [])

  return (
    <div className="flex items-center space-x-2 -webkit-app-region-no-drag">
      <button
        onClick={() => window.context.minimizeWindow()}
        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
      >
        <LuMinus className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => window.context.maximizeWindow()}
        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
      >
        {isMaximized ? <LuCopy className="w-3 h-3 rotate-180" /> : <LuSquare className="w-3 h-3" />}
      </button>
      <button
        onClick={() => window.context.closeWindow()}
        className="p-1.5 hover:bg-red-500 rounded-md transition-colors text-zinc-400 hover:text-white group"
      >
        <LuX className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
