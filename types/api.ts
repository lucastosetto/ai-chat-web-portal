// Common API types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
  message?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  token?: string;
  user?: User;
  message?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  nickname?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phoneNumber?: string;
  nickname?: string;
  bio?: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  message?: string;
}

export interface ResetPasswordRequest {
  id: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordResponse {
  message?: string;
}

export interface SocialAuthResponse {
  url?: string;
  message?: string;
}

// Chat types
export interface SendMessageRequest {
  message: string;
  conversationId?: string;
  uploadedAttachments?: UploadedAttachment[];
  appContext?: {
    screen: string;
    params?: Record<string, unknown>;
  };
}

export interface UploadedAttachment {
  objectPath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

export interface SendMessageResponse {
  message?: ChatMessage;
  conversation?: Conversation;
  messageId?: string;
  conversationId?: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  conversationId: string;
  createdAt: string;
  updatedAt?: string;
  citations?: Citation[];
  uploadedAttachments?: UploadedAttachment[];
}

export interface Citation {
  id?: string;
  title?: string;
  url?: string;
  snippet?: string;
}

export interface Conversation {
  id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: ChatMessage;
  messageCount?: number;
}

export interface GetConversationsParams extends PaginationParams {
  search?: string;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface GetConversationMessagesParams extends PaginationParams {
  page?: number;
  limit?: number;
}

export interface GetConversationMessagesResponse {
  messages: ChatMessage[];
  conversation: Conversation;
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface ReportMessageRequest {
  reason?: string;
  feedback?: string;
}

export interface ReportMessageResponse {
  message?: string;
}

export interface DownloadConversationRequest {
  name: string;
  type: string;
  content: string;
  messageId?: string;
}

export interface DownloadConversationResponse {
  url?: string;
  message?: string;
}

