'use client';

import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { CustomEdgeData } from '@/types';
import { EDGE_STYLES } from '@/lib/constants/edges';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
  markerEnd,
  markerStart,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = (data as CustomEdgeData) || { style: 'solid', color: '#6b7280', arrowType: 'forward' };
  const edgeStyle = EDGE_STYLES[edgeData.style || 'solid'];
  const color = edgeData.color || '#6b7280';
  const arrowType = edgeData.arrowType || 'forward';

  // Determine which markers to show based on arrow type
  let computedMarkerEnd = markerEnd;
  let computedMarkerStart = markerStart;

  if (arrowType === 'none') {
    computedMarkerEnd = undefined;
    computedMarkerStart = undefined;
  } else if (arrowType === 'forward') {
    computedMarkerEnd = `url(#arrow-${id})`;
    computedMarkerStart = undefined;
  } else if (arrowType === 'backward') {
    computedMarkerEnd = undefined;
    computedMarkerStart = `url(#arrow-start-${id})`;
  } else if (arrowType === 'both') {
    computedMarkerEnd = `url(#arrow-${id})`;
    computedMarkerStart = `url(#arrow-start-${id})`;
  }

  return (
    <>
      {/* Arrow markers */}
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={color}
          />
        </marker>
        <marker
          id={`arrow-start-${id}`}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={color}
          />
        </marker>
      </defs>

      {/* Edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: color,
          strokeWidth: edgeStyle.strokeWidth,
          strokeDasharray: edgeStyle.strokeDasharray,
        }}
        markerEnd={computedMarkerEnd}
        markerStart={computedMarkerStart}
      />

      {/* Edge label */}
      {edgeData.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs font-medium"
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
