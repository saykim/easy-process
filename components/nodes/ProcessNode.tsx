'use client';

import { Handle, Position } from '@xyflow/react';
import { CustomNodeData } from '@/types';

interface ProcessNodeProps {
  data: CustomNodeData;
  selected?: boolean;
}

export function ProcessNode({ data, selected }: ProcessNodeProps) {
  const nodeData = data.props as any;

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg bg-white border-2 min-w-[200px] ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 !bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 !bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-blue-500"
      />

      {/* Node content */}
      <div className="space-y-1">
        <div className="font-semibold text-gray-900 border-b border-gray-200 pb-1">
          {nodeData?.name || 'Process'}
        </div>
        {nodeData?.inputs && (
          <div className="text-xs text-green-600">⬇️ In: {nodeData.inputs}</div>
        )}
        {nodeData?.outputs && (
          <div className="text-xs text-blue-600">⬆️ Out: {nodeData.outputs}</div>
        )}
        {nodeData?.operation && (
          <div className="text-xs text-purple-600">⚙️ {nodeData.operation}</div>
        )}
        {nodeData?.notes && (
          <div className="text-xs text-gray-500 italic">{nodeData.notes}</div>
        )}
      </div>
    </div>
  );
}
