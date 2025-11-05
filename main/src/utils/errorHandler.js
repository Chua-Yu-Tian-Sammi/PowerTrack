/**
 * Check if an error is an authentication error from Firebase Functions
 * @param {Error} error - The error object
 * @returns {boolean} - True if the error is an authentication error
 */
export function isAuthenticationError(error) {
  if (!error) return false
  
  // Firebase Functions HttpsError with code 'unauthenticated'
  if (error.code === 'unauthenticated') {
    return true
  }
  
  // Check error details for Firebase Functions errors
  if (error.details) {
    const details = error.details.toString().toLowerCase()
    if (details.includes('unauthenticated') || details.includes('user must be authenticated')) {
      return true
    }
  }
  
  // Check if error message contains authentication-related keywords
  const message = error.message?.toLowerCase() || ''
  if (message.includes('unauthenticated') || message.includes('user must be authenticated')) {
    return true
  }
  
  // Check if error is a Firebase Functions error with unauthenticated status
  // Firebase Functions wrap errors, so check the underlying error
  if (error.errorInfo) {
    const errorInfo = error.errorInfo
    if (errorInfo.code === 'unauthenticated' || errorInfo.status === 'UNAUTHENTICATED') {
      return true
    }
  }
  
  return false
}

/**
 * Get the appropriate error message based on error type
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message if not an auth error
 * @returns {string} - The error message to display
 */
export function getErrorMessage(error, defaultMessage = 'An error occurred. Please try again.') {
  if (isAuthenticationError(error)) {
    return 'Please sign in to continue'
  }
  return defaultMessage
}

