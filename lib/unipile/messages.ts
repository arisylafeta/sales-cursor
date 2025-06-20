/**
 * Unipile API - LinkedIn Messages
 * 
 * This file contains functions for interacting with LinkedIn messages via the Unipile API.
 */

import { getBaseUrl, getHeaders, makeRequest, ensureAccountId, PaginatedResponse } from './config';
import { 
  cleanChats, 
  cleanChatMessages, 
  cleanCreateChatResponse, 
  cleanSendMessageResponse 
} from './cleaners/messages';

// Types
export interface LinkedInChat {
  object: string;
  name: string | null;
  type: number;
  folder: string[];
  unread: number;
  archived: number;
  read_only: number;
  timestamp: string;
  account_id: string;
  muted_until: string | null;
  provider_id: string;
  account_type: string;
  unread_count: number;
  disabledFeatures: string[];
  attendee_provider_id: string;
  id: string;
}

export interface LinkedInMessage {
  object: string;
  seen: number;
  text: string;
  edited: number;
  hidden: number;
  chat_id: string;
  deleted: number;
  seen_by: Record<string, any>;
  subject: string | null;
  behavior: string | null;
  is_event: number;
  original: string;
  delivered: number;
  is_sender: number;
  reactions: any[];
  sender_id: string;
  timestamp: string;
  account_id: string;
  attachments: any[];
  provider_id: string;
  message_type: string;
  attendee_type: string;
  chat_provider_id: string;
  attendee_distance: number;
  sender_attendee_id: string;
  id: string;
}

export interface LinkedInMessageAttachment {
  type: string;
  url: string;
  name?: string;
  size?: number;
  mime_type?: string;
  thumbnail_url?: string;
  [key: string]: any;
}

/**
 * Get the user's LinkedIn conversations
 * 
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns The user's LinkedIn chats
 */
export async function getChats(
  accountId?: string,
  cursor?: string,
  limit?: number,
  raw: boolean = false
): Promise<any> {
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/chats?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  const response = await makeRequest<PaginatedResponse<LinkedInChat>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanChats(response);
}

/**
 * Get messages from a specific LinkedIn chat
 * 
 * @param chatId - The LinkedIn chat ID
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns Messages from the LinkedIn chat
 */
export async function getChatMessages(
  chatId: string,
  accountId?: string,
  cursor?: string,
  limit?: number,
  raw: boolean = false
): Promise<any> {
  if (!chatId) {
    throw new Error('Chat ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/chats/${chatId}/messages?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  const response = await makeRequest<PaginatedResponse<LinkedInMessage>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanChatMessages(response);
}

/**
 * Send a message in a LinkedIn chat
 * 
 * @param chatId - The LinkedIn chat ID
 * @param content - The content of the message
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param options - Optional message options
 * @returns The sent message
 */
export async function sendMessage(
  chatId: string,
  content: string,
  accountId?: string,
  options?: {
    type?: 'text' | 'html';
    attachments?: LinkedInMessageAttachment[];
  },
  raw: boolean = false
): Promise<any> {
  if (!chatId) {
    throw new Error('Chat ID is required');
  }
  
  if (!content) {
    throw new Error('Message content is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/chats/${chatId}/messages`;
  
  const body: any = {
    account_id: id,
    content,
    type: options?.type || 'text'
  };
  
  if (options?.attachments && options.attachments.length > 0) {
    body.attachments = options.attachments;
  }
  
  const response = await makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body)
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanSendMessageResponse(response);
}

/**
 * Create a new chat with a LinkedIn user
 * 
 * @param recipientId - The LinkedIn user's provider ID
 * @param text - The text of the message to be sent in the new chat
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The created chat
 */
export async function createChat(
  recipientId: string,
  text: string,
  accountId?: string,
  raw: boolean = false
): Promise<any> {
  if (!recipientId) {
    throw new Error('Recipient ID is required');
  }

  if (!text) {
    throw new Error('Message text is required');
  }

  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/chats`;

  const response = await makeRequest<LinkedInChat>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      account_id: id,
      attendees_ids: [recipientId],
      text
    })
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanCreateChatResponse(response);
}