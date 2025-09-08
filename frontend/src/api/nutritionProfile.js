// frontend/src/api/nutritionProfile.js

const token = localStorage.getItem('token');
const NUTRITION_PROFILE_CACHE_KEY = 'nutritionProfileCache';
let profileCache = null;

// Get cached profile if available, otherwise fetch from server
export async function getNutritionProfile(forceRefresh = false) {
  // Return cached data if available and not forcing refresh
  if (!forceRefresh && profileCache) {
    return { data: profileCache, fromCache: true };
  }

  try {
    const res = await fetch('http://localhost:3000/nutrition/get-profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    const data = await res.json();
    
    // Update cache with fresh data
    if (data.success && data.data) {
      profileCache = data.data;
      try {
        localStorage.setItem(NUTRITION_PROFILE_CACHE_KEY, JSON.stringify(profileCache));
      } catch (e) {
        console.warn('Failed to cache profile data:', e);
      }
    }
    
    return { data, fromCache: false };
  } catch (error) {
    // If there's a network error but we have cached data, return that
    if (profileCache) {
      return { 
        data: { success: true, data: profileCache },
        fromCache: true,
        error: 'Using cached data due to network error'
      };
    }
    throw error;
  }
}

// Clear the cached profile data
export function clearNutritionProfileCache() {
  profileCache = null;
  try {
    localStorage.removeItem(NUTRITION_PROFILE_CACHE_KEY);
  } catch (e) {
    console.warn('Failed to clear profile cache:', e);
  }
}

// Initialize cache from localStorage on module load
(function initCache() {
  try {
    const cached = localStorage.getItem(NUTRITION_PROFILE_CACHE_KEY);
    if (cached) {
      profileCache = JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Failed to initialize profile cache:', e);
  }
})();

export async function createNutritionProfile(profileData) {
  try {
    const res = await fetch('http://localhost:3000/nutrition/create-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    const result = await res.json();
    
    // Clear cache on successful creation to force refresh on next get
    if (result.success) {
      clearNutritionProfileCache();
      // Pre-fetch the new profile to update cache
      await getNutritionProfile(true);
    }
    
    return result;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

export async function updateNutritionProfile(profileData) {
  try {
    const res = await fetch('http://localhost:3000/nutrition/update-profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    const result = await res.json();
    
    // Clear cache on successful update to force refresh on next get
    if (result.success) {
      clearNutritionProfileCache();
      // Pre-fetch the updated profile to update cache
      await getNutritionProfile(true);
    }
    
    return result;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Calculate macros (playground)
export async function calculateMacros({ calories, split = '40-30-30' }) {
  try {
    const res = await fetch('http://localhost:3000/api/nutrition/calculate-macros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ calories, split }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error calculating macros:', error);
    throw error;
  }
}