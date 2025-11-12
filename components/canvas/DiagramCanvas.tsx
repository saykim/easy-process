'use client';

import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Connection,
  ReactFlowProvider,
  Node,
  useReactFlow,
  OnConnectStartParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDiagramStore } from '@/store/diagramStore';
import { ProcessNode } from '@/components/nodes/ProcessNode';
import { DeviceNode } from '@/components/nodes/DeviceNode';
import { DecisionNode } from '@/components/nodes/DecisionNode';
import { NoteNode } from '@/components/nodes/NoteNode';
import { CustomEdge } from '@/components/edges/CustomEdge';
import { QuickNodeMenu } from '@/components/canvas/QuickNodeMenu';
import { CustomNodeData, DeviceCategory, NodeType } from '@/types';
import { DEFAULT_NODE_SIZE, DECISION_NODE_SIZE, NOTE_NODE_SIZE } from '@/lib/constants/nodes';

const nodeTypes = {
  process: ProcessNode,
  device: DeviceNode,
  decision: DecisionNode,
  note: NoteNode,
} as const;

const edgeTypes = {
  default: CustomEdge,
} as const;

function DiagramCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getNode } = useReactFlow();
  const [connectingNodeId, setConnectingNodeId] = useState<OnConnectStartParams | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [pendingNodePosition, setPendingNodePosition] = useState<{ x: number; y: number } | null>(null);

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

  const onConnectStart = useCallback((_: any, params: OnConnectStartParams) => {
    setConnectingNodeId(params);
  }, []);

  const createNodeAndConnect = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }) => {
      if (!connectingNodeId) return;

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
              name: 'Device',
              deviceMeta: {
                category: 'xray',
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

      // Create connection from source to new node
      const sourceNode = connectingNodeId.nodeId;
      const sourceHandle = connectingNodeId.handleId;

      if (sourceNode) {
        // Determine if source is output or input based on handleType
        const connection: Connection = connectingNodeId.handleType === 'source'
          ? {
              source: sourceNode,
              sourceHandle: sourceHandle,
              target: newNode.id,
              targetHandle: 'top',
            }
          : {
              source: newNode.id,
              sourceHandle: 'bottom',
              target: sourceNode,
              targetHandle: sourceHandle,
            };

        addEdge(connection);
      }

      setConnectingNodeId(null);
    },
    [connectingNodeId, addNode, addEdge]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId) return;

      const targetIsPane = (event.target as HTMLElement).classList.contains('react-flow__pane');

      if (targetIsPane && reactFlowWrapper.current) {
        const { clientX, clientY } = 'touches' in event ? event.touches[0] : event;
        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        // Show menu at mouse position
        setMenuPosition({ x: clientX, y: clientY });
        setPendingNodePosition(position);
      } else {
        setConnectingNodeId(null);
      }
    },
    [connectingNodeId, screenToFlowPosition]
  );

  const handleNodeTypeSelect = useCallback(
    (nodeType: NodeType) => {
      if (pendingNodePosition) {
        createNodeAndConnect(nodeType, pendingNodePosition);
        setPendingNodePosition(null);
      }
    },
    [pendingNodePosition, createNodeAndConnect]
  );

  const handleMenuClose = useCallback(() => {
    setMenuPosition(null);
    setPendingNodePosition(null);
    setConnectingNodeId(null);
  }, []);

  return (
    <div ref={reactFlowWrapper} className="flex-1 bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes as any}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
        }}
      >
        <Background color="#aaa" gap={15} />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Quick Node Creation Menu */}
      {menuPosition && (
        <QuickNodeMenu
          position={menuPosition}
          onSelect={handleNodeTypeSelect}
          onClose={handleMenuClose}
        />
      )}
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
