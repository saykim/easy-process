'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
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
import { DeviceCategory, NodeType } from '@/types';
import { createNode } from '@/lib/utils/nodeFactory';

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
  const { screenToFlowPosition } = useReactFlow();
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
    selectedNodeId,
    selectedEdgeId,
    deleteNode,
    deleteEdge,
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

      const newNode = createNode({ nodeType, position, deviceCategory });
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
    (nodeType: NodeType, position: { x: number; y: number }, deviceCategory?: DeviceCategory) => {
      if (!connectingNodeId) return;

      const newNode = createNode({ nodeType, position, deviceCategory });
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

  // Handle Delete/Backspace key for deleting selected nodes/edges
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();

        if (selectedEdgeId) {
          deleteEdge(selectedEdgeId);
        } else if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge]);

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
