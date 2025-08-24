const API_BASE_URL = 'http://localhost:3000/analysis';

export const getExerciseAnalysis = async (exerciseName) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(exerciseName)}`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch exercise analysis');
  }
  
  return response.json();
};