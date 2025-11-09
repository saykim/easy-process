'use client';

import { useDiagramStore } from '@/store/diagramStore';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function Toolbar({ onSave, onLoad, onExport, onClear }: ToolbarProps) {
  const { diagramTitle, setDiagramTitle, nodes, edges } = useDiagramStore();

  return (
    <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">Food Process Designer</h1>
        <div className="h-6 w-px bg-gray-300" />
        <input
          type="text"
          value={diagramTitle}
          onChange={(e) => setDiagramTitle(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Diagram title"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {nodes.length} nodes, {edges.length} edges
        </span>
        <div className="h-6 w-px bg-gray-300" />
        <button
          onClick={onLoad}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Load
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Save
        </button>
        <button
          onClick={onExport}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Export
        </button>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
