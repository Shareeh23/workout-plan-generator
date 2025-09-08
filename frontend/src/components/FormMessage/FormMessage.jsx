import React from 'react';
import './FormMessage.css';

const FormMessage = ({ type, message, onDismiss }) => {
  if (!message) return null;

  const messageClasses = `form-message form-message-${type}`;

  return (
    <div className={messageClasses}>
      <div className="form-message-content">
        {message}
        {onDismiss && (
          <button 
            type="button" 
            className="form-message-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss message"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default FormMessage;
