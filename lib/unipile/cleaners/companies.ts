/**
 * Unipile API - LinkedIn Companies Response Cleaners
 * 
 * This file contains functions for cleaning and formatting LinkedIn company responses
 * from the Unipile API to make them suitable for feeding to an LLM.
 */

import type { LinkedInCompany } from '../companies';

/**
 * Clean and format a company profile response
 * 
 * @param companyProfile - The raw company profile response from the API
 * @returns A cleaned and formatted company profile
 */
export function cleanCompanyProfile(companyProfile: any): any {
  if (!companyProfile) return null;

  return {
    id: companyProfile.id,
    entityUrn: companyProfile.entity_urn,
    name: companyProfile.name,
    description: companyProfile.description,
    publicIdentifier: companyProfile.public_identifier,
    industry: companyProfile.industry || [],
    website: companyProfile.website,
    employeeCount: companyProfile.employee_count,
    employeeCountRange: companyProfile.employee_count_range,
    foundedYear: companyProfile.founded_year,
    headquarters: companyProfile.locations?.find((loc: any) => loc.is_headquarter) || null,
    locations: companyProfile.locations?.map((loc: any) => ({
      city: loc.city,
      country: loc.country,
      isHeadquarter: loc.is_headquarter
    })) || [],
    hashtags: companyProfile.hashtags?.map((tag: any) => tag.title) || [],
    logoUrl: companyProfile.logo_large || companyProfile.logo,
    profileUrl: companyProfile.profile_url,
    followersCount: companyProfile.follower_count
  };
}

/**
 * Clean and format company search results
 * 
 * @param searchResults - The raw company search results from the API
 * @returns Cleaned and formatted company search results
 */
export function cleanCompanySearchResults(searchResults: any): any {
  if (!searchResults || !searchResults.items) return { companies: [] };

  return {
    companies: searchResults.items.map((company: any) => ({
      name: company.name,
      description: company.description || company.summary,
      industry: company.industry || [],
      location: company.location,
      logoUrl: company.logo_large || company.logo,
      profileUrl: company.profile_url,
      publicIdentifier: company.public_identifier,
      id: company.id,
      followersCount: company.followers_count,
      jobOffersCount: company.job_offers_count
    })),
    paging: searchResults.paging,
    cursor: searchResults.cursor
  };
}