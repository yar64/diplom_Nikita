'use client';
import { Modal } from '../../share/Modal';
import { 
  AlertTriangle, 
  Trash2, 
  CheckCircle, 
  Info,
  Loader2 
} from 'lucide-react';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Подтверждение действия",
  message = "Вы уверены, что хотите продолжить?",
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  variant = 'default',
  isConfirming = false,
  ...modalProps 
}) {
  const variantConfig = {
    default: {
      confirmButton: 'bg-blue-600 hover:bg-blue-700',
      icon: <Info className="w-6 h-6 text-blue-500" />
    },
    delete: {
      confirmButton: 'bg-red-600 hover:bg-red-700',
      icon: <Trash2 className="w-6 h-6 text-red-500" />
    },
    warning: {
      confirmButton: 'bg-amber-600 hover:bg-amber-700', 
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />
    },
    success: {
      confirmButton: 'bg-green-600 hover:bg-green-700',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Обработка...
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