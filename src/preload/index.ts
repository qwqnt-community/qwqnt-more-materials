import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('MoreMaterials', {
  update: () => {
    ipcRenderer.send('MoreMaterials.update');
  },
  getPlatform: (): Promise<string> => ipcRenderer.invoke('MoreMaterials.getPlatform'),
});