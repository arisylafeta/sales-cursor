import {
  cleanPeopleSearch,
  cleanOrganizationSearch,
  cleanOrganizationJobPostings,
} from "./cleaners/search";
import { apolloConfig, ApolloError } from "./config";

/**
 * The parameters for the peopleSearch function.
 * @see https://docs.apollo.io/reference/people-search
 */
export interface PeopleSearchParameters {
  /**
   * The name of the person you want to find.
   * A person's name can be split into a first and last name, like "john smith".
   * A person's name can be a "full name" and we will parse out the first and last names.
   * A person's name can be a single name, like "elon".
   */
  q_person_name?: string;

  /**
   * Job titles held by the people you want to find.
   * For a person to be included in search results, they only need to match 1 of the job titles you add.
   * Adding more job titles expands your search results.
   */
  person_titles?: string[];

  /**
   * This parameter determines whether people with job titles similar to the titles you define in the person_titles[] parameter are returned in the response.
   * Set this parameter to false when using person_titles[] to return only strict matches for job titles.
   * @default true
   */
  include_similar_titles?: boolean;

  /**
   * The location where people live. You can search across cities, US states, and countries.
   */
  person_locations?: string[];

  /**
   * The job seniority that people hold within their current employer.
   */
  person_seniorities?: string[];

  /**
   * The location of the company headquarters for a person's current employer.
   */
  organization_locations?: string[];

  /**
   * The domain name for the person's employer. This can be the current employer or a previous employer.
   * Do not include www., the @ symbol, or similar.
   * This parameter accepts up to 1,000 domains in a single request.
   */
  q_organization_domains_list?: string[];

  /**
   * The email statuses for the people you want to find.
   * You can add multiple statuses to expand your search.
   * Options: "verified", "unverified", "likely to engage", "unavailable"
   */
  contact_email_status?: string[];

  /**
   * The Apollo IDs for the companies (employers) you want to include in your search results.
   */
  organization_ids?: string[];

  /**
   * The number range of employees working for the person's current company.
   * Each range you add needs to be a string, with the upper and lower numbers of the range separated only by a comma.
   * e.g., ["1,10", "250,500", "10000,20000"]
   */
  organization_num_employees_ranges?: string[];

  /**
   * A string of words over which we want to filter the results.
   */
  q_keywords?: string;

  /**
   * The page number of the Apollo data that you want to retrieve.
   * @default 1
   */
  page?: number;

  /**
   * The number of search results that should be returned for each page.
   * @default 10
   */
  per_page?: number;

  /**
   * Whether to return the raw API response.
   */
  raw?: boolean;
}

/**
 * Searches for people in the Apollo database.
 * @see https://docs.apollo.io/reference/people-search
 * @param params The search parameters.
 * @returns The search results.
 */
export async function peopleSearch(params: PeopleSearchParameters) {
  const { apiKey, endpoint } = apolloConfig;
  const { raw, ...searchParams } = params;

  const response = await fetch(`${endpoint}/v1/mixed_people/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      api_key: apiKey,
      ...searchParams,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApolloError(
      response.status,
      errorBody,
      "Failed to fetch people search results"
    );
  }

  const rawData = await response.json();
  if (raw) {
    return rawData;
  }
  return cleanPeopleSearch(rawData);
}

/**
 * The parameters for the organizationSearch function.
 * This is not an exhaustive list.
 * @see https://docs.apollo.io/reference/organization-search
 */
export interface OrganizationSearchParameters {
  /**
   * The name of the organization you want to find.
   */
  q_organization_name?: string;

  /**
   * The location of the company headquarters.
   */
  organization_locations?: string[];

  /**
   * The domain name for the organization.
   */
  q_organization_domains?: string[];

  /**
   * The number range of employees working for the organization.
   * e.g., ["1,10", "250,500", "10000,20000"]
   */
  organization_num_employees_ranges?: string[];

  /**
   * The industries of the organization.
   */
  organization_industries?: string[];

  /**
   * The page number of the Apollo data that you want to retrieve.
   * @default 1
   */
  page?: number;

  /**
   * The number of search results that should be returned for each page.
   * @default 10
   */
  per_page?: number;

  /**
   * Whether to return the raw API response.
   */
  raw?: boolean;
}

/**
 * Searches for organizations in the Apollo database.
 * @see https://docs.apollo.io/reference/organization-search
 * @param params The search parameters.
 * @returns The search results.
 */
export async function organizationSearch(params: OrganizationSearchParameters) {
  const { apiKey, endpoint } = apolloConfig;
  const { raw, ...searchParams } = params;

  const response = await fetch(`${endpoint}/v1/mixed_companies/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      api_key: apiKey,
      ...searchParams,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApolloError(
      response.status,
      errorBody,
      "Failed to fetch organization search results"
    );
  }

  const rawData = await response.json();
  if (raw) {
    return rawData;
  }
  return cleanOrganizationSearch(rawData);
}

/**
 * The parameters for the organizationJobPostings function.
 * @see https://docs.apollo.io/reference/organization-job-postings
 */
export interface OrganizationJobPostingsParameters {
  /**
   * The Apollo ID for the company.
   */
  organization_id: string;

  /**
   * The page number of the Apollo data that you want to retrieve.
   * @default 1
   */
  page?: number;

  /**
   * The number of search results that should be returned for each page.
   * @default 10
   */
  per_page?: number;

  /**
   * Whether to return the raw API response.
   */
  raw?: boolean;
}

/**
 * Retrieves the current job postings for a company.
 * @see https://docs.apollo.io/reference/organization-job-postings
 * @param params The parameters.
 * @returns The job postings.
 */
export async function organizationJobPostings(
  params: OrganizationJobPostingsParameters
) {
  const { apiKey, endpoint } = apolloConfig;
  const { organization_id, page = 1, per_page = 10, raw } = params;

  const url = new URL(
    `${endpoint}/v1/organizations/${organization_id}/job_postings`
  );
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("per_page", per_page.toString());

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
      "Failed to fetch organization job postings"
    );
  }

  const rawData = await response.json();
  if (raw) {
    return rawData;
  }
  return cleanOrganizationJobPostings(rawData);
} 