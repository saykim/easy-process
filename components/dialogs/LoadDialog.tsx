'use client';

import { useState, useEffect } from 'react';
import { SavedDiagram } from '@/types';
import { exportDiagram } from '@/lib/utils/storage';

interface LoadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  diagrams: SavedDiagram[];
}

export function LoadDialog({
  isOpen,
  onClose,
  onLoad,
  onDelete,
  diagrams,
}: LoadDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'saved' | 'draft'>('all');

  // Reset search and filter when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setFilter('all');
    }
  }, [isOpen]);

  const filteredDiagrams = diagrams.filter((diagram) => {
    const matchesSearch =
      diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (diagram.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'draft' && diagram.isDraft) ||
      (filter === 'saved' && !diagram.isDraft);

    return matchesSearch && matchesFilter;
  });

  const handleLoad = (id: string) => {
    onLoad(id);
    onClose();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`"${title}" 프로세스를 삭제하시겠습니까?`)) {
      onDelete(id);
    }
  };

  const handleExport = (diagram: SavedDiagram) => {
    exportDiagram(diagram);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900">저장된 프로세스</h2>

        {/* Search and Filter */}
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 또는 설명으로 검색..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-sm ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({diagrams.length})
            </button>
            <button
              onClick={() => setFilter('saved')}
              className={`px-3 py-1 rounded text-sm ${
                filter === 'saved'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              저장됨 ({diagrams.filter((d) => !d.isDraft).length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3 py-1 rounded text-sm ${
                filter === 'draft'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              임시저장 ({diagrams.filter((d) => d.isDraft).length})
            </button>
          </div>
        </div>

        {/* Diagram List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredDiagrams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? '검색 결과가 없습니다.'
                : '저장된 프로세스가 없습니다.'}
            </div>
          ) : (
            filteredDiagrams.map((diagram) => (
              <div
                key={diagram.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {diagram.title}
                      </h3>
                      {diagram.isDraft && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                          임시저장
                        </span>
                      )}
                    </div>
                    {diagram.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {diagram.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>노드: {diagram.nodes.length}개</span>
                      <span>연결: {diagram.edges.length}개</span>
                      <span>수정: {formatDate(diagram.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleLoad(diagram.id)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                      title="불러오기"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => handleExport(diagram)}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      title="내보내기"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => handleDelete(diagram.id, diagram.title)}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            총 {filteredDiagrams.length}개의 프로세스
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
