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

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/request-reset', { email });
    return {
      success: true,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error) {
    console.error('Error sending reset email:', error);

    // Handle validation errors (422 status code)
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.data || [];
      const errorMessage =
        validationErrors.map((err) => err.msg).join(' ') || 'Validation failed';
      return {
        success: false,
        error: errorMessage,
        status: 422,
        validationErrors,
      };
    }

    return {
      success: false,
      error: error.response?.data?.message,
      status: error.response?.status,
    };
  }
};

export const verifyResetOtp = async (email, otp) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return {
      success: true,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error) {
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.data || [];
      const errorMessage =
        validationErrors.map((err) => err.msg).join(' ') || 'Validation failed';
      return {
        success: false,
        error: errorMessage,
        status: 422,
        validationErrors,
      };
    }

    return {
      success: false,
      error: error.response?.data?.message,
      status: error.response?.status,
    };
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await apiClient.put('/auth/change-password', {
      email,
      newPassword,
    });

    return {
      success: true,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error) {
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.data || [];
      const errorMessage =
        validationErrors.map((err) => err.msg).join(' ') || 'Validation failed';
      return {
        success: false,
        error: errorMessage,
        status: 422,
        validationErrors,
      };
    }

    return {
      success: false,
      error: error.response?.data?.message,
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
