/**
 * Unipile API Configuration
 * 
 * This file contains the configuration for the Unipile API client.
 */

// Environment variables
export const UNIPILE_DSN = process.env.UNIPILE_DNS || '';
export const UNIPILE_API_KEY = process.env.UNIPILE_API_KEY || '';
export const UNIPILE_ACCOUNT_ID = process.env.UNIPILE_ACCOUNT_ID || '';

// Base URL
export const getBaseUrl = (): string => {
  if (!UNIPILE_DSN) {
    throw new Error('UNIPILE_DNS environment variable is not set');
  }
  return UNIPILE_DSN.startsWith('http') ? UNIPILE_DSN : `https://${UNIPILE_DSN}`;
};

// Common request headers
export const getHeaders = (): Record<string, string> => {
  if (!UNIPILE_API_KEY) {
    throw new Error('UNIPILE_API_KEY environment variable is not set');
  }
  
  return {
    'accept': 'application/json',
    'content-type': 'application/json',
    'X-API-KEY': UNIPILE_API_KEY
  };
};

// Error handling
export class UnipileError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string, message?: string) {
    super(message || `Unipile API error: ${status}`);
    this.status = status;
    this.body = body;
    this.name = 'UnipileError';
  }
}

// Helper function to make API requests
export async function makeRequest<T>(
  url: string, 
  options: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new UnipileError(response.status, errorText);
    }
    
    return await response.json() as T;
  } catch (error) {
    if (error instanceof UnipileError) {
      throw error;
    }
    
    throw new Error(`Failed to make request: ${(error as Error).message}`);
  }
}

// Types
export interface PaginatedResponse<T> {
  items: T[];
  cursor?: string;
  object?: string;
}

export interface AccountInfo {
  id: string;
  provider: string;
  [key: string]: any;
}

// Helper function to ensure account_id is provided
export function ensureAccountId(accountId?: string): string {
  const id = accountId || UNIPILE_ACCOUNT_ID;
  if (!id) {
    throw new Error('Account ID is required but not provided');
  }
  return id;
}