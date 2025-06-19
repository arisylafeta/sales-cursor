/**
 * Unipile Tool for AI Chatbot
 * 
 * This file provides tools for the AI chatbot to interact with LinkedIn via the Unipile API.
 */

import { z } from 'zod';

import * as unipile from '../../lib/unipile';

/**
 * Tool to get a LinkedIn user's profile
 */
export const getLinkedInProfile = {
  name: 'getLinkedInProfile',
  description: 'Get a LinkedIn user profile by their public identifier',
  parameters: z.object({
    identifier: z.string().describe('The LinkedIn user\'s public identifier (e.g., "johndoe")'),
  }),
  execute: async ({ identifier }: { identifier: string }) => {
    try {
      const profile = await unipile.getUserProfileByIdentifier(identifier);
      return profile;
    } catch (error) {
      return { error: `Failed to get LinkedIn profile: ${(error as Error).message}` };
    }
  },
};

/**
 * Tool to search for LinkedIn users
 */
export const searchLinkedInUsers = {
  name: 'searchLinkedInUsers',
  description: 'Search for LinkedIn users by keywords',
  parameters: z.object({
    keywords: z.string().describe('The search keywords'),
    limit: z.number().optional().describe('Maximum number of results to return'),
  }),
  execute: async ({ keywords, limit }: { keywords: string; limit?: number }) => {
    try {
      const results = await unipile.searchLinkedIn(keywords, undefined, {
        category: 'people',
        limit: limit || 5,
      });
      return results;
    } catch (error) {
      return { error: `Failed to search LinkedIn users: ${(error as Error).message}` };
    }
  },
};

/**
 * Tool to get LinkedIn posts from a user
 */
export const getLinkedInPosts = {
  name: 'getLinkedInPosts',
  description: 'Get LinkedIn posts from a specific user',
  parameters: z.object({
    identifier: z.string().describe('The LinkedIn user\'s public identifier (e.g., "johndoe")'),
    limit: z.number().optional().describe('Maximum number of posts to return'),
  }),
  execute: async ({ identifier, limit }: { identifier: string; limit?: number }) => {
    try {
      // First, get the user's profile to get their provider ID
      const profile = await unipile.getUserProfileByIdentifier(identifier);
      
      // Then, get their posts
      const posts = await unipile.getUserPosts(profile.provider_id, undefined, undefined, limit);
      return posts;
    } catch (error) {
      return { error: `Failed to get LinkedIn posts: ${(error as Error).message}` };
    }
  },
};

/**
 * Tool to get a LinkedIn company profile
 */
export const getLinkedInCompany = {
  name: 'getLinkedInCompany',
  description: 'Get details about a LinkedIn company',
  parameters: z.object({
    identifier: z.string().describe('The LinkedIn company identifier (e.g., "linkedin")'),
  }),
  execute: async ({ identifier }: { identifier: string }) => {
    try {
      const company = await unipile.getCompanyProfile(identifier);
      return company;
    } catch (error) {
      return { error: `Failed to get LinkedIn company: ${(error as Error).message}` };
    }
  },
};

/**
 * Tool to search for LinkedIn companies
 */
export const searchLinkedInCompanies = {
  name: 'searchLinkedInCompanies',
  description: 'Search for LinkedIn companies by keywords',
  parameters: z.object({
    keywords: z.string().describe('The search keywords'),
    limit: z.number().optional().describe('Maximum number of results to return'),
  }),
  execute: async ({ keywords, limit }: { keywords: string; limit?: number }) => {
    try {
      const results = await unipile.searchCompanies(keywords, undefined, limit);
      return results;
    } catch (error) {
      return { error: `Failed to search LinkedIn companies: ${(error as Error).message}` };
    }
  },
};

// Export all tools
export const unipileTools = [
  getLinkedInProfile,
  searchLinkedInUsers,
  getLinkedInPosts,
  getLinkedInCompany,
  searchLinkedInCompanies,
];