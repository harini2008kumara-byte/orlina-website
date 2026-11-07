import type { AvatarId } from '@/types/orlina';

export interface AvatarPalette {
  glow: string;
  skinLight: string;
  skinDark: string;
  hairLight: string;
  hairDark: string;
  clothLight: string;
  clothDark: string;
  trim: string;
  irisLight: string;
  irisDark: string;
  brow: string;
  lip: string;
  blush: string;
}

export interface FigureIds {
  halo: string;
  skin: string;
  hair: string;
  cloth: string;
  iris: string;
}

export const AVATAR_PALETTES: Record<AvatarId, AvatarPalette> = {
  girl: {
    glow: '#8A6BFF',
    skinLight: '#F7DDCD',
    skinDark: '#D9A58C',
    hairLight: '#5B4AA3',
    hairDark: '#16122F',
    clothLight: '#F1F4F9',
    clothDark: '#8F9CB4',
    trim: '#8A6BFF',
    irisLight: '#C2B2FF',
    irisDark: '#4A2DB5',
    brow: '#1A1438',
    lip: '#B5606F',
    blush: '#E79AB0',
  },
  boy: {
    glow: '#5B8DEF',
    skinLight: '#F3D5BE',
    skinDark: '#C99A7E',
    hairLight: '#34508F',
    hairDark: '#0A1224',
    clothLight: '#2C3B6B',
    clothDark: '#0D1530',
    trim: '#C9D2DC',
    irisLight: '#A3C6F5',
    irisDark: '#2B4C94',
    brow: '#0C1426',
    lip: '#A8646A',
    blush: '#D9907F',
  },
  neutral: {
    glow: '#C9D2DC',
    skinLight: '#F5DCCA',
    skinDark: '#CFA18B',
    hairLight: '#F4F7FB',
    hairDark: '#7A8699',
    clothLight: '#8A6BFF',
    clothDark: '#2A2056',
    trim: '#C9D2DC',
    irisLight: '#B0C4DE',
    irisDark: '#4C6382',
    brow: '#6E7A8E',
    lip: '#B2736F',
    blush: '#E0A7A0',
  },
};

export function createFigureIds(prefix: string): FigureIds {
  return {
    halo: `${prefix}-halo`,
    skin: `${prefix}-skin`,
    hair: `${prefix}-hair`,
    cloth: `${prefix}-cloth`,
    iris: `${prefix}-iris`,
  };
}
