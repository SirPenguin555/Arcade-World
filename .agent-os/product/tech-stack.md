# Technical Stack

> Last Updated: 2025-08-03
> Version: 1.0.0

## Context

This is the technical stack for Arcade World, adapted from the global Agent OS standards for game development needs. Game-specific technologies and considerations are added to support real-time gaming, player progression, and arcade-style interactions.

## Core Technologies

### Application Framework
- **Framework:** Next.js
- **Version:** 14+ (App Router)
- **Language:** TypeScript
- **Type Checking:** Strict mode enabled
- **Game Adaptations:** Server-side game state management, real-time score processing

### Database
- **Primary:** Supabase (PostgreSQL)
- **Type:** Relational Database with real-time subscriptions
- **Real-time:** Yes (critical for live leaderboards and multiplayer)
- **Authentication:** Supabase Auth with Row Level Security
- **Game Data:** Player profiles, game scores, unlocks, progression tracking
- **Migration:** Migrated from Firebase to Supabase for better SQL support

## Frontend Stack

### JavaScript Framework
- **Framework:** React
- **Version:** Latest stable
- **Build Tool:** Next.js built-in (Turbopack)
- **Game Rendering:** Canvas API integration for game graphics

### Game Engine & Graphics
- **2D Graphics:** HTML5 Canvas API with TypeScript wrappers
- **Game Loop:** Custom RAF-based game loop with delta time
- **Sprite Management:** Custom sprite system for game assets
- **Audio:** Web Audio API for game sounds and music
- **Input Handling:** Keyboard, mouse, and touch event management
- **Mobile Support:** Touch controls and responsive game scaling

### State Management
- **Library:** Zustand
- **Purpose:** Game state, UI state, player data
- **Game State:** Separate stores for game logic vs UI state
- **Persistence:** Local storage for offline play, Firestore sync

### Data Fetching & Server State
- **Library:** TanStack Query (React Query)
- **Purpose:** Player data, leaderboards, game configurations
- **Real-time:** Firestore real-time listeners for live updates
- **Caching:** Aggressive caching for game assets and user data
- **Offline Strategy:** Optimistic updates with conflict resolution

### Form Handling
- **Library:** React Hook Form
- **Validation:** Zod schema validation
- **Use Cases:** Player registration, settings, tournament entries

### Game-Specific Libraries
- **Animation:** Framer Motion for UI animations, custom system for game sprites
- **Physics:** Custom lightweight physics for arcade-style collision detection
- **Math:** Custom utility functions for game mathematics
- **Timing:** High-precision timing for game loops and animations

### CSS Framework
- **Framework:** TailwindCSS
- **Version:** 4.0+
- **Game UI:** Custom components for arcade-style interfaces
- **Responsive:** Mobile-first design for cross-device gaming

### UI Components
- **Library:** Tailwind Plus (Tailwind UI)
- **Design System:** Catalyst UI Kit with arcade-themed customizations
- **Game UI:** Custom components for score displays, progress bars, game controls
- **Modals:** Game pause overlays, prize selection, tournament brackets

## Game Assets & Media

### Fonts
- **Provider:** Google Fonts
- **Game Fonts:** Pixelated/retro fonts for arcade aesthetic
- **Loading Strategy:** Next.js Font Optimization
- **Fallback:** System monospace for retro feel

### Icons & Graphics
- **Icons:** Phosphor Icons for UI, custom pixel art for games
- **Game Assets:** SVG and PNG sprites optimized for games
- **Asset Loading:** Lazy loading with preloading for active games
- **Optimization:** WebP with PNG fallbacks, sprite sheets

### Audio System
- **Engine:** Web Audio API
- **Formats:** MP3 for music, short WAV/OGG for sound effects
- **Features:** Volume control, muting, audio pooling for performance
- **Compression:** Optimized file sizes for web delivery

### Image Optimization
- **Tool:** Next.js Image Component
- **Storage:** Firebase Cloud Storage for user-generated content
- **Game Assets:** CDN-delivered sprite sheets and backgrounds
- **Optimization:** Multiple resolutions for different screen sizes

## Game-Specific Services

### Real-time Gaming
- **Multiplayer:** Firestore real-time database for turn-based games
- **Live Updates:** Real-time score updates and leaderboard changes
- **Synchronization:** Game state sync across multiple devices
- **Conflict Resolution:** Last-write-wins with validation

### Player Progression
- **Experience System:** Cloud Functions for XP calculations
- **Achievements:** Server-side achievement validation
- **Unlocks:** Content gating based on player level and achievements
- **Daily Challenges:** Automated challenge generation and tracking

### Game Analytics
- **Player Behavior:** Firebase Analytics with custom game events
- **Performance Monitoring:** Game frame rate and load time tracking
- **A/B Testing:** Firebase Remote Config for game balance testing
- **Crash Reporting:** Client-side error tracking for game issues

## Firebase Services (Game-Adapted)

### Authentication
- **Service:** Firebase Authentication
- **Providers:** Email, Google (guest play for quick start)
- **Anonymous Auth:** Allow guest players to try games
- **Account Linking:** Convert guest accounts to permanent accounts

### Database Schema
- **Players:** Profile, level, currency, unlocks
- **Games:** Configurations, high scores, play statistics
- **Tournaments:** Brackets, schedules, prize pools
- **Challenges:** Daily/weekly challenges and completions

### Backend Functions
- **Service:** Cloud Functions (Gen 2)
- **Game Logic:** Score validation, achievement triggers
- **Tournaments:** Bracket generation, result processing
- **Economy:** Currency transactions, prize distributions
- **Scheduled:** Daily challenge generation, tournament management

### Security & Fair Play
- **Service:** App Check
- **Anti-Cheat:** Server-side score validation
- **Rate Limiting:** Prevent score spam and exploitation
- **Input Validation:** All game inputs validated server-side

## Development Tools (Game-Enhanced)

### Testing Framework
- **Unit Testing:** Vitest for game logic testing
- **Game Testing:** Custom test utilities for game state
- **Performance Testing:** Frame rate and memory usage tests
- **Integration Testing:** Multiplayer and real-time features

### Game Development Tools
- **Asset Pipeline:** Custom build tools for sprite optimization
- **Level Editor:** Browser-based tools for game content creation
- **Debug Tools:** In-game debug overlays for development
- **Performance Profiling:** Game loop and rendering performance tools

### Code Quality
- **Game Logic:** Strict TypeScript for game state management
- **Code Organization:** Separation of game logic from presentation
- **Performance Standards:** 60fps target on modern devices
- **Memory Management:** Proper cleanup of game resources

## Deployment & Performance

### Application Hosting
- **Platform:** Firebase App Hosting
- **CDN:** Global distribution for game assets
- **Caching:** Aggressive caching for static game content
- **Performance:** Optimized for low-latency gaming

### Performance Optimization
- **Bundle Splitting:** Game-specific code splitting
- **Asset Loading:** Progressive loading of game assets
- **Memory Management:** Efficient sprite and audio management
- **Mobile Performance:** Optimized for mobile device constraints

### Monitoring
- **Game Performance:** Custom metrics for game-specific performance
- **Player Engagement:** Detailed analytics on player behavior
- **Error Tracking:** Game-specific error monitoring and alerting
- **A/B Testing:** Game balance and UI optimization testing