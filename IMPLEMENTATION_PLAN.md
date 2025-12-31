# AI Chat Web Portal - Implementation Plan

## Overview
Create a web-based version of the AI Chat experience using Next.js with TypeScript. The portal will allow users to access their AI chat from a web browser, maintaining full synchronization with the mobile app, including account-level context, memory, and personalized behavior.

## Technical Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with optional react-native-web for component reuse)
- **Package Manager**: pnpm
- **API Base URL**: https://api.iamwarpspeed.com
- **Architecture**: Server Components preferred, minimal client-side rendering

---

## Sub-Tasks

### 1. Project Setup and Configuration
**Description**: Initialize Next.js project with TypeScript, configure Tailwind CSS, set up project structure, and install necessary dependencies. Configure environment variables for API endpoints and authentication.

**Key Activities**:
- Initialize Next.js 14+ project with TypeScript and App Router
- Configure Tailwind CSS with design system colors from mobile app
- Set up pnpm workspace configuration
- Create environment variable setup (.env.local, .env.example)
- Configure TypeScript paths (@/ aliases)
- Set up Prettier and ESLint with project-specific rules
- Create base folder structure (app/, components/, lib/, types/, hooks/, services/)

---

### 2. Design System and Theme Configuration
**Description**: Extract and implement the color scheme, typography, and design tokens from the mobile app to ensure visual consistency between web and mobile platforms.

**Key Activities**:
- Create theme configuration file with colors from `Colors.ts` (Theme.brand, Theme.colors)
- Set up Tailwind config with custom color palette matching mobile app
- Implement dark/light mode support (if required)
- Create typography system matching mobile app styles
- Set up responsive breakpoints for desktop and mobile views
- Create reusable design tokens (spacing, border radius, shadows)

---

### 3. API Service Layer
**Description**: Implement API client with authentication interceptors, error handling, and type-safe API methods for all chat and authentication endpoints.

**Key Activities**:
- Create axios instance with base URL configuration
- Implement authentication token interceptor (Bearer token)
- Create API service modules:
  - `auth.ts`: login, register, logout, social sign-in (Google, Apple, Facebook), password reset, user profile
  - `chat.ts`: send message, get conversations, get messages by conversation ID, report message, download conversation
- Implement request/response interceptors for error handling
- Add timeout configurations (40s for regular requests, 120s for chat messages)
- Create TypeScript types/interfaces matching API responses
- Implement token refresh logic and session management

---

### 4. Authentication System
**Description**: Implement secure authentication flow with email/password login, magic link, OAuth (Google, Apple, Facebook), session management, and automatic token refresh.

**Key Activities**:
- Create login page with email/password form (matching mobile design)
- Implement form validation using Zod schemas (from `schemas/auth.ts`)
- Add "Remember Me" functionality with secure token storage
- Implement OAuth flows for Google, Apple, and Facebook
- Create session management with secure HTTP-only cookies or localStorage
- Implement automatic token refresh before expiration
- Add logout functionality with token cleanup
- Create protected route middleware for authenticated pages
- Implement "Forgot Password" flow
- Add registration flow (if required)
- Add session timeout handling

---

### 5. Chat Conversation List (Sidebar)
**Description**: Build the conversation sidebar that displays all chat threads, allows searching, creating new chats, and switching between conversations.

**Key Activities**:
- Create sidebar component for desktop view (drawer/menu for mobile)
- Implement conversation list with pagination (infinite scroll)
- Add search functionality for conversations (debounced input)
- Create "New Chat" button/action
- Implement conversation item component with:
  - Conversation title/name
  - Last message preview
  - Timestamp
  - Active/selected state styling
- Add loading states and empty states
- Implement conversation selection handler
- Add responsive behavior (drawer on mobile, sidebar on desktop)

---

### 6. Chat Interface - Message Display
**Description**: Implement the main chat interface that displays messages, handles message rendering (user and assistant), supports markdown, citations, and attachments.

**Key Activities**:
- Create chat container component with message list
- Implement message bubble components:
  - User message bubble
  - Assistant message bubble with citations
  - Loading/typing indicator
- Add markdown rendering for message content (using `RenderRules.tsx` as reference)
- Implement citation display (source cards)
- Add message actions (copy, report, retry)
- Create scroll-to-bottom functionality
- Implement infinite scroll for loading older messages
- Add message timestamps and read states
- Handle message attachments (images, documents, etc.)
- Implement image viewer modal for attachments

---

### 7. Chat Input and Message Sending
**Description**: Build the chat input component with text input, attachment support, send button, and integration with the AI chat API.

**Key Activities**:
- Create chat input component with multiline text area
- Implement send button with loading state
- Add attachment support:
  - File picker for documents
  - Image upload with preview
  - Attachment preview component
  - Remove attachment functionality
- Integrate with `inputQuery` API endpoint
- Handle message sending with conversation ID
- Implement prompt input state management
- Add input validation and character limits
- Create attachment upload flow with progress indicators
- Handle API errors and retry logic

---

### 8. Chat Entry View (Empty State)
**Description**: Create the initial chat screen shown when no conversation is selected, displaying prompt suggestions and welcome message.

**Key Activities**:
- Create empty state component matching mobile design
- Display WarpSpeed AI logo/icon
- Show "How can I help you today?" message
- Implement prompt suggestion cards/buttons (from `aiPromptSuggestions.ts`)
- Add click handler to populate input with suggestion
- Create responsive layout for desktop and mobile
- Add loading spinner state for initial load

---

### 9. Real-time Message Sync
**Description**: Implement real-time synchronization of messages between web and mobile platforms, ensuring messages sent on either platform appear instantly on the other.

**Key Activities**:
- Implement polling mechanism for new messages (if WebSocket not available)
- Or set up WebSocket connection for real-time updates
- Create message sync service that checks for new messages periodically
- Handle message updates in existing conversations
- Implement optimistic UI updates for sent messages
- Add conflict resolution for concurrent edits
- Ensure conversation list updates when new messages arrive
- Handle offline/online state detection

---

### 10. Error Handling and User Feedback
**Description**: Implement comprehensive error handling with user-friendly error messages, retry mechanisms, and offline handling.

**Key Activities**:
- Create error boundary components
- Implement error states for:
  - Network failures (with retry button)
  - API errors (401, 403, 404, 500, etc.)
  - Session expiration (redirect to login)
  - Rate limiting
  - Timeout errors
- Add loading states for all async operations
- Create toast/notification system for user feedback
- Implement offline detection and offline mode UI
- Add retry logic for failed requests
- Create friendly error messages matching mobile app style
- Handle attachment upload errors

---

### 11. Responsive Design Implementation
**Description**: Ensure the web portal works seamlessly on both desktop and mobile devices, adapting layouts and interactions appropriately.

**Key Activities**:
- Implement responsive layout for desktop (sidebar + main chat)
- Create mobile-optimized layout (drawer menu + full-width chat)
- Add responsive breakpoints and media queries
- Optimize touch interactions for mobile devices
- Implement responsive typography and spacing
- Test and adjust for various screen sizes
- Ensure proper keyboard handling on mobile
- Add mobile-specific UI patterns (bottom sheets, modals)

---

### 12. Session Management and Security
**Description**: Implement secure session handling, automatic logout on token expiration, and secure storage of authentication tokens.

**Key Activities**:
- Implement secure token storage (HTTP-only cookies preferred, or secure localStorage)
- Add automatic token refresh before expiration
- Implement session timeout detection
- Create logout functionality that clears all session data
- Add CSRF protection (if using cookies)
- Implement secure password handling (no logging, proper hashing on backend)
- Add rate limiting on client side
- Implement secure redirects after authentication

---

### 13. Chat History and Persistence
**Description**: Ensure chat history loads correctly from the user's account, maintaining conversation state and message history.

**Key Activities**:
- Implement conversation loading on app initialization
- Load messages for selected conversation with pagination
- Cache conversation data appropriately
- Implement conversation state persistence (URL params or state management)
- Handle deep linking to specific conversations
- Ensure message history displays in correct order
- Implement conversation metadata (title, last updated, etc.)

---

### 14. Attachment Handling
**Description**: Implement full attachment support including file upload, preview, download, and display within chat messages.

**Key Activities**:
- Create file upload component with drag-and-drop support
- Implement file type validation
- Add image preview functionality
- Create document preview component (PDF, DOCX, etc.)
- Implement attachment upload to API
- Add progress indicators for uploads
- Create attachment display in message bubbles
- Implement attachment download functionality
- Handle attachment errors and retries
- Add attachment size limits and validation

---

### 15. Accessibility and Performance Optimization
**Description**: Ensure the web portal is accessible, performant, and follows web best practices.

**Key Activities**:
- Add ARIA labels and semantic HTML
- Implement keyboard navigation
- Add focus management
- Optimize bundle size (code splitting, lazy loading)
- Implement image optimization
- Add loading states and skeleton screens
- Optimize API calls (debouncing, caching)
- Implement virtual scrolling for long message lists (if needed)
- Add performance monitoring
- Ensure WCAG 2.1 compliance

---

### 16. Testing and Quality Assurance
**Description**: Implement comprehensive testing to ensure functionality, reliability, and user experience quality.

**Key Activities**:
- Write unit tests for utility functions and hooks
- Create integration tests for API services
- Add component tests for UI components
- Implement E2E tests for critical user flows (login, send message, switch conversations)
- Test error scenarios and edge cases
- Perform cross-browser testing
- Test responsive design on various devices
- Validate API integration with actual backend
- Test authentication flows
- Performance testing and optimization

---

### 17. Deployment and Configuration
**Description**: Set up deployment configuration, environment variables, and production optimizations.

**Key Activities**:
- Configure production build settings
- Set up environment variables for production
- Configure API endpoints for different environments
- Add error tracking (e.g., Sentry)
- Set up analytics (if required)
- Configure CDN for static assets
- Add security headers
- Set up CI/CD pipeline
- Create deployment documentation
- Configure domain and SSL

---

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

---

## Design References
- Desktop Design: [Link to be provided]
- Mobile Design: [Link to be provided]
- Mobile App Codebase: Reference implementation in `temp-clone/src/`

---

## Notes
- Prefer Server Components over Client Components where possible
- Avoid Redux; use React Context or Zustand if state management needed
- Use Tailwind CSS for styling (react-native-web optional for component reuse)
- Follow mobile app's color scheme and design patterns
- Ensure all API calls match the OpenAPI spec in `api.json`
- Mock any missing API endpoints that may be needed

