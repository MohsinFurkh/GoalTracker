/**
 * Email validation regex pattern
 */
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/**
 * Password validation regex pattern (at least 8 chars with one number and one letter)
 */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email is valid
 */
export function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate a password
 * @param {string} password - The password to validate
 * @returns {boolean} True if the password is valid
 */
export function validatePassword(password) {
  return PASSWORD_REGEX.test(password);
}

/**
 * Get form error messages
 * @param {Object} errors - Error object from form validation
 * @returns {Object} Object with field names and error messages
 */
export function getFormErrors(errors) {
  const formattedErrors = {};
  
  Object.keys(errors).forEach((key) => {
    formattedErrors[key] = errors[key].message;
  });
  
  return formattedErrors;
}

/**
 * Formats error response from API call
 * @param {Error} error - Error object from API call
 * @returns {Object} Formatted error with message and fields
 */
export function formatApiError(error) {
  let message = 'An unexpected error occurred';
  let fields = {};
  
  if (error.response) {
    const { data } = error.response;
    
    if (data.message) {
      message = data.message;
    }
    
    if (data.errors) {
      fields = data.errors;
    }
  } else if (error.message) {
    message = error.message;
  }
  
  return {
    message,
    fields,
  };
}

/**
 * Validate a form field
 * @param {string} fieldName - The name of the field
 * @param {any} value - The value to validate
 * @param {Object} rules - Validation rules
 * @returns {string|null} Error message or null if valid
 */
export function validateField(fieldName, value, rules) {
  if (rules.required && (!value || value.trim?.() === '')) {
    return `${fieldName} is required`;
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} cannot exceed ${rules.maxLength} characters`;
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.patternMessage || `${fieldName} is invalid`;
  }
  
  if (rules.validate && typeof rules.validate === 'function') {
    const validateResult = rules.validate(value);
    if (typeof validateResult === 'string') {
      return validateResult;
    }
    if (validateResult === false) {
      return `${fieldName} is invalid`;
    }
  }
  
  return null;
}

/**
 * Creates a simple form state manager
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for fields
 * @returns {Object} Form state manager
 */
export function useFormState(initialValues, validationRules = {}) {
  const values = { ...initialValues };
  const errors = {};
  
  const setValue = (field, value) => {
    values[field] = value;
    
    // Clear error when value changes
    if (errors[field]) {
      delete errors[field];
    }
    
    // Validate if field has rules
    if (validationRules[field]) {
      const error = validateField(field, value, validationRules[field]);
      if (error) {
        errors[field] = error;
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field], validationRules[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    Object.assign(errors, newErrors);
    return isValid;
  };
  
  return {
    values,
    errors,
    setValue,
    validateForm,
    reset: () => Object.assign(values, initialValues),
  };
} 