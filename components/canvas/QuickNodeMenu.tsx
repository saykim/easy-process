'use client';

import { useEffect, useRef, KeyboardEvent } from 'react';
import { NodeType } from '@/types';
import { NODE_TYPES } from '@/lib/constants/nodes';

interface QuickNodeMenuProps {
  position: { x: number; y: number };
  onSelect: (nodeType: NodeType) => void;
  onClose: () => void;
}

export function QuickNodeMenu({ position, onSelect, onClose }: QuickNodeMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const nodeTypes = Object.keys(NODE_TYPES) as NodeType[];

  useEffect(() => {
    // Focus first button when menu opens
    const firstButton = menuRef.current?.querySelector('button');
    firstButton?.focus();

    // Handle ESC key
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const buttons = menuRef.current?.querySelectorAll('button');
    if (!buttons) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        (buttons[(index + 1) % buttons.length] as HTMLButtonElement)?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        (buttons[(index - 1 + buttons.length) % buttons.length] as HTMLButtonElement)?.focus();
        break;
    }
  };

  return (
    <>
      {/* Backdrop to close menu */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        ref={menuRef}
        role="menu"
        aria-label="Create new node"
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase" aria-hidden="true">
          Create Node
        </div>
        <div className="border-t border-gray-100" aria-hidden="true"></div>

        {nodeTypes.map((key, index) => {
          const value = NODE_TYPES[key];
          return (
            <button
              key={key}
              role="menuitem"
              onClick={() => {
                onSelect(key);
                onClose();
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
              aria-label={`Create ${value.label}: ${value.description}`}
            >
              <div className="font-medium text-gray-900">{value.label}</div>
              <div className="text-xs text-gray-500">{value.description}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}
