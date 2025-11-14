'use client';

import { Handle, Position, NodeResizer } from '@xyflow/react';
import { CustomNodeData, DecisionNodeProps } from '@/types';

interface DecisionNodeComponentProps {
  data: CustomNodeData;
  selected?: boolean;
}

export function DecisionNode({ data, selected }: DecisionNodeComponentProps) {
  const nodeData = data.props as DecisionNodeProps;

  return (
    <>
      <NodeResizer
        color="#eab308"
        isVisible={selected}
        minWidth={150}
        minHeight={150}
      />
      <div className="relative w-full h-full" style={{ minWidth: '150px', minHeight: '150px' }}>
      {/* Diamond shape - transparent background to allow edges to show through */}
      <div
        className={`absolute inset-0 transform rotate-45 shadow-md border-2 ${
          selected ? 'border-yellow-500' : 'border-yellow-400'
        }`}
        style={{ backgroundColor: 'transparent' }}
      />

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 !bg-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 !bg-yellow-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-yellow-500"
      />

      {/* Content (not rotated) - with background for readability */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-3 py-2 max-w-[100px] bg-yellow-50 rounded shadow-sm">
          <div className="font-semibold text-gray-900 text-sm break-words whitespace-pre-wrap">
            {nodeData?.name || nodeData?.condition || 'Decision?'}
          </div>
        </div>
      </div>

      {/* Yes/No labels */}
      {(nodeData?.yesLabel || nodeData?.noLabel) && (
        <>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">
            {nodeData.yesLabel || 'Yes'}
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-red-600 font-medium">
            {nodeData.noLabel || 'No'}
          </div>
        </>
      )}
    </div>
    </>
  );
}
