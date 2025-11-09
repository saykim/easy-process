'use client';

import { Handle, Position } from '@xyflow/react';
import { CustomNodeData, DeviceNodeProps } from '@/types';
import { DEVICE_CATEGORIES } from '@/lib/constants/nodes';

interface DeviceNodeComponentProps {
  data: CustomNodeData;
  selected?: boolean;
}

export function DeviceNode({ data, selected }: DeviceNodeComponentProps) {
  const nodeData = data.props as DeviceNodeProps;
  const deviceMeta = nodeData.deviceMeta;
  const category = deviceMeta?.category || 'xray';
  const categoryInfo = DEVICE_CATEGORIES[category];

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg bg-white border-2 min-w-[200px] ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
      style={{ borderColor: selected ? categoryInfo.color : undefined }}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3"
        style={{ background: categoryInfo.color }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3"
        style={{ background: categoryInfo.color }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3"
        style={{ background: categoryInfo.color }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3"
        style={{ background: categoryInfo.color }}
      />

      {/* Node content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryInfo.icon}</span>
          <div className="font-semibold text-gray-900">
            {nodeData?.name || categoryInfo.label}
          </div>
        </div>
        {deviceMeta?.model && (
          <div className="text-xs text-gray-500">Model: {deviceMeta.model}</div>
        )}
        {deviceMeta?.manufacturer && (
          <div className="text-xs text-gray-500">Mfr: {deviceMeta.manufacturer}</div>
        )}
        {nodeData?.notes && (
          <div className="text-xs text-gray-500">{nodeData.notes}</div>
        )}
      </div>
    </div>
  );
}
