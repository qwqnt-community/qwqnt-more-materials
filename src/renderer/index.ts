import packageJson from '../../package.json';
import { defaultConfig, type IConfig } from '../configs/config';

const update = (callback: (event: Event, config: IConfig) => void) => {
  return (event: Event) => {
    const config = PluginSettings.renderer.readConfig(packageJson.name, defaultConfig);
    callback(event, config);
    PluginSettings.renderer.writeConfig(packageJson.name, config);
    MoreMaterials.update();
  };
};

RendererEvents.onSettingsWindowCreated(async () => {
  const view = await PluginSettings.renderer.registerPluginSettings(packageJson);

  const config = PluginSettings.renderer.readConfig(packageJson.name, defaultConfig);
  const pluginPath = __self.meta.path;
  const settingsPageStoragePath = qwqnt.framework.protocol.pathToStorageUrl(`${pluginPath}\\pages\\settings.html`);

  view.innerHTML = await (await fetch(settingsPageStoragePath)).text();

  const platform = await MoreMaterials.getPlatform();
  if(platform == 'win32'){
    view.querySelector('.windows setting-list')!.setAttribute('is-active', '');
  }
  if(platform == 'linux'){
    view.querySelector('.linux setting-list')!.setAttribute('is-active', '');
  }

  const win32_material = view.querySelectorAll('.windows setting-select')[0];
  win32_material.querySelector<HTMLElement>(`[data-value='${config.win32.material}']`)!.click();
  win32_material.addEventListener('selected', update((event, config) => {
    config.win32.material = (event as CustomEvent).detail.value;
  }));

  const win32_color = view.querySelectorAll('.windows input')[0] as HTMLInputElement;
  win32_color.value = config.win32.color;
  win32_color.addEventListener('change', update((event, config) => {
    config.win32.color = (event.target as HTMLInputElement).value;
  }));

  const win32_transparent = view.querySelectorAll('.windows setting-switch')[0];
  win32_transparent.toggleAttribute('is-active', config.win32.transparent);
  win32_transparent.addEventListener('click', update((event, config) => {
    (event.target as HTMLElement).toggleAttribute('is-active');
    config.win32.transparent = (event.target as HTMLElement).hasAttribute('is-active');
  }));

  const linux_material = view.querySelectorAll('.linux setting-select')[0];
  linux_material.querySelector<HTMLElement>(`[data-value='${config.linux.material}']`)!.click()
  linux_material.addEventListener('selected', update((event, config) => {
    config.linux.material = (event as CustomEvent).detail.value;
  }));

  const linux_color = view.querySelectorAll('.linux input')[0] as HTMLInputElement;
  linux_color.value = config.linux.color;
  linux_color.addEventListener('change', update((event, config) => {
    config.linux.color = (event.target as HTMLInputElement).value;
  }));

  const linux_transparent = view.querySelectorAll('.linux setting-switch')[0];
  linux_transparent.toggleAttribute('is-active', config.linux.transparent);
  linux_transparent.addEventListener('click', update((event, config) => {
    (event.target as HTMLElement).toggleAttribute('is-active');
    config.linux.transparent = (event.target as HTMLElement).hasAttribute('is-active');
  }));
});