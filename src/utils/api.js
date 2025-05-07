/**
 * Utility functions for API requests
 */

/**
 * Fetch data from an API endpoint
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - The response data
 */
export async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Get all goals
 * @returns {Promise<Array>} - Array of goals
 */
export const getGoals = () => fetchAPI('/api/goals');

/**
 * Get a single goal by ID
 * @param {string} id - Goal ID
 * @returns {Promise<object>} - Goal object
 */
export const getGoalById = (id) => fetchAPI(`/api/goals/${id}`);

/**
 * Create a new goal
 * @param {object} goalData - Goal data
 * @returns {Promise<object>} - Created goal
 */
export const createGoal = (goalData) => fetchAPI('/api/goals', {
  method: 'POST',
  body: JSON.stringify(goalData),
});

/**
 * Update a goal
 * @param {string} id - Goal ID
 * @param {object} goalData - Updated goal data
 * @returns {Promise<object>} - Updated goal
 */
export const updateGoal = (id, goalData) => fetchAPI(`/api/goals/${id}`, {
  method: 'PUT',
  body: JSON.stringify(goalData),
});

/**
 * Delete a goal
 * @param {string} id - Goal ID
 * @returns {Promise<object>} - Response message
 */
export const deleteGoal = (id) => fetchAPI(`/api/goals/${id}`, {
  method: 'DELETE',
});

/**
 * Get all tasks with optional filters
 * @param {object} filters - Optional filters (goalId, status, priority)
 * @returns {Promise<Array>} - Array of tasks
 */
export const getTasks = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI(`/api/tasks${queryString}`);
};

/**
 * Get a single task by ID
 * @param {string} id - Task ID
 * @returns {Promise<object>} - Task object
 */
export const getTaskById = (id) => fetchAPI(`/api/tasks/${id}`);

/**
 * Create a new task
 * @param {object} taskData - Task data
 * @returns {Promise<object>} - Created task
 */
export const createTask = (taskData) => fetchAPI('/api/tasks', {
  method: 'POST',
  body: JSON.stringify(taskData),
});

/**
 * Update a task
 * @param {string} id - Task ID
 * @param {object} taskData - Updated task data
 * @returns {Promise<object>} - Updated task
 */
export const updateTask = (id, taskData) => fetchAPI(`/api/tasks/${id}`, {
  method: 'PUT',
  body: JSON.stringify(taskData),
});

/**
 * Delete a task
 * @param {string} id - Task ID
 * @returns {Promise<object>} - Response message
 */
export const deleteTask = (id) => fetchAPI(`/api/tasks/${id}`, {
  method: 'DELETE',
}); 