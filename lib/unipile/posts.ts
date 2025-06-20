/**
 * Unipile API - LinkedIn Posts
 * 
 * This file contains functions for interacting with LinkedIn posts via the Unipile API.
 */

import { getBaseUrl, getHeaders, makeRequest, ensureAccountId, PaginatedResponse } from './config';
import { 
  cleanUserPosts, 
  cleanPostComments, 
  cleanCreatePostResponse, 
  cleanCommentOnPostResponse 
} from './cleaners/posts';

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
  limit?: number,
  raw: boolean = false
): Promise<any> {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/users/${userId}/posts?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  const response = await makeRequest<PaginatedResponse<LinkedInPost>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanUserPosts(response);
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
  limit?: number,
  raw: boolean = false
): Promise<any> {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/users/${userId}/comments?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  const response = await makeRequest<PaginatedResponse<LinkedInComment>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanPostComments(response);
}

/**
 * Create a new LinkedIn post
 * 
 * @param text - The text of the post
 * @param visibility - The visibility of the post (connections or public)
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The created post
 */
export async function createPost(
  text: string,
  visibility: 'connections' | 'public' = 'connections',
  accountId?: string,
  raw: boolean = false
): Promise<any> {
  if (!text) {
    throw new Error('Post text is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/posts`;
  
  const response = await makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      account_id: id,
      text,
      visibility
    })
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanCreatePostResponse(response);
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
  accountId?: string,
  raw: boolean = false
): Promise<any> {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/posts/${postId}?account_id=${id}`;
  
  const response = await makeRequest<LinkedInPost>(url, {
    method: 'GET',
    headers: getHeaders()
  });
  
  // Return raw response if raw is true
  if (raw) {
    return response;
  }
  
  // Otherwise clean and return
  // Using cleanPost function which is internal to posts.ts cleaner
  // We'll use a simplified version here
  return {
    id: response.id,
    text: response.text,
    date: response.date,
    parsedDateTime: response.parsed_datetime,
    shareUrl: response.share_url,
    stats: {
      comments: response.comment_counter,
      reactions: response.reaction_counter,
      reposts: response.repost_counter,
      impressions: response.impressions_counter
    },
    author: response.author ? {
      name: response.author.name,
      headline: response.author.headline,
      publicIdentifier: response.author.public_identifier,
      isCompany: response.author.is_company
    } : null
  };
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
  limit?: number,
  raw: boolean = false
): Promise<any> {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/posts/${postId}/comments?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  const response = await makeRequest<PaginatedResponse<LinkedInComment>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanPostComments(response);
}

/**
 * Comment on a LinkedIn post
 * 
 * @param postId - The LinkedIn post ID
 * @param text - The content of the comment
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The created comment
 */
export async function commentOnPost(
  postId: string,
  text: string,
  accountId?: string,
  raw: boolean = false
): Promise<any> {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  if (!text) {
    throw new Error('Comment text is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/posts/${postId}/comments`;
  
  const response = await makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      account_id: id,
      text
    })
  });
  
  // Return raw response if raw is true, otherwise clean and return
  return raw ? response : cleanCommentOnPostResponse(response);
}