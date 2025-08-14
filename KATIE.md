# KATIE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 trivia application bootstrapped with `create-next-app`. The project uses React 19, Bootstrap 5.3.7, and React Bootstrap for styling.

**App Concept**: Interactive trivia game using the Open Trivia Database API (https://opentdb.com/) to provide questions across multiple categories and difficulty levels.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Project Structure

- **App Router**: Uses Next.js App Router with the `src/app/` directory structure
- **Styling**: Combines CSS modules (page.module.css) with Bootstrap and custom global styles
- **Fonts**: Uses Geist font family via `next/font/google`
- **Path aliases**: `@/*` maps to `./src/*` (configured in jsconfig.json)

## Key Files

- `src/app/layout.js`: Root layout with global font configuration and Bootstrap CSS import
- `src/app/page.js`: Main homepage component
- `src/app/globals.css`: Global CSS with dark mode support
- `eslint.config.mjs`: ESLint configuration extending Next.js core web vitals

## Architecture Notes

- Uses Next.js App Router (not Pages Router)
- Bootstrap is imported globally in layout.js
- CSS custom properties support dark mode automatically
- Font optimization handled by Next.js font system

## Trivia App Features

### Core Functionality
- **Question Display**: Show trivia questions with multiple choice or true/false answers
- **Category Selection**: Allow users to choose from available categories (General Knowledge, Science, History, etc.)
- **Difficulty Levels**: Easy, Medium, and Hard question options
- **Score Tracking**: Real-time score calculation and display
- **Timer**: Optional countdown timer for each question
- **Results Summary**: Show final score and correct answers review

### API Integration
- **Open Trivia Database API**: https://opentdb.com/api_config.php
- **No API Key Required**: Free to use with rate limiting considerations
- **Question Formats**: Support for multiple choice and boolean (true/false) questions
- **HTML Entity Decoding**: Questions may contain HTML entities that need decoding

### Planned Components
- `QuestionCard`: Display individual trivia questions
- `CategorySelector`: Choose trivia categories
- `ScoreBoard`: Track and display current score
- `GameSettings`: Configure difficulty, number of questions, timer settings
- `ResultsScreen`: Show final results and answer review
- `LoadingSpinner`: Show while fetching questions from API

### Data Flow
1. User selects game settings (category, difficulty, number of questions)
2. Fetch questions from Open Trivia Database API
3. Display questions one by one with answer options
4. Track user responses and calculate score
5. Show final results with option to play again

### API Endpoints
- **Base URL**: `https://opentdb.com/api.php`
- **Categories**: `https://opentdb.com/api_category.php`
- **Example**: `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`

### State Management
- Use React hooks (useState, useEffect) for local state
- Consider Context API for global game state if complexity grows
- Store game settings, current question, score, and progress

### Styling Approach
- Leverage Bootstrap components for rapid UI development
- Use React Bootstrap for interactive components
- Custom CSS modules for component-specific styling
- Responsive design for mobile and desktop play

### Error Handling
- Handle API failures gracefully
- Provide fallback content when API is unavailable
- Show user-friendly error messages
- Implement retry mechanisms for failed requests

### Performance Considerations
- Preload next question while user answers current one
- Implement proper loading states
- Consider caching categories and recent questions
- Optimize re-renders with React.memo and useCallback where needed

## Key Features Implemented ✅

### Components Created:
- **QuestionCard** (`src/components/QuestionCard.js`) - Interactive question display with timer, answer selection, and feedback

### Game Setup Screen
- Category selection from Open Trivia Database API
- Difficulty levels (Easy, Medium, Hard)
- Question quantity (5, 10, 15, 20)
- Question type (Multiple Choice, True/False)

### QuestionCard Component
- 30-second countdown timer per question
- Visual progress bar for time remaining
- Shuffled answer options with letter labels (A, B, C, D)
- Immediate feedback showing correct/incorrect answers
- HTML entity decoding for special characters
- Smooth animations and hover effects

### Game Logic
- Real-time score tracking
- Question progression with automatic advancement
- Answer validation and scoring
- Complete game state management

### Results Screen
- Final score display with percentage
- Comprehensive answer review
- Color-coded feedback (green for correct, red for incorrect)
- Options to play again or change settings

### Technical Implementation
- **API Integration**: Fetches questions from Open Trivia Database API
- **Error Handling**: Graceful handling of API failures and network issues
- **Responsive Design**: Works on mobile and desktop using Bootstrap
- **Performance**: Optimized with React hooks (useCallback, useEffect)
- **Code Quality**: Passes ESLint checks with no warnings

### Game Flow
1. **Setup** → Select category, difficulty, and number of questions
2. **Playing** → Answer questions with timer and immediate feedback
3. **Results** → Review performance and play again

## Retro Arcade Transformation Complete! 🎮 ✨

### 🎨 Color Palette & Visual Design
- **Neon Colors**: Hot pink, cyan, lime green, electric purple, orange, electric blue
- **Success/Error States**: Bright neon green for correct answers, hot neon red for errors
- **Deep Space Background**: Black (#0a0a0a) with animated gradient patterns and star field effects
- **Scanline Overlay**: Subtle CRT monitor scanlines across the entire app

### 🔤 Typography Implementation
- **Orbitron**: Futuristic headers and titles with bold weight
- **Rajdhani**: Clean body text with tech-style appearance
- **JetBrains Mono**: Terminal-style font for scores and timers
- **Press Start 2P**: True retro gaming feel for special accents

### ⚡ Visual Effects & Animations
- **Neon Glow Effects**: All interactive elements have customizable glow intensities
- **CSS Animations**: Pulsing glows, color cycling, and hover effects
- **Glitch Transitions**: Question changes trigger glitch effects
- **Animated Backgrounds**: Subtle color gradients and geometric patterns
- **CRT Monitor Curvature**: Main containers have realistic monitor styling

### 🎯 Component Styling

**Setup Screen:**
- Arcade-style title with color-cycling animation
- "INSERT COIN TO PLAY" retro text
- Neon-outlined category selector and game mode buttons
- Interactive difficulty buttons with color coding

**Question Cards:**
- Dark gradient backgrounds with bright neon borders
- Circular timer with color-changing progress ring
- Answer buttons with different neon colors (A=pink, B=cyan, C=lime, D=orange)
- Immediate visual feedback with glow effects

**Results Screen:**
- Performance-based ranking system (LEGENDARY, EXPERT, SKILLED, etc.)
- Dramatic score display with celebration animations
- Color-coded answer review with neon borders
- Retro-style action buttons

### 🔧 Technical Features
- **CSS Custom Properties**: Consistent neon color system
- **Keyframe Animations**: Smooth pulsing, cycling, and glitch effects
- **Responsive Design**: Fully mobile-friendly with adjusted sizing
- **Performance Optimized**: Clean build with no lint errors
- **Accessibility**: Maintains readability with high contrast

### 🎪 Special Effects
- **Border Cycling**: Animated rainbow borders on containers
- **Loading Animations**: Retro-style loading indicators with geometric symbols
- **Score Rank System**: Dynamic color-coded performance ratings
- **Glitch Transitions**: Brief distortion effects between questions
- **Breathing Animations**: Subtle pulsing on active elements

### 🎨 CSS Enhancements Added
- **Retro Background Effects**: Animated gradient patterns and grid overlays
- **Scanline Animation**: CRT monitor effect with moving scanlines
- **Neon Glow Classes**: Reusable utility classes for consistent lighting effects
- **Custom Scrollbars**: Neon-themed scrollbars for answer review sections
- **Mobile Responsiveness**: Optimized sizing and effects for all screen sizes

The trivia app now delivers an authentic 80s arcade gaming experience with modern web technology, complete with neon aesthetics, retro typography, and immersive visual effects! 🕹️✨