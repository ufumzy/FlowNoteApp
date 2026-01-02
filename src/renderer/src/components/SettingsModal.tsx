import { settingsAtom } from '@/store'
import * as Dialog from '@radix-ui/react-dialog'
import { useAtom } from 'jotai'
import { LuSettings, LuX } from 'react-icons/lu'

export const SettingsModal = () => {
  const [settings, setSettings] = useAtom(settingsAtom)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white">
          <LuSettings className="w-4 h-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-nano-obsidian border border-white/10 p-6 rounded-lg w-[400px] z-50 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold">Settings</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 hover:bg-white/10 rounded-md transition-colors">
                <LuX className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Font Size ({settings.fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                className="w-full accent-nano-banana"
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
              />
            </div>

            {/* Background & Font Color */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Background Color</label>
                <div className="flex gap-2">
                  {['#1C1C1E', '#000000', '#1A1A1A', '#2C2C2E'].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        settings.backgroundColor === color
                          ? 'border-nano-banana scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSettings({ ...settings, backgroundColor: color })}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-zinc-500">Custom Hex:</span>
                  <input
                    type="text"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white w-20 outline-none focus:border-nano-banana"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Font Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.fontColor}
                    onChange={(e) => setSettings({ ...settings, fontColor: e.target.value })}
                    className="bg-transparent border-none w-8 h-8 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.fontColor}
                    onChange={(e) => setSettings({ ...settings, fontColor: e.target.value })}
                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white w-20 outline-none focus:border-nano-banana"
                  />
                </div>
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">
                Window Opacity ({Math.round(settings.opacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                className="w-full accent-nano-banana"
                value={settings.opacity}
                onChange={(e) => setSettings({ ...settings, opacity: Number(e.target.value) })}
              />
            </div>

            {/* Data Management */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-sm text-zinc-400">Data Management</label>
              <div className="flex space-x-2">
                <button
                  onClick={async () => {
                    await window.context.exportData()
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-md transition-colors text-sm"
                >
                  Backup Data
                </button>
                <button
                  onClick={async () => {
                    await window.context.importData()
                    window.location.reload()
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-md transition-colors text-sm"
                >
                  Restore Data
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
