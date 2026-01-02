'use client'

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isDeleting }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl scale-100">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-3 text-white font-bold rounded-xl transition shadow-lg ${isDeleting ? 'bg-red-500 hover:bg-red-600' : 'bg-[#FB7185] hover:bg-[#F43F5E]'}`}
          >
            {isDeleting ? 'Yes, Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
