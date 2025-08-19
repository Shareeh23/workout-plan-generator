import React, { useState } from 'react';
import '../../styles/config-form.css'
import './DeleteAccountForm.css';

const DeleteAccountForm = ({ onDelete, isDeleting, setMessage }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    if (!password) {
      setMessage({ 
        text: 'Please enter your password to confirm account deletion', 
        type: 'error' 
      });
      return;
    }

    onDelete(password);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPassword('');
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="delete-account-form">
      <h4 className='danger-heading'>Delete Account</h4>
      <p className="danger-text text-md">This action cannot be undone. All your data will be permanently deleted.</p>
      
      {showConfirm && (
        <div className="config-input-group">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password to confirm"
            className="config-form-input"
          />
        </div>
      )}
      
      <button 
        type="button"
        className="btn-delete btn-primary-md"
        onClick={handleSubmit}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : showConfirm ? 'Confirm' : 'Delete Account'}
      </button>
      
      {showConfirm && (
        <button 
          type="button"
          className="btn-cancel btn-secondary-md"
          onClick={handleCancel}
          disabled={isDeleting}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default DeleteAccountForm;
