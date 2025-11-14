'use client';

import { Handle, Position, NodeResizer } from '@xyflow/react';
import { CustomNodeData, BaseNodeProps } from '@/types';

interface ProcessNodeComponentProps {
  data: CustomNodeData;
  selected?: boolean;
}

export function ProcessNode({ data, selected }: ProcessNodeComponentProps) {
  const nodeData = data.props as BaseNodeProps;

  return (
    <>
      <NodeResizer
        color="#3b82f6"
        isVisible={selected}
        minWidth={200}
        minHeight={80}
      />
      <div
        className={`px-4 py-3 shadow-md rounded-lg bg-white border-2 w-full h-full ${
          selected ? 'border-blue-500' : 'border-gray-300'
        }`}
        style={{ minWidth: '200px', minHeight: '80px' }}
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
            <div className="text-xs text-purple-600 whitespace-pre-wrap">⚙️ {nodeData.operation}</div>
          )}
          {nodeData?.notes && (
            <div className="text-xs text-gray-500 italic whitespace-pre-wrap">{nodeData.notes}</div>
          )}
        </div>
      </div>
    </>
  );
}
