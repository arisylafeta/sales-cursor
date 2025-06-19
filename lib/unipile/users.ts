/**
 * Unipile API - LinkedIn Users
 * 
 * This file contains functions for interacting with LinkedIn users via the Unipile API.
 */

import { getBaseUrl, getHeaders, makeRequest, ensureAccountId, PaginatedResponse } from './config';

// Types
export interface LinkedInUserProfile {
  object: string;
  provider: string;
  provider_id: string;
  public_identifier: string;
  member_urn: string;
  first_name: string;
  last_name: string;
  headline: string;
  primary_locale?: {
    country: string;
    language: string;
  };
  is_open_profile: boolean;
  is_premium: boolean;
  is_influencer: boolean;
  is_creator: boolean;
  is_relationship: boolean;
  is_self: boolean;
  websites?: string[];
  follower_count?: number;
  connections_count?: number;
  location?: string;
  contact_info?: {
    emails?: string[];
  };
  profile_picture_url?: string;
  profile_picture_url_large?: string;
  background_picture_url?: string;
}

export interface LinkedInAccountOwnerProfile {
  object: string;
  provider: string;
  provider_id: string;
  entity_urn: string;
  object_urn: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  public_identifier: string;
  occupation: string;
  premium: boolean;
  open_profile: boolean;
  location: string;
  email: string;
  organizations?: Array<{
    id: string;
    mailbox_id: string;
    name: string;
  }>;
  recruiter: any;
  sales_navigator: any;
}

export interface LinkedInUserRelation {
  object: string;
  connection_urn: string;
  created_at: number;
  first_name: string;
  last_name: string;
  member_id: string;
  member_urn: string;
  headline: string;
  public_identifier: string;
  public_profile_url: string;
  profile_picture_url?: string;
}

export interface LinkedInInvitation {
  object: string;
  id: string;
  invited_user: string;
  invited_user_id?: string;
  invited_user_public_id?: string;
  invited_user_description?: string;
  date: string;
  parsed_datetime: string;
  invitation_text?: string;
  inviter?: {
    inviter_name: string;
    inviter_id: string;
    inviter_public_identifier: string;
    inviter_description: string;
  };
  specifics?: {
    provider: string;
    shared_secret?: string;
  };
}

export interface LinkedInSearchResult {
  type: string;
  industry: string | null;
  id: string;
  name: string;
  member_urn: string;
  public_identifier: string;
  profile_url: string;
  public_profile_url: string;
  profile_picture_url?: string;
  profile_picture_url_large?: string;
  network_distance?: string;
  location?: string;
  headline?: string;
  verified?: boolean;
}

export interface LinkedInSearchResponse {
  object: string;
  items: LinkedInSearchResult[];
  config: {
    params: {
      api: string;
      category: string;
      keywords: string;
      account_id: string;
    };
  };
  paging: {
    start: number;
    page_count: number;
    total_count: number;
  };
  cursor: string | null;
}

/**
 * Get the profile of the authenticated LinkedIn user
 * 
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The LinkedIn account owner profile
 */
export async function getAccountOwnerProfile(
  accountId?: string
): Promise<LinkedInAccountOwnerProfile> {
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/users/me?account_id=${id}`;
  
  return makeRequest<LinkedInAccountOwnerProfile>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Get a LinkedIn user's profile by their public identifier
 * 
 * @param identifier - The LinkedIn user's public identifier (e.g., "johndoe")
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The LinkedIn user profile
 */
export async function getUserProfileByIdentifier(
  identifier: string,
  accountId?: string
): Promise<LinkedInUserProfile> {
  if (!identifier) {
    throw new Error('User identifier is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/users/${identifier}?account_id=${id}`;
  
  return makeRequest<LinkedInUserProfile>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Search for LinkedIn users
 * 
 * @param keywords - The search keywords
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param options - Optional search options
 * @returns LinkedIn search results
 */
export async function searchLinkedIn(
  keywords: string,
  accountId?: string,
  options?: {
    api?: 'classic' | 'recruiter' | 'sales_navigator';
    category?: 'people' | 'companies' | 'jobs' | 'groups' | 'schools' | 'content';
    limit?: number;
  }
): Promise<LinkedInSearchResponse> {
  if (!keywords) {
    throw new Error('Search keywords are required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/linkedin/search?account_id=${id}`;
  
  return makeRequest<LinkedInSearchResponse>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      api: options?.api || 'classic',
      category: options?.category || 'people',
      keywords,
      account_id: id,
      limit: options?.limit || 10
    })
  });
}

/**
 * Get the user's LinkedIn connections
 * 
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns The user's LinkedIn connections
 */
export async function getRelations(
  accountId?: string,
  cursor?: string,
  limit?: number
): Promise<PaginatedResponse<LinkedInUserRelation>> {
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/users/relations?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  return makeRequest<PaginatedResponse<LinkedInUserRelation>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Get invitations sent by the user
 * 
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns Invitations sent by the user
 */
export async function getInvitationsSent(
  accountId?: string,
  cursor?: string,
  limit?: number
): Promise<PaginatedResponse<LinkedInInvitation>> {
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/users/invite/sent?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  return makeRequest<PaginatedResponse<LinkedInInvitation>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Get invitations received by the user
 * 
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param cursor - Optional cursor for pagination
 * @param limit - Optional limit for the number of results
 * @returns Invitations received by the user
 */
export async function getInvitationsReceived(
  accountId?: string,
  cursor?: string,
  limit?: number
): Promise<PaginatedResponse<LinkedInInvitation>> {
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  
  let url = `${baseUrl}/api/v1/users/invite/received?account_id=${id}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (limit) url += `&limit=${limit}`;
  
  return makeRequest<PaginatedResponse<LinkedInInvitation>>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Send a LinkedIn connection request
 * 
 * @param recipient - The LinkedIn identifier of the person to invite
 * @param message - Optional message to include with the invitation
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The result of the invitation request
 */
export async function sendInvitation(
  recipient: string,
  message?: string,
  accountId?: string
): Promise<any> {
  if (!recipient) {
    throw new Error('Recipient is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/users/invite`;
  
  const body: any = {
    account_id: id,
    recipient
  };
  
  if (message) {
    body.message = message;
  }
  
  return makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body)
  });
}