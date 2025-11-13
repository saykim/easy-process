import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { CustomNodeData, CustomEdgeData, DiagramType, EdgeStyle, SavedDiagram } from '@/types';
import { DEFAULT_EDGE_STYLE, DEFAULT_EDGE_COLOR, DEFAULT_EDGE_ARROW_TYPE } from '@/lib/constants/edges';
import { generateEdgeId } from '@/lib/utils/idGenerator';
import { saveDiagram, getDiagram, deleteDiagram, getAllDiagrams } from '@/lib/utils/storage';

interface DiagramState {
  // Diagram metadata
  diagramType: DiagramType;
  diagramTitle: string;
  diagramDescription: string;
  currentDiagramId: string | null;

  // Canvas state
  nodes: Node<CustomNodeData>[];
  edges: Edge<CustomEdgeData>[];

  // Selected elements
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Actions
  setDiagramType: (type: DiagramType) => void;
  setDiagramTitle: (title: string) => void;
  setDiagramDescription: (description: string) => void;

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

  // Storage operations
  saveDiagramToStorage: (title: string, description?: string, isDraft?: boolean) => Promise<string>;
  loadDiagramFromStorage: (id: string) => Promise<void>;
  deleteDiagramFromStorage: (id: string) => Promise<void>;
  getAllSavedDiagrams: () => Promise<SavedDiagram[]>;
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  // Initial state
  diagramType: 'flow',
  diagramTitle: 'Untitled Diagram',
  diagramDescription: '',
  currentDiagramId: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  // Diagram metadata actions
  setDiagramType: (type) => set({ diagramType: type }),
  setDiagramTitle: (title) => set({ diagramTitle: title }),
  setDiagramDescription: (description) => set({ diagramDescription: description }),

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

  // Storage operations
  saveDiagramToStorage: async (title, description = '', isDraft = false) => {
    const state = get();
    const id = state.currentDiagramId || `diagram-${Date.now()}`;

    const diagramToSave: SavedDiagram = {
      id,
      title,
      description,
      nodes: state.nodes,
      edges: state.edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDraft,
    };

    await saveDiagram(diagramToSave);
    set({ currentDiagramId: id, diagramTitle: title, diagramDescription: description });

    return id;
  },

  loadDiagramFromStorage: async (id) => {
    const diagram = await getDiagram(id);
    if (diagram) {
      set({
        currentDiagramId: diagram.id,
        diagramTitle: diagram.title,
        diagramDescription: diagram.description || '',
        nodes: diagram.nodes,
        edges: diagram.edges,
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    }
  },

  deleteDiagramFromStorage: async (id) => {
    await deleteDiagram(id);
    // If deleting current diagram, reset
    if (get().currentDiagramId === id) {
      set({
        currentDiagramId: null,
        diagramTitle: 'Untitled Diagram',
        diagramDescription: '',
        nodes: [],
        edges: [],
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    }
  },

  getAllSavedDiagrams: async () => {
    return await getAllDiagrams();
  },
}));
