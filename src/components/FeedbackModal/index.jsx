import React from 'react';
import './FeedbackModal.css';

/**
 * FeedbackModal — componente reutilizável do MoneyKeep
 *
 * Props:
 *  - isOpen      : boolean — controla visibilidade
 *  - type        : 'success' | 'error' | 'warning' | 'confirm'
 *  - title       : string  — título do modal
 *  - message     : string  — mensagem principal
 *  - onConfirm   : fn      — callback do botão principal (OK / Confirmar / Sim, excluir)
 *  - onCancel    : fn      — callback do botão secundário (só aparece no tipo 'confirm')
 *  - confirmText : string  — texto do botão principal (padrão: 'OK')
 *  - cancelText  : string  — texto do botão cancelar  (padrão: 'Cancelar')
 */
const FeedbackModal = ({
  isOpen,
  type = 'success',
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText = 'Cancelar',
}) => {
  if (!isOpen) return null;

  // Ícone SVG inline para cada tipo — sem dependência externa
  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#66BB6A" />
        <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#EF5350" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.2"
          strokeLinecap="round" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFC750" />
        <path d="M12 7v5.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1.2" fill="#fff" />
      </svg>
    ),
    confirm: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#EF5350" />
        <path d="M12 7v5.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1.2" fill="#fff" />
      </svg>
    ),
  };

  const defaultConfirmText = {
    success: 'OK',
    error: 'Entendi',
    warning: 'OK',
    confirm: 'Sim, excluir',
  };

  return (
    <div className="modal-overlay" onClick={type !== 'confirm' ? onConfirm : undefined}>
      <div
        className={`modal-box modal-box--${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon">
          {icons[type]}
        </div>

        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <div className={`modal-actions ${type === 'confirm' ? 'modal-actions--two' : ''}`}>
          {type === 'confirm' && (
            <button className="modal-btn modal-btn--cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            className={`modal-btn modal-btn--${type === 'confirm' ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmText || defaultConfirmText[type]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
