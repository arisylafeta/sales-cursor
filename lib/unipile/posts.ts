/**
 * Unipile API - LinkedIn Posts
 * 
 * This file contains functions for interacting with LinkedIn posts via the Unipile API.
 */

import { getBaseUrl, getHeaders, makeRequest, ensureAccountId, PaginatedResponse } from './config';

// Types
export interface LinkedInPostAuthor {
  public_identifier: string;
  id: string;
  name: string;
  is_company: boolean;
  headline?: string;
}

export interface LinkedInPostAttachment {
  type: string;
  url?: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

export interface LinkedInPost {
  object: string;
  provider: string;
  social_id: string;
  share_url: string;
  date: string;
  parsed_datetime: string;
  comment_counter: number;
  impressions_counter: number;
  reaction_counter: number;
  repost_counter: number;
  permissions: {
    can_post_comments: boolean;
    can_react: boolean;
    can_share: boolean;
  };
  text: string;
  attachments: LinkedInPostAttachment[];
  author: LinkedInPostAuthor;
  is_repost?: boolean;
  id: string;
  repost_id?: string;
  reposted_by?: LinkedInPostAuthor;
  repost_content?: {
    id: string;
    date: string;
    parsed_datetime: string;
    text: string;
    author: LinkedInPostAuthor;
  };
}

export interface LinkedInComment {
  object: string;
  id: string;
  post_id: string;
  post_urn: string;
  date: string;
  author: string;
  author_details: {
    id: string;
    is_company: boolean;
    headline?: string;
    profile_url?: string;
    network_distance?: string;
  };
  text: string;
  reaction_counter: number;
  reply_counter: number;
}

/**
 * Get posts from a specific LinkedIn user
 * 
 * @param userId - The LinkedIn user's provider ID
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns The user's LinkedIn posts
 */
export async function getUserPosts(
  userId: string,
  accountId?: string,
  cursor?: string,
  limit?: number
): Promise<PaginatedResponse<LinkedInPost>> {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/users/${userId}/posts?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  return makeRequest<PaginatedResponse<LinkedInPost>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Get comments from a specific LinkedIn user
 * 
 * @param userId - The LinkedIn user's provider ID
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns The user's LinkedIn comments
 */
export async function getUserComments(
  userId: string,
  accountId?: string,
  cursor?: string,
  limit?: number
): Promise<PaginatedResponse<LinkedInComment>> {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/users/${userId}/comments?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  return makeRequest<PaginatedResponse<LinkedInComment>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Create a new LinkedIn post
 * 
 * @param content - The content of the post
 * @param visibility - The visibility of the post (connections or public)
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The created post
 */
export async function createPost(
  content: string,
  visibility: 'connections' | 'public' = 'connections',
  accountId?: string
): Promise<any> {
  if (!content) {
    throw new Error('Post content is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/posts`;
  
  return makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      account_id: id,
      content,
      visibility
    })
  });
}

/**
 * Get a specific LinkedIn post
 * 
 * @param postId - The LinkedIn post ID
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The LinkedIn post
 */
export async function getPost(
  postId: string,
  accountId?: string
): Promise<LinkedInPost> {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/posts/${postId}?account_id=${id}`;
  
  return makeRequest<LinkedInPost>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Get comments on a specific LinkedIn post
 * 
 * @param postId - The LinkedIn post ID
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns Comments on the LinkedIn post
 */
export async function getPostComments(
  postId: string,
  accountId?: string,
  cursor?: string,
  limit?: number
): Promise<PaginatedResponse<LinkedInComment>> {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/posts/${postId}/comments?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  return makeRequest<PaginatedResponse<LinkedInComment>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Comment on a LinkedIn post
 * 
 * @param postId - The LinkedIn post ID
 * @param content - The content of the comment
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The created comment
 */
export async function commentOnPost(
  postId: string,
  content: string,
  accountId?: string
): Promise<any> {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  if (!content) {
    throw new Error('Comment content is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/posts/${postId}/comments`;
  
  return makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      account_id: id,
      content
    })
  });
}