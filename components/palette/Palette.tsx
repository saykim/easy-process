'use client';

import { NodeType, DeviceCategory } from '@/types';
import { NODE_TYPES, DEVICE_CATEGORIES } from '@/lib/constants/nodes';

interface PaletteItemProps {
  type: NodeType;
  label: string;
  icon?: string;
  category?: DeviceCategory;
  onDragStart: (event: React.DragEvent, type: NodeType, category?: DeviceCategory) => void;
}

function PaletteItem({ type, label, icon, category, onDragStart }: PaletteItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type, category)}
      className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 hover:border-blue-400 transition-colors"
    >
      {icon && <span className="text-xl">{icon}</span>}
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
      </div>
    </div>
  );
}

export function Palette() {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: NodeType,
    deviceCategory?: DeviceCategory
  ) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, deviceCategory }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Node Palette</h2>

      {/* Basic Nodes */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Basic Nodes</h3>
        <div className="space-y-2">
          <PaletteItem
            type="process"
            label="Process"
            icon="⚙️"
            onDragStart={onDragStart}
          />
          <PaletteItem
            type="decision"
            label="Decision"
            icon="◆"
            onDragStart={onDragStart}
          />
          <PaletteItem
            type="note"
            label="Note"
            icon="📝"
            onDragStart={onDragStart}
          />
        </div>
      </div>

      {/* Inspection Equipment */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Inspection Equipment
        </h3>
        <div className="space-y-2">
          {(Object.keys(DEVICE_CATEGORIES) as DeviceCategory[]).map((category) => {
            const info = DEVICE_CATEGORIES[category];
            return (
              <PaletteItem
                key={category}
                type="device"
                label={info.label}
                icon={info.icon}
                category={category}
                onDragStart={onDragStart}
              />
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-600">
        <p className="font-medium mb-1">How to use:</p>
        <p>Drag and drop nodes onto the canvas to build your process diagram.</p>
      </div>
    </div>
  );
}
