import { SettingsModal, WindowControls } from '@/components'

export const DraggableTopBar = () => {
  return (
    <header className="absolute inset-x-0 top-0 h-8 bg-transparent flex justify-end items-center px-4 z-50">
      <div className="flex items-center space-x-2">
        <SettingsModal />
        <WindowControls />
      </div>
    </header>
  )
}
