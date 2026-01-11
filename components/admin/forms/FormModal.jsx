'use client';
import { Modal } from '../share/Modal';


export function FormModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  size = 'md',
  showFooter = true,
  ...modalProps 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      {...modalProps}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {children}
        </div>

        {showFooter && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200/60 bg-gray-50/30">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}