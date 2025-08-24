// Centralized API utility for workout plan and logs, with in-memory caching per page load
let workoutPlanCache = null;
let workoutLogsCache = null;
let upcomingSessionCache = null;

export async function getWorkoutPlan(forceRefresh = false) {
  if (workoutPlanCache && !forceRefresh) return workoutPlanCache;
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/workout/plan', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  workoutPlanCache = data.data;
  return workoutPlanCache;
}

export async function getWorkoutLogs(forceRefresh = false) {
  if (workoutLogsCache && !forceRefresh) return workoutLogsCache;
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/workout/logs', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const logs = await res.json();
  workoutLogsCache = logs;
  return workoutLogsCache;
}

// New function to get and cache the upcoming session
export async function getUpcomingSession(forceRefresh = false) {
  if (upcomingSessionCache && !forceRefresh) return upcomingSessionCache;
  
  try {
    // 1. Get the workout plan
    const plan = await getWorkoutPlan();
    if (!plan?.sessions?.length) {
      throw new Error("No workout sessions found in plan");
    }

    // 2. Get all logs to find the most recent session
    const logs = await getWorkoutLogs();
    
    // 3. Find the next session from the plan
    let nextSessionOrder = 1; // Default to first session

    if (logs.length > 0) {
      // Get the most recent log's session order
      const lastSessionOrder = Math.max(
        ...logs.map((log) => log.sessionOrder)
      );
      // Find the next session in the plan
      nextSessionOrder = (lastSessionOrder % plan.sessions.length) + 1;
    }

    // Find the next session in the plan
    const nextSession =
      plan.sessions.find(
        (session) => session.sessionOrder === nextSessionOrder
      ) || plan.sessions[0]; // Fallback to first session if not found

    upcomingSessionCache = {
      ...nextSession,
      isUpcoming: true,
    };

    return upcomingSessionCache;
  } catch (err) {
    console.error("Error getting upcoming session:", err);
    throw err;
  }
}

export function clearWorkoutApiCache() {
  workoutPlanCache = null;
  workoutLogsCache = null;
  upcomingSessionCache = null; // Clear upcoming session cache too
}

export async function getPredefinedPlans() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/workout/predefined-plans', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch predefined plans');
  }
  const data = await res.json();
  return data.data; // Returns the array of predefined plans
}

export const saveWorkoutLog = async (logData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/workout/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(logData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save workout log');
  }
  return await response.json();
};

export const assignPredefinedPlan = async (planId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:3000/workout/predefined/${planId}/assign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to assign workout plan');
  }
  return response.json();
};

export const getPlanExercises = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/workout/plan/exercises', {
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch plan exercises');
  }
  
  const data = await response.json();
  return data.exercises;
};