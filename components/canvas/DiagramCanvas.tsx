'use client';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Connection,
  ReactFlowProvider,
  Node,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDiagramStore } from '@/store/diagramStore';
import { ProcessNode } from '@/components/nodes/ProcessNode';
import { DeviceNode } from '@/components/nodes/DeviceNode';
import { DecisionNode } from '@/components/nodes/DecisionNode';
import { NoteNode } from '@/components/nodes/NoteNode';
import { CustomNodeData, DeviceCategory, NodeType } from '@/types';
import { DEFAULT_NODE_SIZE, DECISION_NODE_SIZE, NOTE_NODE_SIZE } from '@/lib/constants/nodes';

const nodeTypes = {
  process: ProcessNode,
  device: DeviceNode,
  decision: DecisionNode,
  note: NoteNode,
} as const;

function DiagramCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    addEdge,
    setSelectedNodeId,
    setSelectedEdgeId,
  } = useDiagramStore();

  const onConnect = useCallback(
    (connection: Connection) => {
      addEdge(connection);
    },
    [addEdge]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      const { nodeType, deviceCategory } = JSON.parse(data) as {
        nodeType: NodeType;
        deviceCategory?: DeviceCategory;
      };

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Determine node size based on type
      let size = DEFAULT_NODE_SIZE;
      if (nodeType === 'decision') {
        size = DECISION_NODE_SIZE;
      } else if (nodeType === 'note') {
        size = NOTE_NODE_SIZE;
      }

      // Create node data based on type
      let nodeData: CustomNodeData;
      switch (nodeType) {
        case 'device':
          nodeData = {
            type: 'device',
            props: {
              name: deviceCategory ? deviceCategory.toUpperCase() : 'Device',
              deviceMeta: {
                category: deviceCategory || 'xray',
              },
            },
          };
          break;
        case 'decision':
          nodeData = {
            type: 'decision',
            props: {
              name: 'Decision',
              condition: '',
              yesLabel: 'Yes',
              noLabel: 'No',
            },
          };
          break;
        case 'note':
          nodeData = {
            type: 'note',
            props: {
              name: 'Note',
              notes: '',
            },
          };
          break;
        default: // process
          nodeData = {
            type: 'process',
            props: {
              name: 'New Process',
            },
          };
      }

      const newNode: Node<CustomNodeData> = {
        id: `node-${Date.now()}`,
        type: nodeType,
        position,
        data: nodeData,
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: any) => {
      setSelectedEdgeId(edge.id);
    },
    [setSelectedEdgeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setSelectedNodeId, setSelectedEdgeId]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes as any}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { strokeWidth: 2 },
        }}
      >
        <Background color="#aaa" gap={15} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export function DiagramCanvas() {
  return (
    <ReactFlowProvider>
      <DiagramCanvasInner />
    </ReactFlowProvider>
  );
}
