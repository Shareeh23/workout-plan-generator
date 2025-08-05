// Centralized API utility for workout plan and logs, with in-memory caching per page load

let workoutPlanCache = null;
let workoutLogsCache = null;

export async function getWorkoutPlan(forceRefresh = false) {
  if (workoutPlanCache && !forceRefresh) return workoutPlanCache;
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/workout/plan", {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  workoutPlanCache = data.data;
  return workoutPlanCache;
}

export async function getWorkoutLogs(forceRefresh = false) {
  if (workoutLogsCache && !forceRefresh) return workoutLogsCache;
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/workout/logs", {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const logs = await res.json();
  workoutLogsCache = logs;
  return workoutLogsCache;
}

export function clearWorkoutApiCache() {
  workoutPlanCache = null;
  workoutLogsCache = null;
}

export async function getPredefinedPlans() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/workout/predefined-plans", {
    headers: { "Authorization": `Bearer ${token}` },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch predefined plans');
  }
  
  const data = await res.json();
  return data.data; // Returns the array of predefined plans
}
