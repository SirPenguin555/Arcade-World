# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-08-03-user-auth-profile-system/spec.md

> Created: 2025-08-03
> Version: 1.0.0

## Firestore Collections Structure

### Users Collection (`users/{userId}`)

**Primary user profile data and account information**

```typescript
interface UserProfile {
  // Identity
  userId: string;           // Firebase Auth UID
  email: string;           // User's email address
  displayName: string;     // Player's chosen display name
  
  // Account Status
  accountType: 'guest' | 'registered';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
  
  // Player Progression
  level: number;           // Current player level
  totalXP: number;         // Total experience points earned
  currentLevelXP: number;  // XP progress within current level
  
  // Game Statistics
  totalPoints: number;     // Total points earned across all games
  totalTickets: number;    // Current ticket balance
  gamesPlayed: number;     // Total number of games completed
  totalPlayTime: number;   // Total time spent playing (milliseconds)
  
  // Preferences
  preferences: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: 'easy' | 'normal' | 'hard';
    notifications: boolean;
  };
  
  // Privacy & Settings
  profileVisibility: 'public' | 'friends' | 'private';
  
  // Metadata
  version: number;         // Schema version for migrations
  updatedAt: Timestamp;
}
```

### User Game Stats Subcollection (`users/{userId}/gameStats/{gameId}`)

**Individual game performance and statistics**

```typescript
interface GameStats {
  gameId: string;          // Unique identifier for the game
  gameName: string;        // Display name of the game
  
  // Performance Statistics
  highScore: number;       // Best score achieved
  totalScore: number;      // Sum of all scores
  averageScore: number;    // Average score per game
  gamesPlayed: number;     // Number of times played
  gamesCompleted: number;  // Number of successful completions
  
  // Time Statistics
  bestTime: number;        // Fastest completion time (if applicable)
  totalPlayTime: number;   // Total time spent on this game
  averageGameTime: number; // Average time per game session
  
  // Achievement Progress
  achievementsUnlocked: string[]; // Array of achievement IDs
  streakRecord: number;    // Best consecutive wins/completions
  
  // Timestamps
  firstPlayedAt: Timestamp;
  lastPlayedAt: Timestamp;
  updatedAt: Timestamp;
}
```

### User Sessions Subcollection (`users/{userId}/sessions/{sessionId}`)

**Gaming session tracking for analytics and progression**

```typescript
interface GameSession {
  sessionId: string;       // Unique session identifier
  
  // Session Details
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number;        // Session length in milliseconds
  
  // Games Played
  gamesPlayed: Array<{
    gameId: string;
    score: number;
    completed: boolean;
    playTime: number;
    xpEarned: number;
  }>;
  
  // Session Totals
  totalXPEarned: number;
  totalPointsEarned: number;
  totalGamesPlayed: number;
  
  // Device/Context
  deviceType: 'desktop' | 'mobile' | 'tablet';
  userAgent: string;
}
```

### Authentication Linking Collection (`authLinks/{linkId}`)

**Temporary collection for managing guest-to-registered account linking**

```typescript
interface AuthLink {
  linkId: string;          // Unique linking identifier
  guestUserId: string;     // Guest account Firebase UID
  targetEmail: string;     // Email for new registered account
  
  // Data to Transfer
  guestData: {
    totalXP: number;
    totalPoints: number;
    totalTickets: number;
    gameStats: Record<string, any>;
    preferences: UserProfile['preferences'];
  };
  
  // Linking Status
  status: 'pending' | 'completed' | 'expired' | 'failed';
  createdAt: Timestamp;
  expiresAt: Timestamp;
  completedAt?: Timestamp;
}
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Validate user profile updates
      allow update: if request.auth != null 
        && request.auth.uid == userId
        && validateUserUpdate(request.resource.data);
      
      // Game stats subcollection
      match /gameStats/{gameId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Sessions subcollection
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Auth links - only readable by the target user
    match /authLinks/{linkId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null 
        && (request.auth.uid == resource.data.guestUserId 
            || request.auth.email == resource.data.targetEmail);
    }
    
    // Validation functions
    function validateUserUpdate(data) {
      return data.keys().hasAny(['displayName', 'preferences', 'profileVisibility'])
        && (!('displayName' in data) || data.displayName is string)
        && (!('level' in data) || data.level >= resource.data.level) // Level can't decrease
        && (!('totalXP' in data) || data.totalXP >= resource.data.totalXP); // XP can't decrease
    }
  }
}
```

## Indexes Required

### Composite Indexes

1. **User Query Performance**
   ```
   Collection: users
   Fields: level (Descending), totalXP (Descending)
   Purpose: Leaderboard queries
   ```

2. **Game Statistics Queries**
   ```
   Collection: users/{userId}/gameStats
   Fields: lastPlayedAt (Descending), gamesPlayed (Descending)
   Purpose: Recent and popular games
   ```

3. **Session Analytics**
   ```
   Collection: users/{userId}/sessions
   Fields: startTime (Descending), totalXPEarned (Descending)
   Purpose: Progress tracking and analytics
   ```

## Data Migration Strategy

### Initial Setup
1. Create Firestore collections with proper security rules
2. Set up Cloud Functions for user profile initialization
3. Implement XP calculation triggers
4. Configure authentication triggers for profile creation

### Schema Versioning
- Use `version` field in user profiles for future schema migrations
- Implement migration Cloud Functions triggered by version mismatches
- Maintain backward compatibility during transition periods

## Performance Considerations

### Data Denormalization
- Store frequently accessed stats directly in user profile
- Update denormalized data via Cloud Functions triggers
- Cache computed values like average scores and level progress

### Query Optimization
- Limit collection queries with pagination
- Use cached queries for frequently accessed data
- Implement local caching for offline support

### Security Best Practices
- All user data modifications go through Cloud Functions
- Client-side optimistic updates with server validation
- Rate limiting on profile updates and sensitive operations