import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chatService } from '../chat';
import { chatApiClient, apiClient } from '../api-client';
import type {
  SendMessageRequest,
  GetConversationsParams,
  GetConversationMessagesParams,
  ReportMessageRequest,
  DownloadConversationRequest,
} from '@/types/api';

// Mock dependencies
vi.mock('../api-client');

describe('chatService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send message using chatApiClient with 120s timeout', async () => {
      const messageData: SendMessageRequest = {
        message: 'Hello, AI!',
        conversationId: 'conv-123',
      };

      const mockResponse = {
        data: {
          message: {
            id: 'msg-123',
            message: 'Hello, AI!',
            role: 'user',
            conversationId: 'conv-123',
          },
        },
      };

      vi.mocked(chatApiClient.post).mockResolvedValue(mockResponse as any);

      const result = await chatService.sendMessage(messageData);

      expect(chatApiClient.post).toHaveBeenCalledWith('/ai-chat/message', messageData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should send message with attachments', async () => {
      const messageData: SendMessageRequest = {
        message: 'Check this out',
        uploadedAttachments: [
          {
            objectPath: 'path/to/file.pdf',
            originalFilename: 'document.pdf',
            mimetype: 'application/pdf',
            size: 1024,
          },
        ],
      };

      const mockResponse = { data: { messageId: 'msg-123' } };
      vi.mocked(chatApiClient.post).mockResolvedValue(mockResponse as any);

      await chatService.sendMessage(messageData);

      expect(chatApiClient.post).toHaveBeenCalledWith('/ai-chat/message', messageData);
    });
  });

  describe('getConversations', () => {
    it('should fetch conversations with default params', async () => {
      const mockResponse = {
        data: {
          conversations: [
            {
              id: 'conv-1',
              title: 'Conversation 1',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-02',
            },
          ],
          page: 1,
          limit: 10,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse as any);

      const result = await chatService.getConversations();

      expect(apiClient.get).toHaveBeenCalledWith('/ai-chat/conversations', {
        params: undefined,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch conversations with pagination and search', async () => {
      const params: GetConversationsParams = {
        page: 2,
        limit: 20,
        search: 'test query',
      };

      const mockResponse = {
        data: {
          conversations: [],
          page: 2,
          limit: 20,
          total: 0,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse as any);

      const result = await chatService.getConversations(params);

      expect(apiClient.get).toHaveBeenCalledWith('/ai-chat/conversations', {
        params,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getConversationMessages', () => {
    it('should fetch messages for a conversation', async () => {
      const conversationId = 'conv-123';
      const params: GetConversationMessagesParams = {
        page: 1,
        limit: 50,
      };

      const mockResponse = {
        data: {
          messages: [
            {
              id: 'msg-1',
              message: 'Hello',
              role: 'user',
              conversationId: 'conv-123',
              createdAt: '2024-01-01',
            },
          ],
          conversation: {
            id: 'conv-123',
            title: 'Test Conversation',
          },
          page: 1,
          limit: 50,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse as any);

      const result = await chatService.getConversationMessages(conversationId, params);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/ai-chat/conversations/${conversationId}`,
        { params }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch messages without params', async () => {
      const conversationId = 'conv-123';
      const mockResponse = {
        data: {
          messages: [],
          conversation: { id: 'conv-123' },
          page: 1,
          limit: 10,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse as any);

      await chatService.getConversationMessages(conversationId);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/ai-chat/conversations/${conversationId}`,
        { params: undefined }
      );
    });
  });

  describe('reportMessage', () => {
    it('should report a message', async () => {
      const conversationId = 'conv-123';
      const messageId = 'msg-456';
      const reportData: ReportMessageRequest = {
        reason: 'Inappropriate content',
        feedback: 'This message contains inappropriate content',
      };

      const mockResponse = {
        data: { message: 'Message reported successfully' },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse as any);

      const result = await chatService.reportMessage(
        conversationId,
        messageId,
        reportData
      );

      expect(apiClient.post).toHaveBeenCalledWith(
        `/ai-chat/conversations/${conversationId}/messages/${messageId}/report`,
        reportData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('downloadConversation', () => {
    it('should download conversation', async () => {
      const conversationId = 'conv-123';
      const downloadData: DownloadConversationRequest = {
        name: 'conversation.pdf',
        type: 'pdf',
        content: 'conversation content',
      };

      const mockResponse = {
        data: { url: 'https://download-url.com/file.pdf' },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse as any);

      const result = await chatService.downloadConversation(
        conversationId,
        downloadData
      );

      expect(apiClient.post).toHaveBeenCalledWith(
        `/ai-chat/conversations/${conversationId}/download`,
        downloadData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});

