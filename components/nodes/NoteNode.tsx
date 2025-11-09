'use client';

import { Handle, Position } from '@xyflow/react';
import { CustomNodeData } from '@/types';

interface NoteNodeComponentProps {
  data: CustomNodeData;
  selected?: boolean;
}

export function NoteNode({ data, selected }: NoteNodeComponentProps) {
  const nodeData = data.props as any;

  return (
    <div
      className={`px-4 py-3 shadow-sm rounded bg-yellow-100 border-l-4 min-w-[180px] ${
        selected ? 'border-yellow-500' : 'border-yellow-400'
      }`}
    >
      {/* Optional handles for notes (they can also be connected) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-yellow-500"
      />

      {/* Note content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">📝</span>
          <div className="font-medium text-gray-900 text-sm">
            {nodeData?.name || 'Note'}
          </div>
        </div>
        {nodeData?.notes && (
          <div className="text-xs text-gray-600 whitespace-pre-wrap">
            {nodeData.notes}
          </div>
        )}
      </div>
    </div>
  );
}
