# AI Chat Web Portal

## Overview
Create a web-based version of the AI Chat experience using Next.js with TypeScript. The portal will allow users to access their AI chat from a web browser, maintaining full synchronization with the mobile app, including account-level context, memory, and personalized behavior.

## Technical Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with optional react-native-web for component reuse)
- **Package Manager**: pnpm
- **API Base URL**: https://api.iamwarpspeed.com
- **Architecture**: Server Components preferred, minimal client-side rendering

## Technical Requirements
Create a web based version of the app's AI Chat experience. Users will be able to talk with their AI partner from their computer, with the same account level context, memory, and personalised behaviour they have on mobile. The portal should provide a seamless, secure, and fully synced extension of the existing mobile chat, making it easier for users to work, message, and get assistance while using a desktop environment.

All requirements must strictly follow the designs provided.

## User Stories

### 1. Access AI Chat on the Web
As a user, I want to access my AI chat from a web browser so I can use it on my computer.

**Acceptance criteria:**
- Web portal available via secure login
- Full chat history loads from the user's account
- Interface mirrors or improves upon mobile chat experience

### 2. Sync Context and Memory
As a user, I want my AI to behave consistently with the mobile version so I get the same personalised experience on any device.

**Acceptance criteria:**
- AI has full access to account level context and memory
- Messages sent on either platform sync instantly
- No behavioural differences unless intentionally designed

### 3. Secure Authentication
As a user, I want to log in securely so I know my data and AI conversations are safe.

**Acceptance criteria:**
- Uses existing authentication flow (email login, magic link, or OAuth)
- Session tokens securely stored and refreshed
- Automatic logout or session timeout rules applied

### 4. Start New Chats and Continue Existing Ones
As a user, I want to start new threads or continue existing conversations so I can manage multiple topics efficiently.

**Acceptance criteria:**
- Ability to create new chat threads
- Ability to switch between existing threads
- Chat states and messages mirror the mobile app

### 5. System Handling & Errors
As a user, I want clear messaging when something goes wrong so I know what action to take.

**Acceptance criteria:**
- Friendly error states for network issues, failed loads, or expired sessions
- Retry or refresh options shown
- Offline handling if applicable

## API Endpoints Reference

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `POST /auth/logout` - Logout
- `GET /auth/user` - Get user profile
- `GET /auth/user/google` - Google OAuth
- `GET /auth/user/apple` - Apple OAuth
- `GET /auth/user/facebook` - Facebook OAuth
- `POST /auth/request-reset-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Chat
- `POST /ai-chat/message` - Send message to AI
- `GET /ai-chat/conversations` - Get conversation list (with pagination and search)
- `GET /ai-chat/conversations/{conversationId}` - Get messages for a conversation
- `POST /ai-chat/conversations/{conversationId}/messages/{messageId}/report` - Report a message
- `POST /ai-chat/conversations/{conversationId}/download` - Download conversation

## Design References
- Desktop Design: [Link to be provided]
- Mobile Design: [Link to be provided]
- Mobile App Codebase: Reference implementation available in the source repository

## Implementation Notes
- Prefer Server Components over Client Components where possible
- Avoid Redux; use React Context or Zustand if state management needed
- Use Tailwind CSS for styling (react-native-web optional for component reuse)
- Follow mobile app's color scheme and design patterns
- Ensure all API calls match the OpenAPI spec
- Mock any missing API endpoints that may be needed

## Issues
All implementation tasks are tracked as GitHub issues. See the [Issues](https://github.com/lucastosetto/ai-chat-web-portal/issues) page for the complete list of sub-tasks.
