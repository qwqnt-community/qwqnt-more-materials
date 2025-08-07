export interface IOSConfig {
  material: 'auto' | 'none' | 'mica' | 'acrylic' | 'tabbed';
  color: string;
  transparent: boolean;
};

export interface ILinuxConfig extends Omit<IOSConfig, 'material'> {
  material: 'blur' | 'none';
};

export interface IConfig {
  win32: IOSConfig;
  linux: ILinuxConfig;
};

export const defaultConfig: IConfig = {
  win32: {
    material: 'mica',
    color: 'rgba(0, 0, 0, 0)',
    transparent: false,
  },
  linux: {
    material: 'blur',
    color: 'rgba(255, 255, 255, 0.2)',
    transparent: true,
  },
};