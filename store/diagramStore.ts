import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { CustomNodeData, CustomEdgeData, DiagramType, EdgeStyle } from '@/types';
import { DEFAULT_EDGE_STYLE, DEFAULT_EDGE_COLOR, DEFAULT_EDGE_ARROW_TYPE } from '@/lib/constants/edges';
import { generateEdgeId } from '@/lib/utils/idGenerator';

interface DiagramState {
  // Diagram metadata
  diagramType: DiagramType;
  diagramTitle: string;

  // Canvas state
  nodes: Node<CustomNodeData>[];
  edges: Edge<CustomEdgeData>[];

  // Selected elements
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Actions
  setDiagramType: (type: DiagramType) => void;
  setDiagramTitle: (title: string) => void;

  // Node actions
  setNodes: (nodes: Node<CustomNodeData>[]) => void;
  onNodesChange: (changes: NodeChange<Node<CustomNodeData>>[]) => void;
  addNode: (node: Node<CustomNodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void;
  deleteNode: (nodeId: string) => void;

  // Edge actions
  setEdges: (edges: Edge<CustomEdgeData>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge<CustomEdgeData>>[]) => void;
  addEdge: (connection: Connection, style?: EdgeStyle) => void;
  updateEdgeData: (edgeId: string, data: Partial<CustomEdgeData>) => void;
  deleteEdge: (edgeId: string) => void;

  // Selection
  setSelectedNodeId: (nodeId: string | null) => void;
  setSelectedEdgeId: (edgeId: string | null) => void;

  // Utilities
  clearDiagram: () => void;
  loadDiagram: (nodes: Node<CustomNodeData>[], edges: Edge<CustomEdgeData>[]) => void;
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  // Initial state
  diagramType: 'flow',
  diagramTitle: 'Untitled Diagram',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  // Diagram metadata actions
  setDiagramType: (type) => set({ diagramType: type }),
  setDiagramTitle: (title) => set({ diagramTitle: title }),

  // Node actions
  setNodes: (nodes) => set({ nodes }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  // Edge actions
  setEdges: (edges) => set({ edges }),

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge: (connection, style = DEFAULT_EDGE_STYLE) => {
    const newEdge: Edge<CustomEdgeData> = {
      id: generateEdgeId(),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'default',
      data: {
        style,
        color: DEFAULT_EDGE_COLOR,
        arrowType: DEFAULT_EDGE_ARROW_TYPE,
      },
    };

    set({
      edges: [...get().edges, newEdge],
    });
  },

  updateEdgeData: (edgeId, data) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, ...data } as CustomEdgeData }
          : edge
      ) as Edge<CustomEdgeData>[],
    });
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
      selectedEdgeId: get().selectedEdgeId === edgeId ? null : get().selectedEdgeId,
    });
  },

  // Selection actions
  setSelectedNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null });
  },

  setSelectedEdgeId: (edgeId) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
  },

  // Utility actions
  clearDiagram: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  loadDiagram: (nodes, edges) => {
    set({
      nodes,
      edges,
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },
}));
