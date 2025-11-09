import { EdgeStyle } from '@/types';

export const EDGE_STYLES: Record<EdgeStyle, { label: string; strokeDasharray?: string; strokeWidth: number }> = {
  solid: {
    label: 'Solid Line',
    strokeWidth: 2,
  },
  dotted: {
    label: 'Dotted Line',
    strokeDasharray: '5,5',
    strokeWidth: 2,
  },
  bold: {
    label: 'Bold Line',
    strokeWidth: 4,
  },
};

export const DEFAULT_EDGE_STYLE: EdgeStyle = 'solid';
export const DEFAULT_EDGE_ANIMATED = false;
export const DEFAULT_EDGE_ARROW = true;
