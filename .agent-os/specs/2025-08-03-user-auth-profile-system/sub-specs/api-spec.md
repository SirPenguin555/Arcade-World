# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-08-03-user-auth-profile-system/spec.md

> Created: 2025-08-03
> Version: 1.0.0

## Authentication Endpoints

### POST /api/auth/register

**Purpose:** Create a new user account with email and password
**Parameters:** 
- `email` (string, required): User's email address
- `password` (string, required): User's password (min 8 characters)
- `displayName` (string, required): Player's chosen display name
**Response:** 
```typescript
{
  success: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
  };
  token: string;
}
```
**Errors:** 
- 400: Invalid input data
- 409: Email already in use
- 422: Display name already taken

### POST /api/auth/login

**Purpose:** Authenticate existing user with email and password
**Parameters:**
- `email` (string, required): User's email address
- `password` (string, required): User's password
**Response:**
```typescript
{
  success: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
  };
  token: string;
}
```
**Errors:**
- 401: Invalid credentials
- 404: User not found
- 429: Too many login attempts

### POST /api/auth/google

**Purpose:** Authenticate or register user using Google OAuth
**Parameters:**
- `idToken` (string, required): Google ID token from client
**Response:**
```typescript
{
  success: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
  };
  token: string;
  isNewUser: boolean;
}
```
**Errors:**
- 400: Invalid Google token
- 500: OAuth provider error

### POST /api/auth/guest

**Purpose:** Create anonymous guest account for trial play
**Parameters:** None
**Response:**
```typescript
{
  success: boolean;
  user: {
    uid: string;
    isGuest: true;
  };
  token: string;
}
```
**Errors:**
- 500: Failed to create guest account

### POST /api/auth/link-account

**Purpose:** Convert guest account to registered account
**Parameters:**
- `email` (string, required): Email for new registered account
- `password` (string, required): Password for new account
- `displayName` (string, required): Display name for account
**Response:**
```typescript
{
  success: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
  };
  token: string;
  dataTransferred: {
    totalXP: number;
    totalPoints: number;
    gamesPlayed: number;
  };
}
```
**Errors:**
- 400: Invalid input data
- 409: Email already exists
- 422: Display name already taken

## Profile Management Endpoints

### GET /api/profile

**Purpose:** Retrieve current user's profile data
**Parameters:** None (authenticated route)
**Response:**
```typescript
{
  success: boolean;
  profile: UserProfile;
}
```
**Errors:**
- 401: Not authenticated
- 404: Profile not found

### PUT /api/profile

**Purpose:** Update user profile information
**Parameters:**
- `displayName` (string, optional): New display name
- `preferences` (object, optional): User preferences object
- `profileVisibility` (string, optional): 'public' | 'friends' | 'private'
**Response:**
```typescript
{
  success: boolean;
  profile: UserProfile;
}
```
**Errors:**
- 400: Invalid input data
- 401: Not authenticated
- 422: Display name already taken

### GET /api/profile/stats

**Purpose:** Get user's game statistics and progression data
**Parameters:** None (authenticated route)
**Response:**
```typescript
{
  success: boolean;
  stats: {
    totalXP: number;
    level: number;
    currentLevelXP: number;
    nextLevelXP: number;
    totalPoints: number;
    totalTickets: number;
    gamesPlayed: number;
    totalPlayTime: number;
    recentGames: GameStats[];
  };
}
```
**Errors:**
- 401: Not authenticated

## Progression Endpoints

### POST /api/progression/award-xp

**Purpose:** Award experience points for game completion or achievements
**Parameters:**
- `gameId` (string, required): Identifier of the game played
- `xpAmount` (number, required): XP points to award
- `reason` (string, required): Reason for XP award ('game_completion', 'achievement', 'daily_bonus')
- `metadata` (object, optional): Additional context data
**Response:**
```typescript
{
  success: boolean;
  xpAwarded: number;
  newLevel: number;
  levelUp: boolean;
  newUnlocks?: string[];
}
```
**Errors:**
- 400: Invalid XP amount or reason
- 401: Not authenticated
- 429: Rate limited

### POST /api/progression/update-game-stats

**Purpose:** Update statistics for a specific game
**Parameters:**
- `gameId` (string, required): Game identifier
- `score` (number, required): Score achieved
- `completed` (boolean, required): Whether game was completed
- `playTime` (number, required): Time spent playing in milliseconds
**Response:**
```typescript
{
  success: boolean;
  gameStats: GameStats;
  newRecords: {
    highScore?: boolean;
    bestTime?: boolean;
  };
}
```
**Errors:**
- 400: Invalid game data
- 401: Not authenticated

## Validation Endpoints

### GET /api/validation/display-name/:displayName

**Purpose:** Check if display name is available
**Parameters:**
- `displayName` (string, URL parameter): Display name to check
**Response:**
```typescript
{
  available: boolean;
  suggestions?: string[];
}
```
**Errors:**
- 400: Invalid display name format

## Cloud Functions (Server-Side Processing)

### onUserCreate

**Trigger:** Firebase Auth user creation
**Purpose:** Initialize user profile in Firestore
**Processing:**
- Create user document with default values
- Set up initial game statistics
- Grant new user bonuses
- Send welcome notifications

### onProfileUpdate

**Trigger:** Firestore user profile update
**Purpose:** Validate and process profile changes
**Processing:**
- Validate display name uniqueness
- Update derived statistics
- Trigger achievement checks
- Update search indexes

### onXPAward

**Trigger:** XP award API call
**Purpose:** Process experience point awards and level calculations
**Processing:**
- Validate XP award legitimacy
- Calculate new level and progression
- Check for unlocks and achievements
- Update leaderboards

### scheduledDailyBonus

**Trigger:** Daily scheduled function
**Purpose:** Award daily login bonuses and reset daily challenges
**Processing:**
- Identify eligible users for daily bonuses
- Award bonus XP and tickets
- Reset daily challenge progress
- Clean up expired guest accounts

## Security Middleware

### Authentication Middleware
- Verify Firebase ID tokens on all protected routes
- Rate limiting per user for sensitive operations
- Validate user permissions for data access

### Input Validation
- Zod schema validation for all API inputs
- Sanitize user-generated content (display names, etc.)
- Prevent SQL injection and XSS attacks

### Anti-Cheat Protection
- Server-side validation of XP awards
- Anomaly detection for unusual progression patterns
- Rate limiting on score submissions and XP gains