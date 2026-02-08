const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    // File system operations
    openFolder: async (folderType) => {
        if (folderType === 'drawings') {
            return await ipcRenderer.invoke('open-drawing-folder');
        }
        return { success: false, error: 'Unknown folder type' };
    },

    // Location services
    getLocation: () => ipcRenderer.invoke('get-location'),

    // Notifications
    showNotification: (title, body) => {
        ipcRenderer.send('show-notification', { title, body });
    },

    // Show file in folder
    showItemInFolder: (filePath) => {
        ipcRenderer.send('show-item-in-folder', filePath);
    }
});

console.log('✅ Preload script loaded - Electron APIs exposed');
