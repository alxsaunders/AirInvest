import { IconName } from './types';

const iconMap: Record<IconName, string> = {
  flip: './assets/icons/flip.svg',
};

export const getIconPath = (name: IconName): string => {
  return iconMap[name] || '';
};

export const isValidIconName = (name: string): name is IconName => {
  return name in iconMap;
};