'use client';

import { useCallback } from 'react';
import { Palette } from '@/components/palette/Palette';
import { DiagramCanvas } from '@/components/canvas/DiagramCanvas';
import { PropertiesPanel } from '@/components/properties/PropertiesPanel';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { useDiagramStore } from '@/store/diagramStore';

export default function Home() {
  const { nodes, edges, diagramTitle, loadDiagram, clearDiagram } = useDiagramStore();

  const handleSave = useCallback(() => {
    const data = {
      title: diagramTitle,
      nodes,
      edges,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagramTitle || 'diagram'}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Diagram saved successfully!');
  }, [nodes, edges, diagramTitle]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          loadDiagram(data.nodes || [], data.edges || []);
          alert('Diagram loaded successfully!');
        } catch (error) {
          console.error('Failed to load diagram:', error);
          alert('Failed to load diagram. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [loadDiagram]);

  const handleExport = useCallback(() => {
    alert('Export to SVG/PNG/PDF will be implemented in the next milestone!');
  }, []);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear the diagram? This action cannot be undone.')) {
      clearDiagram();
    }
  }, [clearDiagram]);

  return (
    <div className="flex flex-col h-screen">
      <Toolbar
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onClear={handleClear}
      />
      <div className="flex flex-1 overflow-hidden">
        <Palette />
        <DiagramCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
