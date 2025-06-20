/**
 * This file contains functions to clean and format the raw data from the Apollo API
 * into a more readable and LLM-friendly format.
 */

import { cleanPerson, cleanOrganization } from "./helpers";

/**
 * Cleans the response from the peopleEnrichment API call.
 * @param response The raw JSON response from the peopleEnrichment API.
 * @returns A formatted string summarizing the enriched person data.
 */
export function cleanPeopleEnrichment(response: any): any {
  if (!response || !response.person) {
    return { person: null };
  }
  return {
    person: cleanPerson(response.person),
  };
}

/**
 * Cleans the response from the bulkPeopleEnrichment API call.
 * @param response The raw JSON response from the bulkPeopleEnrichment API.
 * @returns A formatted string summarizing the enriched people data.
 */
export function cleanBulkPeopleEnrichment(response: any): any {
  if (!response || !response.matches || response.matches.length === 0) {
    return { matches: [] };
  }
  return {
    matches: response.matches.map(cleanPerson),
  };
}

/**
 * Cleans the response from the organizationEnrichment API call.
 * @param response The raw JSON response from the organizationEnrichment API.
 * @returns A formatted string summarizing the enriched organization data.
 */
export function cleanOrganizationEnrichment(response: any): any {
  if (!response || !response.organization) {
    return { organization: null };
  }
  return {
    organization: cleanOrganization(response.organization),
  };
}

/**
 * Cleans the response from the bulkOrganizationEnrichment API call.
 * @param response The raw JSON response from the bulkOrganizationEnrichment API.
 * @returns A formatted string summarizing the enriched organizations data.
 */
export function cleanBulkOrganizationEnrichment(response: any): any {
  if (
    !response ||
    !response.organizations ||
    response.organizations.length === 0
  ) {
    return { organizations: [] };
  }
  return {
    organizations: response.organizations.map(cleanOrganization),
  };
} 