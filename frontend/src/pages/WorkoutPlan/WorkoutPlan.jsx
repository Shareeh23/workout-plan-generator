import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import './WorkoutPlan.css';

const WorkoutPlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    archetype: '',
    trainingDays: 3
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'trainingDays' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/workout/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate workout plan');
      }

      // Navigate to the plan view or show success message
      navigate('/');
    } catch (err) {
      setMessage({
        text: err.message || 'Something went wrong. Please try again.',
        type: 'error'
      });
      console.error('Error generating workout plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workout-plan-page">
    <div className="workout-plan-container">
      {message.text && (
        <div
          className={`toast-message ${message.type}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ text: '', type: '' })}
            aria-label="Close"
            className="toast-close-btn"
          >
            <XMarkIcon
              style={{
                color: "var(--indigo-100)",
                width: "1.5rem",
                height: "1.5rem",
              }}
            />
          </button>
        </div>
      )}

      <div className="workout-plan-card">
        <div className="workout-plan-header">
          <h1>Generate Your Workout Plan</h1>
          <p className="text-md">Get a personalized workout plan based on your preferences</p>
        </div>
        
        <form onSubmit={handleSubmit} className="workout-plan-generator-form">
          <div className="form-group">
            <label htmlFor="archetype" className="form-label text-sm">Character Archetype</label>
            <input
              type="text"
              id="archetype"
              name="archetype"
              value={formData.archetype}
              onChange={handleInputChange}
              className="form-input"
              placeholder="E.g., Man of Steel, Guts, Thor"
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="trainingDays" className="form-label text-sm">Training Days Per Week</label>
            <div className="days-selector">
              {[3, 4, 5, 6].map(days => (
                <label key={days} className={`day-option ${formData.trainingDays === days ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="trainingDays"
                    value={days}
                    checked={formData.trainingDays === days}
                    onChange={handleInputChange}
                    className="visually-hidden"
                  />
                  <span className="day-label">{days} days</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary-lg"
              disabled={isLoading || !formData.archetype}
            >
              {isLoading ? 'Generating...' : 'Generate Workout Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default WorkoutPlan;
