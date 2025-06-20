/**
 * Unipile API - LinkedIn Messages Response Cleaners
 * 
 * This file contains functions for cleaning and formatting LinkedIn message responses
 * from the Unipile API to make them suitable for feeding to an LLM.
 */

/**
 * Clean and format a single message
 * 
 * @param message - The raw message data from the API
 * @returns A cleaned and formatted message
 */
function cleanMessage(message: any): any {
  if (!message) return null;

  return {
    id: message.id,
    text: message.text,
    timestamp: message.timestamp,
    isSender: message.is_sender,
    senderId: message.sender_id,
    senderAttendeeId: message.sender_attendee_id,
    chatId: message.chat_id,
    chatProviderId: message.chat_provider_id,
    seen: message.seen,
    delivered: message.delivered,
    edited: message.edited,
    deleted: message.deleted,
    attachments: message.attachments || []
  };
}

/**
 * Clean and format chats response
 * 
 * @param chatsResponse - The raw chats response from the API
 * @returns Cleaned and formatted chats
 */
export function cleanChats(chatsResponse: any): any {
  if (!chatsResponse || !chatsResponse.items) return { chats: [] };

  return {
    chats: chatsResponse.items.map((chat: any) => ({
      id: chat.id,
      name: chat.name,
      lastActivity: chat.timestamp,
      unreadCount: chat.unread_count,
      attendeeProviderId: chat.attendee_provider_id,
      providerId: chat.provider_id,
      attendees: chat.attendees?.map((attendee: any) => ({
        id: attendee.id,
        name: `${attendee.first_name} ${attendee.last_name}`,
        profilePictureUrl: attendee.profile_picture_url
      })) || [],
      lastMessage: chat.last_message ? {
        text: chat.last_message.text,
        timestamp: chat.last_message.timestamp,
        senderId: chat.last_message.sender_id
      } : null
    }))
  };
}

/**
 * Clean and format chat messages response
 * 
 * @param messagesResponse - The raw chat messages response from the API
 * @returns Cleaned and formatted chat messages
 */
export function cleanChatMessages(messagesResponse: any): any {
  if (!messagesResponse || !messagesResponse.items) return { messages: [] };

  return {
    messages: messagesResponse.items.map(cleanMessage),
    cursor: messagesResponse.cursor
  };
}

/**
 * Clean and format create chat response
 * 
 * @param createChatResponse - The raw create chat response from the API
 * @returns Cleaned and formatted create chat response
 */
export function cleanCreateChatResponse(createChatResponse: any): any {
  if (!createChatResponse) return null;

  return {
    success: true,
    object: createChatResponse.object,
    chatId: createChatResponse.chat_id,
    messageId: createChatResponse.message_id
  };
}

/**
 * Clean and format send message response
 * 
 * @param sendMessageResponse - The raw send message response from the API
 * @returns Cleaned and formatted send message response
 */
export function cleanSendMessageResponse(sendMessageResponse: any): any {
  if (!sendMessageResponse) return null;

  return {
    success: true,
    object: sendMessageResponse.object,
    messageId: sendMessageResponse.message_id || sendMessageResponse.id
  };
}