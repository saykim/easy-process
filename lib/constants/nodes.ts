import { NodeType, DeviceCategory } from '@/types';

export const NODE_TYPES: Record<NodeType, { label: string; description: string }> = {
  process: {
    label: 'Process',
    description: 'Standard process node',
  },
  device: {
    label: 'Inspection Device',
    description: 'Inspection equipment (X-ray, Metal Detector, Weight Checker)',
  },
  decision: {
    label: 'Decision',
    description: 'Decision/branching node (Yes/No)',
  },
  note: {
    label: 'Note',
    description: 'Annotation/comment node',
  },
};

export const DEVICE_CATEGORIES: Record<DeviceCategory, { label: string; icon: string; color: string }> = {
  xray: {
    label: 'X-Ray',
    icon: '📡',
    color: '#3b82f6', // blue
  },
  metal: {
    label: 'Metal Detector',
    icon: '🧲',
    color: '#8b5cf6', // purple
  },
  weight: {
    label: 'Weight Checker',
    icon: '⚖️',
    color: '#10b981', // green
  },
};

export const DEFAULT_NODE_SIZE = {
  width: 200,
  height: 80,
};

export const DECISION_NODE_SIZE = {
  width: 150,
  height: 150,
};

export const NOTE_NODE_SIZE = {
  width: 180,
  height: 100,
};
