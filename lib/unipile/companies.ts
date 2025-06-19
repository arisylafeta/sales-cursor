/**
 * Unipile API - LinkedIn Companies
 * 
 * This file contains functions for interacting with LinkedIn companies via the Unipile API.
 */

import { getBaseUrl, getHeaders, makeRequest, ensureAccountId } from './config';

// Types
export interface LinkedInCompanyLocation {
  is_headquarter: boolean;
  city: string;
  country: string;
  street: string[];
  postalCode?: string;
  area?: string;
}

export interface LinkedInCompany {
  object: string;
  provider: string;
  provider_id: string;
  entity_urn: string;
  name: string;
  description?: string;
  founded_year?: number;
  locations: LinkedInCompanyLocation[];
  messaging?: {
    is_enabled: boolean;
    entity_urn: string;
    id: string;
  };
  activities?: string[];
  website?: string;
  employee_count?: number;
  employee_count_range?: {
    from: number;
    to: number | null;
  };
  industry?: string[];
  logo?: string;
  logo_large?: string;
}

/**
 * Get details about a LinkedIn company
 * 
 * @param identifier - The LinkedIn company identifier (e.g., "linkedin")
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The LinkedIn company profile
 */
export async function getCompanyProfile(
  identifier: string,
  accountId?: string
): Promise<LinkedInCompany> {
  if (!identifier) {
    throw new Error('Company identifier is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/linkedin/company/${identifier}?account_id=${id}`;
  
  return makeRequest<LinkedInCompany>(url, {
    method: 'GET',
    headers: getHeaders()
  });
}

/**
 * Search for LinkedIn companies
 * 
 * @param keywords - The search keywords
 * @param accountId - Optional account ID (will use env var if not provided)
 * @param limit - Optional limit for the number of results
 * @returns LinkedIn company search results
 */
export async function searchCompanies(
  keywords: string,
  accountId?: string,
  limit?: number
): Promise<any> {
  if (!keywords) {
    throw new Error('Search keywords are required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/linkedin/search?account_id=${id}`;
  
  return makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      api: 'classic',
      category: 'companies',
      keywords,
      account_id: id,
      limit: limit || 10
    })
  });
}

/**
 * Follow a LinkedIn company
 * 
 * @param companyId - The LinkedIn company ID
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The result of the follow request
 */
export async function followCompany(
  companyId: string,
  accountId?: string
): Promise<any> {
  if (!companyId) {
    throw new Error('Company ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/linkedin/company/${companyId}/follow`;
  
  return makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      account_id: id
    })
  });
}

/**
 * Unfollow a LinkedIn company
 * 
 * @param companyId - The LinkedIn company ID
 * @param accountId - Optional account ID (will use env var if not provided)
 * @returns The result of the unfollow request
 */
export async function unfollowCompany(
  companyId: string,
  accountId?: string
): Promise<any> {
  if (!companyId) {
    throw new Error('Company ID is required');
  }
  
  const id = ensureAccountId(accountId);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/v1/linkedin/company/${companyId}/unfollow`;
  
  return makeRequest<any>(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      account_id: id
    })
  });
}