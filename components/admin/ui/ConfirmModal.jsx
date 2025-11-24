'use client';
import { Modal } from './Modal';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = 'default',
  isConfirming = false,
  ...modalProps 
}) {
  const variantConfig = {
    default: {
      confirmButton: 'bg-blue-600 hover:bg-blue-700',
      icon: 'ℹ️'
    },
    delete: {
      confirmButton: 'bg-red-600 hover:bg-red-700',
      icon: '🗑️'
    },
    warning: {
      confirmButton: 'bg-amber-600 hover:bg-amber-700', 
      icon: '⚠️'
    },
    success: {
      confirmButton: 'bg-green-600 hover:bg-green-700',
      icon: '✅'
    }
  };

  const config = variantConfig[variant] || variantConfig.default;

  const handleConfirm = async () => {
    await onConfirm?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...modalProps}
    >
      <div className="p-6">
        <div className="text-center">
          <div className="text-gray-600 mb-6 transition-all duration-300">{message}</div>
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              disabled={isConfirming}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 ${config.confirmButton}`}
            >
              {isConfirming ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}