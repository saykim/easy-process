'use client';

import { useDiagramStore } from '@/store/diagramStore';
import { NodeType, DeviceNodeProps, DecisionNodeProps, BaseNodeProps } from '@/types';
import { DEVICE_CATEGORIES } from '@/lib/constants/nodes';

export function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNodeData, deleteNode } = useDiagramStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Properties</h2>
        <p className="text-sm text-gray-500">Select a node to edit its properties</p>
      </div>
    );
  }

  const nodeType = selectedNode.data.type;
  const nodeProps = selectedNode.data.props as any;

  const handleUpdate = (field: string, value: any) => {
    updateNodeData(selectedNode.id, {
      props: {
        ...nodeProps,
        [field]: value,
      },
    });
  };

  const handleDeviceMetaUpdate = (field: string, value: any) => {
    const deviceProps = nodeProps as DeviceNodeProps;
    updateNodeData(selectedNode.id, {
      props: {
        ...nodeProps,
        deviceMeta: {
          ...deviceProps.deviceMeta,
          [field]: value,
        },
      },
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this node?')) {
      deleteNode(selectedNode.id);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Properties</h2>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </div>

      {/* Common fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nodeProps?.name || ''}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter node name"
          />
        </div>

        {/* Device-specific fields */}
        {nodeType === 'device' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Type
              </label>
              <select
                value={(nodeProps as DeviceNodeProps).deviceMeta?.category || 'xray'}
                onChange={(e) => handleDeviceMetaUpdate('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(DEVICE_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.icon} {value.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                value={(nodeProps as DeviceNodeProps).deviceMeta?.manufacturer || ''}
                onChange={(e) => handleDeviceMetaUpdate('manufacturer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mettler Toledo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={(nodeProps as DeviceNodeProps).deviceMeta?.model || ''}
                onChange={(e) => handleDeviceMetaUpdate('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., XR-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Cycle
              </label>
              <input
                type="text"
                value={(nodeProps as DeviceNodeProps).deviceMeta?.inspectionCycle || ''}
                onChange={(e) => handleDeviceMetaUpdate('inspectionCycle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alarm Criteria
              </label>
              <input
                type="text"
                value={(nodeProps as DeviceNodeProps).deviceMeta?.alarmCriteria || ''}
                onChange={(e) => handleDeviceMetaUpdate('alarmCriteria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., >2mm Fe detected"
              />
            </div>
          </>
        )}

        {/* Decision-specific fields */}
        {nodeType === 'decision' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <input
                type="text"
                value={(nodeProps as DecisionNodeProps).condition || ''}
                onChange={(e) => handleUpdate('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Temperature > 80°C?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yes Label
              </label>
              <input
                type="text"
                value={(nodeProps as DecisionNodeProps).yesLabel || ''}
                onChange={(e) => handleUpdate('yesLabel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No Label
              </label>
              <input
                type="text"
                value={(nodeProps as DecisionNodeProps).noLabel || ''}
                onChange={(e) => handleUpdate('noLabel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="No"
              />
            </div>
          </>
        )}

        {/* Process-specific fields */}
        {(nodeType === 'process' || nodeType === 'device') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Output/Product
              </label>
              <input
                type="text"
                value={nodeProps?.outputs || ''}
                onChange={(e) => handleUpdate('outputs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Batch 100kg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operation Method
              </label>
              <textarea
                value={nodeProps?.operation || ''}
                onChange={(e) => handleUpdate('operation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., RPM 120, 10min"
                rows={3}
              />
            </div>
          </>
        )}

        {/* Common notes field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Special Instructions
          </label>
          <textarea
            value={nodeProps?.notes || ''}
            onChange={(e) => handleUpdate('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
