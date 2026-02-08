const electron = require('electron');
console.log('--- MAIN PROCESS AUDIT ---');
console.log('Process Path:', process.execPath);
console.log('Versions:', JSON.stringify(process.versions, null, 2));
console.log('Electron Module Type:', typeof electron);
console.log('Electron Module Keys:', Object.keys(electron));

const { app, BrowserWindow, ipcMain, shell, Notification } = electron;

console.log('app exists:', !!app);
console.log('ipcMain exists:', !!ipcMain);

const path = require('path');
const fs = require('fs');

console.log('✅ Yogesh Desktop Main Process Starting...');

function createWindow() {
    const isDev = !app.isPackaged;
    const win = new BrowserWindow({
        width: 1280,
        height: 850,
        title: 'Yogesh Constructions',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
    });

    win.loadURL(
        isDev
            ? 'http://localhost:5000'
            : `file://${path.join(__dirname, 'dist/index.html')}`
    );

    if (!isDev) {
        win.setMenuBarVisibility(false);
    } else {
        win.webContents.openDevTools();
    }
}

if (ipcMain) {
    ipcMain.handle('get-location', async () => {
        return { lat: 40.7128, lng: -74.0060, accuracy: '±2m', timestamp: new Date().toISOString() };
    });

    // Open drawing files folder
    ipcMain.handle('open-drawing-folder', async () => {
        const drawingPath = path.join(app.getPath('documents'), 'Yogesh_Constructions', 'Drawings');

        try {
            if (!fs.existsSync(drawingPath)) {
                console.log('📁 Creating drawings directory:', drawingPath);
                fs.mkdirSync(drawingPath, { recursive: true });
            }

            const error = await shell.openPath(drawingPath);
            if (error) {
                console.error('❌ Failed to open drawings folder:', error);
                return { success: false, error };
            }

            console.log('✅ Drawings folder opened:', drawingPath);
            return { success: true, path: drawingPath };
        } catch (err) {
            console.error('💥 Error opening drawings folder:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.on('open-explorer', async (event, folderPath) => {
        // Use a specific subfolder for drawings as per user request
        const defaultPath = path.join(app.getPath('home'), 'drawing_files');
        const targetPath = folderPath || defaultPath;

        console.log('📂 Attempting to open explorer at:', targetPath);

        try {
            // Ensure the directory exists
            if (!fs.existsSync(targetPath)) {
                console.log('📁 Path does not exist. Creating directory:', targetPath);
                fs.mkdirSync(targetPath, { recursive: true });
            }

            const error = await shell.openPath(targetPath);
            if (error) console.error('❌ Failed to open path:', error);
            else console.log('✅ Explorer opened successfully');
        } catch (err) {
            console.error('💥 Error in open-explorer:', err);
        }
    });

    ipcMain.on('show-item-in-folder', (event, filePath) => {
        shell.showItemInFolder(filePath);
    });

    ipcMain.on('show-notification', (event, { title, body }) => {
        new Notification({ title, body }).show();
    });
} else {
    console.error('❌ CRITICAL: ipcMain is undefined. Desktop features will NOT work.');
}

if (app) {
    app.whenReady().then(createWindow);
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
} else {
    console.error('❌ CRITICAL: app is undefined. Application cannot start.');
}
