/// <reference types="vite/client" />

declare namespace MoreMaterials {
  const update: () => void;
  const getPlatform: () => Promise<string>;
}

declare namespace RendererEvents {
  const onSettingsWindowCreated: (callback: () => void) => void;
}

interface IQwQNTPlugin {
  name: string;
  qwqnt: {
    name: string;
    icon?: string;
    inject?: {
      renderer?: string;
      preload?: string;
    };
    settings?: string;
  };
}

declare namespace PluginSettings {
  interface ICommon {
    readConfig: <T>(id: string, defaultConfig?: T) => T;
    writeConfig: <T>(id: string, newConfig: T) => boolean;
    openPath: (path: string) => void;
    openExternal: (url: string) => void;
  }
  interface IRenderer extends ICommon {
    registerPluginSettings: (packageJson: IQwQNTPlugin) => Promise<HTMLDivElement>;
  }

  const main: ICommon;
  const preload: ICommon;
  const renderer: IRenderer;
}
