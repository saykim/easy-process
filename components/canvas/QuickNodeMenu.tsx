'use client';

import { NodeType } from '@/types';
import { NODE_TYPES } from '@/lib/constants/nodes';

interface QuickNodeMenuProps {
  position: { x: number; y: number };
  onSelect: (nodeType: NodeType) => void;
  onClose: () => void;
}

export function QuickNodeMenu({ position, onSelect, onClose }: QuickNodeMenuProps) {
  return (
    <>
      {/* Backdrop to close menu */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
          Create Node
        </div>
        <div className="border-t border-gray-100"></div>

        {Object.entries(NODE_TYPES).map(([key, value]) => (
          <button
            key={key}
            onClick={() => {
              onSelect(key as NodeType);
              onClose();
            }}
            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">{value.label}</div>
            <div className="text-xs text-gray-500">{value.description}</div>
          </button>
        ))}
      </div>
    </>
  );
}
