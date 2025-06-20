import {
  cleanPeopleEnrichment,
  cleanBulkPeopleEnrichment,
  cleanOrganizationEnrichment,
  cleanBulkOrganizationEnrichment,
} from "./cleaners/enrich";
import { apolloConfig, ApolloError } from "./config";

/**
 * The parameters for the peopleEnrichment function.
 * @see https://docs.apollo.io/reference/people-enrichment
 */
export interface PeopleEnrichmentParameters {
  /**
   * The person's first name.
   */
  first_name?: string;

  /**
   * The person's last name.
   */
  last_name?: string;

  /**
   * The person's full name.
   */
  name?: string;

  /**
   * The domain name of the person's current employer.
   */
  domain?: string;

  /**
   * The email address of the person.
   */
  email?: string;

  /**
   * The LinkedIn profile URL of the person.
   */
  linkedin_url?: string;

  /**
   * Whether to reveal personal emails.
   * @default false
   */
  reveal_personal_emails?: boolean;

  /**
   * Whether to reveal phone numbers.
   * @default false
   */
  reveal_phone_number?: boolean;

  /**
   * Whether to return the raw API response.
   */
  raw?: boolean;
}

/**
 * Enriches data for a single person.
 * @see https://docs.apollo.io/reference/people-enrichment
 * @param params The parameters to identify the person.
 * @returns The enriched person data.
 */
export async function peopleEnrichment(params: PeopleEnrichmentParameters) {
  const { apiKey, endpoint } = apolloConfig;
  const { raw, ...enrichParams } = params;

  const response = await fetch(`${endpoint}/v1/people/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      api_key: apiKey,
      ...enrichParams,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApolloError(
      response.status,
      errorBody,
      "Failed to fetch person enrichment data"
    );
  }

  const rawData = await response.json();
  if (raw) {
    return rawData;
  }
  return cleanPeopleEnrichment(rawData);
}

/**
 * The parameters for the bulkPeopleEnrichment function.
 * @see https://docs.apollo.io/reference/bulk-people-enrichment
 */
export interface BulkPeopleEnrichmentParameters {
  /**
   * An array of person details to enrich.
   * Each object should conform to the PeopleEnrichmentParameters interface.
   */
  details: PeopleEnrichmentParameters[];

  /**
   * Whether to reveal personal emails for all people in the request.
   * @default false
   */
  reveal_personal_emails?: boolean;

  /**
   * Whether to reveal phone numbers for all people in the request.
   * @default false
   */
  reveal_phone_number?: boolean;

  /**
   * Whether to return the raw API response.
   */
  raw?: boolean;
}

/**
 * Enriches data for up to 10 people in a single API call.
 * @see https://docs.apollo.io/reference/bulk-people-enrichment
 * @param params The parameters for bulk enrichment.
 * @returns The enriched data for the people.
 */
export async function bulkPeopleEnrichment(
  params: BulkPeopleEnrichmentParameters
) {
  const { apiKey, endpoint } = apolloConfig;
  const { ...enrichParams } = params;

  const response = await fetch(`${endpoint}/v1/people/bulk_match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      api_key: apiKey,
      ...enrichParams,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApolloError(
      response.status,
      errorBody,
      "Failed to fetch bulk person enrichment data"
    );
  }

  const rawData = await response.json();
  if (params.raw) {
    return rawData;
  }
  return cleanBulkPeopleEnrichment(rawData);
}

/**
 * The parameters for the organizationEnrichment function.
 * @see https://docs.apollo.io/reference/organization-enrichment
 */
export interface OrganizationEnrichmentParameters {
  /**
   * The domain name of the organization to enrich.
   */
  domain: string;

  /**
   * Whether to return the raw API response.
   */
  raw?: boolean;
}

/**
 * Enriches data for a single organization.
 * @see https://docs.apollo.io/reference/organization-enrichment
 * @param params The parameters to identify the organization.
 * @returns The enriched organization data.
 */
export async function organizationEnrichment(
  params: OrganizationEnrichmentParameters
) {
  const { apiKey, endpoint } = apolloConfig;
  const { domain, raw } = params;

  const url = new URL(`${endpoint}/v1/organizations/enrich`);
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("domain", domain);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApolloError(
      response.status,
      errorBody,
      "Failed to fetch organization enrichment data"
    );
  }

  const rawData = await response.json();
  if (raw) {
    return rawData;
  }
  return cleanOrganizationEnrichment(rawData);
}

/**
 * The parameters for the bulkOrganizationEnrichment function.
 * @see https://docs.apollo.io/reference/bulk-organization-enrichment
 */
export interface BulkOrganizationEnrichmentParameters {
  /**
   * An array of domain names to enrich.
   */
  domains: string[];

  /**
   * Whether to return the raw API response.
   */
  raw?: boolean;
}

/**
 * Enriches data for up to 10 organizations in a single API call.
 * @see https://docs.apollo.io/reference/bulk-organization-enrichment
 * @param params The parameters for bulk enrichment.
 * @returns The enriched data for the organizations.
 */
export async function bulkOrganizationEnrichment(
  params: BulkOrganizationEnrichmentParameters
) {
  const { apiKey, endpoint } = apolloConfig;
  const { domains, raw } = params;

  const response = await fetch(`${endpoint}/v1/organizations/bulk_enrich`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      api_key: apiKey,
      domains,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApolloError(
      response.status,
      errorBody,
      "Failed to fetch bulk organization enrichment data"
    );
  }

  const rawData = await response.json();
  if (raw) {
    return rawData;
  }
  return cleanBulkOrganizationEnrichment(rawData);
} 