/**
 * API endpoint to check environment variables
 * This helps diagnose issues with environment configuration
 */
export default async function handler(req, res) {
  // Check authentication
  const { auth } = req.query;
  if (auth !== 'check-env-config') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Required environment variables
  const requiredVars = [
    'MONGODB_URI',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];
  
  const results = {
    environment: process.env.NODE_ENV || 'not set',
    variables: {},
    validation: {}
  };
  
  // Check if variables are set
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    results.variables[varName] = value ? 'Set' : 'Not set';
    
    // Perform specific validations
    if (varName === 'MONGODB_URI' && value) {
      // Validate MongoDB URI
      const isValidMongoURI = validateMongoURI(value);
      results.validation.MONGODB_URI = {
        valid: isValidMongoURI.valid,
        message: isValidMongoURI.message,
        // Display masked URI for security
        uri: maskSensitiveData(value)
      };
    } else if (varName === 'NEXTAUTH_URL' && value) {
      // Validate NEXTAUTH_URL
      try {
        new URL(value);
        results.validation.NEXTAUTH_URL = {
          valid: true,
          message: 'Valid URL format'
        };
      } catch (error) {
        results.validation.NEXTAUTH_URL = {
          valid: false,
          message: 'Invalid URL format'
        };
      }
    } else if (varName === 'NEXTAUTH_SECRET' && value) {
      // Validate NEXTAUTH_SECRET
      results.validation.NEXTAUTH_SECRET = {
        valid: value.length >= 32,
        message: value.length >= 32 ? 'Good length' : 'Should be at least 32 characters long'
      };
    }
  });
  
  // Check if we're using a local or Atlas MongoDB
  if (process.env.MONGODB_URI) {
    const isAtlas = process.env.MONGODB_URI.includes('mongodb.net');
    results.mongodb_type = isAtlas ? 'MongoDB Atlas' : 'Local MongoDB';
  }
  
  // Provide additional info for development environments
  if (process.env.NODE_ENV === 'development') {
    results.local_file_paths = {
      env_local: '/.env.local',
      env_development: '/.env.development',
    };
  }
  
  return res.status(200).json({
    success: true,
    message: 'Environment variables checked',
    results
  });
}

/**
 * Validate MongoDB URI format
 */
function validateMongoURI(uri) {
  // Basic validation to check for MongoDB URI format
  if (!uri) {
    return { valid: false, message: 'MongoDB URI is empty' };
  }
  
  // Check basic format
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return { valid: false, message: 'Invalid MongoDB URI protocol' };
  }
  
  // Check for username and password
  if (uri.includes('@')) {
    const auth = uri.split('@')[0].replace('mongodb://', '').replace('mongodb+srv://', '');
    if (!auth.includes(':')) {
      return { valid: false, message: 'MongoDB URI missing password' };
    }
  }
  
  // Check for database name
  try {
    const urlParts = uri.split('/');
    if (urlParts.length < 4) {
      return { valid: false, message: 'MongoDB URI missing database name' };
    }
    
    return { valid: true, message: 'Valid MongoDB URI format' };
  } catch (error) {
    return { valid: false, message: 'MongoDB URI parsing failed' };
  }
}

/**
 * Mask sensitive data in strings
 */
function maskSensitiveData(input) {
  if (!input) return input;
  
  // Mask user:password in MongoDB URI
  return input.replace(
    /(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/,
    '$1$3:****@'
  );
} 