import {
  createNote,
  deleteNote,
  exportData,
  getNotes,
  importData,
  readNote,
  renameNote,
  writeNote
} from '@/lib'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
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
import { BrowserWindow, app, ipcMain, screen, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

/**
 * Creates the main browser window.
 */
function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    center: true,
    title: 'FlowNote',
    frame: false,
    transparent: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  // Listen for window state changes
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-change', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-change', false)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) => getNotes(...args))
  ipcMain.handle('readNote', (_, ...args: Parameters<ReadNote>) => readNote(...args))
  ipcMain.handle('writeNote', (_, ...args: Parameters<WriteNote>) => writeNote(...args))
  ipcMain.handle('createNote', (_, ...args: Parameters<CreateNote>) => createNote(...args))
  ipcMain.handle('deleteNote', (_, ...args: Parameters<DeleteNote>) => deleteNote(...args))
  ipcMain.handle('renameNote', (_, ...args: Parameters<RenameNote>) => renameNote(...args))
  ipcMain.handle('exportData', (_, ...args: Parameters<ExportData>) => exportData(...args))
  ipcMain.handle('importData', (_, ...args: Parameters<ImportData>) => importData(...args))

  /**
   * Minimizes the window that triggered the event.
   */
  ipcMain.on('minimizeWindow', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) window.minimize()
  })

  /**
   * Toggles the maximize/restore state of the window that triggered the event.
   */
  ipcMain.on('maximizeWindow', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      const bounds = window.getBounds()
      const { workArea } = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y })
      const isVisuallyMaximized = bounds.width >= workArea.width && bounds.height >= workArea.height

      console.log('Maximize Debug:', {
        isMaximized: window.isMaximized(),
        isVisuallyMaximized,
        bounds,
        workArea
      })

      // Check if maximized OR if dimensions match work area (robust fallback for frameless windows)
      if (window.isMaximized() || isVisuallyMaximized) {
        console.log('Restoring window...')
        window.restore()

        // Fallback: If bounds didn't change (e.g. restore failed on frameless window), explicitly set size
        const newBounds = window.getBounds()
        if (newBounds.width === bounds.width && newBounds.height === bounds.height) {
          console.log('Restore failed to resize, enforcing default size (900x670).')
          window.unmaximize() // Ensure internal flag is cleared
          window.setBounds({ width: 900, height: 670, x: bounds.x, y: bounds.y })
          window.center()
        }

        // Force state update because event might not fire if isMaximized was false
        window.webContents.send('window-state-change', false)
      } else {
        console.log('Maximizing window...')
        window.maximize()
        // Force state update
        window.webContents.send('window-state-change', true)
      }
    }
  })

  /**
   * Closes the window that triggered the event.
   */
  ipcMain.on('closeWindow', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) window.close()
  })

  // Create the splash window
  const splashWindow = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  splashWindow.loadFile(join(__dirname, '../../resources/splash.html'))

  const mainWindow = createWindow()

  // Wait for main window to be ready, then delay slightly for splash effect
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.close()
      mainWindow.show()
    }, 1000) // 1 second delay
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
