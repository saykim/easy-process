import { Node } from '@xyflow/react';
import { CustomNodeData, NodeType, DeviceCategory } from '@/types';
import { generateNodeId } from './idGenerator';

interface CreateNodeOptions {
  nodeType: NodeType;
  position: { x: number; y: number };
  deviceCategory?: DeviceCategory;
}

export function createNode({ nodeType, position, deviceCategory }: CreateNodeOptions): Node<CustomNodeData> {
  let nodeData: CustomNodeData;

  switch (nodeType) {
    case 'device':
      nodeData = {
        type: 'device',
        props: {
          name: deviceCategory ? deviceCategory.toUpperCase() : 'Device',
          deviceMeta: {
            category: deviceCategory || 'xray',
          },
        },
      };
      break;

    case 'decision':
      nodeData = {
        type: 'decision',
        props: {
          name: 'Decision',
          condition: '',
          yesLabel: 'Yes',
          noLabel: 'No',
        },
      };
      break;

    case 'note':
      nodeData = {
        type: 'note',
        props: {
          name: 'Note',
          notes: '',
        },
      };
      break;

    default: // process
      nodeData = {
        type: 'process',
        props: {
          name: 'New Process',
        },
      };
  }

  return {
    id: generateNodeId(),
    type: nodeType,
    position,
    data: nodeData,
  };
}
