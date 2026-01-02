import { LuBanana, LuPlus } from 'react-icons/lu'

export const WelcomeScreen = ({ onCreateFirstNote }: { onCreateFirstNote: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-300 space-y-8 animate-in fade-in duration-500">
      <div className="relative group cursor-default">
        <div className="absolute -inset-4 bg-nano-banana/20 rounded-full blur-xl group-hover:bg-nano-banana/30 transition-all duration-500" />
        <LuBanana className="w-24 h-24 text-nano-banana relative z-10 drop-shadow-[0_0_15px_rgba(255,225,53,0.5)] transform group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="text-center space-y-2 max-w-md px-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Welcome to FlowNote</h1>
        <p className="text-zinc-400 text-lg">
          The premium, distraction-free markdown editor for your brilliant ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-500 max-w-lg w-full px-8">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
          <span className="text-2xl">📝</span>
          <span>Markdown Support</span>
        </div>
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
          <span className="text-2xl">🔒</span>
          <span>Local Storage</span>
        </div>
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
          <span className="text-2xl">⚡</span>
          <span>Instant Search</span>
        </div>
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
          <span className="text-2xl">🎨</span>
          <span>Custom Themes</span>
        </div>
      </div>

      <button
        onClick={onCreateFirstNote}
        className="group flex items-center space-x-2 bg-nano-banana text-nano-obsidian font-bold px-8 py-3 rounded-full hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,225,53,0.3)] hover:shadow-[0_0_30px_rgba(255,225,53,0.5)]"
      >
        <LuPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span>Create First Note</span>
      </button>
    </div>
  )
}
