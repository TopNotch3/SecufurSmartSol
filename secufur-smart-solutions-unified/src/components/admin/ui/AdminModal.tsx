'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
}

export function AdminModal({ isOpen, title, children, onClose, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="px-6 py-4">
            {children}
          </div>
          {actions && (
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
