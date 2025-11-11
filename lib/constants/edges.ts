import { EdgeStyle, EdgeArrowType } from '@/types';

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

export const EDGE_COLORS = [
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Pink', value: '#ec4899' },
];

export const EDGE_ARROW_TYPES: Record<EdgeArrowType, { label: string; description: string }> = {
  none: {
    label: 'No Arrow',
    description: 'No arrow markers',
  },
  forward: {
    label: 'Forward →',
    description: 'Arrow at the end',
  },
  backward: {
    label: 'Backward ←',
    description: 'Arrow at the start',
  },
  both: {
    label: 'Both ↔',
    description: 'Arrows at both ends',
  },
};

export const DEFAULT_EDGE_STYLE: EdgeStyle = 'solid';
export const DEFAULT_EDGE_COLOR = '#6b7280';
export const DEFAULT_EDGE_ARROW_TYPE: EdgeArrowType = 'forward';
export const DEFAULT_EDGE_ANIMATED = false;
