import { Node, Edge } from '@xyflow/react';

// Node Types
export type NodeType = 'process' | 'device' | 'decision' | 'note';

// Device Categories (inspection equipment)
export type DeviceCategory = 'xray' | 'metal' | 'weight';

// Edge Styles
export type EdgeStyle = 'solid' | 'dotted' | 'bold';

// Edge Arrow Direction
export type EdgeArrowType = 'none' | 'forward' | 'backward' | 'both';

// Node Properties
export interface BaseNodeProps {
  name: string;
  notes?: string;
  inputs?: string;
  outputs?: string;
  operation?: string;
}

export interface DeviceNodeProps extends BaseNodeProps {
  deviceMeta?: {
    category: DeviceCategory;
    manufacturer?: string;
    model?: string;
    inspectionCycle?: string;
    alarmCriteria?: string;
  };
}

export interface DecisionNodeProps extends BaseNodeProps {
  condition?: string;
  yesLabel?: string;
  noLabel?: string;
}

export type NodeProps = BaseNodeProps | DeviceNodeProps | DecisionNodeProps;

// Custom Node Data
export interface CustomNodeData extends Record<string, unknown> {
  type: NodeType;
  props: NodeProps;
  label?: string;
}

// Custom Edge Data
export interface CustomEdgeData extends Record<string, unknown> {
  style: EdgeStyle;
  color?: string;
  arrowType?: EdgeArrowType;
  label?: string;
}

// Diagram Types
export type DiagramType = 'flow' | 'class';

// Project and Diagram
export interface Project {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  ownerId: string;
  createdAt: Date;
}

export interface Diagram {
  id: string;
  projectId: string;
  type: DiagramType;
  title: string;
  description?: string;
  nodes: Node<CustomNodeData>[];
  edges: Edge<CustomEdgeData>[];
}

// Template
export interface Template {
  id: string;
  title: string;
  category: string;
  tags: string[];
  payload: {
    nodes: Node<CustomNodeData>[];
    edges: Edge<CustomEdgeData>[];
  };
  version: string;
}

// Version
export interface Version {
  id: string;
  diagramId: string;
  semver: string;
  message: string;
  diff?: Record<string, unknown>;
  createdBy: string;
  createdAt: Date;
}

// User Role
export type UserRole = 'owner' | 'editor' | 'viewer';

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Audit Log
export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  at: Date;
}

// Saved Diagram (for localStorage)
export interface SavedDiagram {
  id: string;
  title: string;
  description?: string;
  nodes: Node<CustomNodeData>[];
  edges: Edge<CustomEdgeData>[];
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
}
