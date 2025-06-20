/**
 * This file contains functions to clean and format the raw data from the Apollo API
 * into a more readable and LLM-friendly format.
 */

import { cleanPerson, cleanOrganization } from "./helpers";

/**
 * Cleans the response from the peopleSearch API call.
 * @param response The raw JSON response from the peopleSearch API.
 * @returns A formatted string summarizing the people found.
 */
export function cleanPeopleSearch(response: any): any {
  if (!response || !response.people || response.people.length === 0) {
    return { people: [] };
  }
  return {
    people: response.people.map(cleanPerson),
  };
}

/**
 * Cleans the response from the organizationSearch API call.
 * @param response The raw JSON response from the organizationSearch API.
 * @returns A formatted string summarizing the organizations found.
 */
export function cleanOrganizationSearch(response: any): any {
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

/**
 * Cleans the response from the organizationJobPostings API call.
 * @param response The raw JSON response from the organizationJobPostings API.
 * @returns A formatted string summarizing the job postings found.
 */
export function cleanOrganizationJobPostings(response: any): any {
  if (
    !response ||
    !response.organization_job_postings ||
    response.organization_job_postings.length === 0
  ) {
    return { job_postings: [] };
  }

  const cleaned_jobs = response.organization_job_postings.map((job: any) => {
    const { title, url, location, content, posted_date } = job;
    const cleaned_job: any = {
      title,
      url,
      location,
      content,
      posted_date,
    };
    Object.keys(cleaned_job).forEach(
      (key) => cleaned_job[key] == null && delete cleaned_job[key]
    );
    return cleaned_job;
  });

  return { job_postings: cleaned_jobs };
} 