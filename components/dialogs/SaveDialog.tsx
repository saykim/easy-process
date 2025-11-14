'use client';

import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useDiagramStore } from '@/store/diagramStore';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, isDraft: boolean) => void;
}

interface SaveDialogContentProps {
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
  onSave: (title: string, description: string, isDraft: boolean) => void;
}

function SaveDialogContent({
  initialTitle,
  initialDescription,
  onClose,
  onSave,
}: SaveDialogContentProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSave = (isDraft: boolean) => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    onSave(title, description, isDraft);
    onClose();
  };

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900">프로세스 저장</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="프로세스 제목을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로세스 설명을 입력하세요 (선택사항)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
          >
            임시저장
          </button>
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            저장 (Ctrl+Enter)
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          ESC: 닫기 | Ctrl+Enter: 빠른 저장
        </p>
      </div>
    </div>
  );
}

export function SaveDialog({ isOpen, onClose, onSave }: SaveDialogProps) {
  const { diagramTitle, diagramDescription } = useDiagramStore();

  if (!isOpen) return null;

  return (
    <SaveDialogContent
      initialTitle={diagramTitle}
      initialDescription={diagramDescription}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
