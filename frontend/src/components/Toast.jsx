import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import "../css/Toast.css";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function Toast({ message, type = "success", onClose, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = icons[type] || Info;

  return (
    <div className={`toast toast-${type}`} role="status">
      <Icon size={22} className="toast-icon" />

      <span className="toast-message">{message}</span>

      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default React.memo(Toast);
