class WorkoutGenerationError extends Error {
  constructor(message, { originalError, requestData } = {}) {
    super(message);
    this.name = 'WorkoutGenerationError';
    this.details = {
      message: originalError?.message,
      requestData,
      ...(originalError?.response && { 
        responseData: originalError.response.data,
        statusCode: originalError.response.status
      }),
      ...(originalError?.config && {
        requestConfig: {
          url: originalError.config.url,
          method: originalError.config.method
        }
      })
    };
  }
}

module.exports = { WorkoutGenerationError };
