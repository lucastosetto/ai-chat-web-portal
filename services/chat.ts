import { chatApiClient, apiClient } from './api-client';
import type {
  SendMessageRequest,
  SendMessageResponse,
  GetConversationsParams,
  GetConversationsResponse,
  GetConversationMessagesParams,
  GetConversationMessagesResponse,
  ReportMessageRequest,
  ReportMessageResponse,
  DownloadConversationRequest,
  DownloadConversationResponse,
} from '@/types/api';

/**
 * Chat service for AI chat conversations and messages
 */
export const chatService = {
  /**
   * Send a message to AI chat
   * Uses chatApiClient with 120s timeout for longer AI responses
   */
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await chatApiClient.post<SendMessageResponse>(
      '/ai-chat/message',
      data
    );
    return response.data;
  },

  /**
   * Get all conversations for the current user
   */
  async getConversations(
    params?: GetConversationsParams
  ): Promise<GetConversationsResponse> {
    const response = await apiClient.get<GetConversationsResponse>(
      '/ai-chat/conversations',
      { params }
    );
    return response.data;
  },

  /**
   * Get messages for a specific conversation
   */
  async getConversationMessages(
    conversationId: string,
    params?: GetConversationMessagesParams
  ): Promise<GetConversationMessagesResponse> {
    const response = await apiClient.get<GetConversationMessagesResponse>(
      `/ai-chat/conversations/${conversationId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Report a message
   */
  async reportMessage(
    conversationId: string,
    messageId: string,
    data: ReportMessageRequest
  ): Promise<ReportMessageResponse> {
    const response = await apiClient.post<ReportMessageResponse>(
      `/ai-chat/conversations/${conversationId}/messages/${messageId}/report`,
      data
    );
    return response.data;
  },

  /**
   * Download a conversation
   */
  async downloadConversation(
    conversationId: string,
    data: DownloadConversationRequest
  ): Promise<DownloadConversationResponse> {
    const response = await apiClient.post<DownloadConversationResponse>(
      `/ai-chat/conversations/${conversationId}/download`,
      data
    );
    return response.data;
  },
};

