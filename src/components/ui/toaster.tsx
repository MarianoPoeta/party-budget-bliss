import { useEffect } from 'react';
import { useStore } from '../../store';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const typeStyles = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-yellow-500 text-white',
};
const typeIcons = {
  success: <CheckCircle className="h-5 w-5 mr-2" />,
  error: <X className="h-5 w-5 mr-2" />,
  info: <Info className="h-5 w-5 mr-2" />,
  warning: <AlertTriangle className="h-5 w-5 mr-2" />,
};

export default function Toaster() {
  const toasts = useStore(s => s.toasts);
  const removeToast = useStore(s => s.removeToast);

  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration !== 0) {
        const timeout = setTimeout(() => removeToast(toast.id), toast.duration || 3500);
        return () => clearTimeout(timeout);
      }
    });
  }, [toasts, removeToast]);

  return (
    <div className="fixed z-50 top-4 right-4 flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center px-4 py-3 rounded-lg shadow-lg min-w-[220px] max-w-xs ${typeStyles[toast.type]}`}
        >
          {typeIcons[toast.type]}
          <span className="flex-1 text-sm">{toast.message}</span>
          <button
            className="ml-2 text-white/80 hover:text-white"
            onClick={() => removeToast(toast.id)}
            aria-label="Descartar notificación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
