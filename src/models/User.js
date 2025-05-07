/**
 * User model schema
 * 
 * This is a reference schema for the MongoDB User collection.
 * It's not actively used in the code but serves as documentation
 * for the expected data structure.
 */
const UserSchema = {
  name: String,            // User's full name
  email: String,           // User's email (unique)
  passwordHash: String,    // Bcrypt hashed password
  
  // Profile details
  image: String,           // Profile picture URL
  notificationSettings: {
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    taskReminders: Boolean,
    goalUpdates: Boolean,
  },
  
  displaySettings: {
    darkMode: Boolean,
    compactView: Boolean,
    showCompletedTasks: Boolean,
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  
  // OAuth account linking (if using providers)
  accounts: [
    {
      provider: String,    // e.g., 'google', 'github'
      providerAccountId: String,
      accessToken: String,
      refreshToken: String,
      expires: Date,
    }
  ],
  
  // Session management
  sessions: [
    {
      sessionToken: String,
      expires: Date,
    }
  ],
};

export default UserSchema; 