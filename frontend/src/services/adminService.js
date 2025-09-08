import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const createWorkoutPlan = async (data, isMultipart = false) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true,
      timeout: 30000
    };

    // For FormData, don't set Content-Type - let the browser set it with boundary
    if (!isMultipart) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    const response = await axios.post(
      `${API_BASE}/admin/plans`, 
      data,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating workout plan:', error.response?.data || error.message);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
