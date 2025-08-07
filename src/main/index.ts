import { execSync } from 'child_process';
import { BrowserWindow, ipcMain } from 'electron';
import { createRequire } from 'module';
import { defaultConfig } from '../configs/config';
import packageJson from '../../package.json';
const require = createRequire(import.meta.url);

qwqnt.main.hooks.whenBrowserWindowCreated.peek(window => {
  window.on('show', () => update(window));
  window.on('focus', () => update(window));
});

ipcMain.on('MoreMaterials.update', () => {
  for(const window of BrowserWindow.getAllWindows()){
    update(window as BrowserWindow);
  }
});

ipcMain.handle('MoreMaterials.getPlatform', () => {
  return process.platform;
});

const blacklist = [
  '#/screen-record',      // 录屏
  '#/desktop-screenshot', // 截屏
  '#/notification',       // 通知
  '/screenshot.html'      // 26299版截屏
];


const update = (window: BrowserWindow) => {
  const url = window.webContents.getURL();
  const config = PluginSettings.main.readConfig(packageJson.name, defaultConfig);

  if(blacklist.some(item => url.includes(item))) return;
  if(!window.isVisible()) return;
  if(process.platform === 'win32'){
    if(!config.win32.transparent){
      window.setBackgroundMaterial(config.win32.material);
    }
    window.setBackgroundColor(config.win32.color);
  }
  if(process.platform == 'linux'){
    try {
      const ids = execSync('wmctrl -xl | grep qq.QQ', { encoding: 'utf-8' });
      for(const id of ids.trim().split('\n')){
        if(config.linux.material === 'none' || !config.linux.transparent){
          execSync(`xprop -id ${id.split(' ')[0]} -remove _KDE_NET_WM_BLUR_BEHIND_REGION`);
        }
        else if(config.linux.material === 'blur'){
          execSync(`xprop -id ${id.split(' ')[0]} -f _KDE_NET_WM_BLUR_BEHIND_REGION 32c -set _KDE_NET_WM_BLUR_BEHIND_REGION 0x0`);
        }
      }
    } catch(e){
      console.log(e);
    }
    window.setBackgroundColor(config.linux.color);
  }
}


require.cache['electron'] = new Proxy(require.cache['electron'] as NodeJS.Module, {
  get(target, property, receiver){
    const electron = Reflect.get(target, property, receiver);
    return property != 'exports' ? electron : new Proxy(electron, {
      get(target, property, receiver){
        const BrowserWindow = Reflect.get(target, property, receiver);
        return property != 'BrowserWindow' ? BrowserWindow : new Proxy(BrowserWindow, {
          construct(target, [options], newTarget){
            const config = PluginSettings.main.readConfig(packageJson.name, defaultConfig);

            if(process.platform == 'win32'){
              return Reflect.construct(target, [{
                ...options,
                transparent: options.transparent || config.win32.transparent,
              }], newTarget);
            }
            if(process.platform == 'linux'){
              return Reflect.construct(target, [{
                ...options,
                transparent: options.transparent || config.linux.transparent,
              }], newTarget);
            }
          },
        });
      },
    });
  },
});