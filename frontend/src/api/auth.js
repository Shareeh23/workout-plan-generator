import apiClient from './apiClient';

export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await apiClient.post('/auth/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data,
      user: response.data.user,
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || 'Failed to upload profile picture',
      status: error.response?.status,
    };
  }
};

export const deleteAccount = async (password) => {
  try {
    const response = await apiClient.delete('/auth/delete', {
      data: { password },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting account:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete account',
      status: error.response?.status,
    };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await apiClient.patch('/auth/change-profile', userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile',
      status: error.response?.status,
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch profile',
      status: error.response?.status,
    };
  }
};
