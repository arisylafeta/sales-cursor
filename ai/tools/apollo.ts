import { tool } from 'ai';
import { z } from 'zod';

import {
  bulkPeopleEnrichment,
  organizationEnrichment,
  peopleEnrichment,
} from '@/lib/apollo/enrich';
import {
  organizationJobPostings,
  organizationSearch,
  peopleSearch,
} from '@/lib/apollo/search';

const peopleSearchSchema = z.object({
  q_person_name: z.string().optional().describe("The person's name."),
  person_titles: z
    .array(z.string())
    .optional()
    .describe('Job titles. Only one needs to match.'),
  include_similar_titles: z
    .boolean()
    .optional()
    .describe('Whether to include people with similar job titles. Defaults to true.'),
  person_locations: z
    .array(z.string())
    .optional()
    .describe('Cities, US states, and countries where people live.'),
  person_seniorities: z
    .array(z.string())
    .optional()
    .describe("Job seniority, e.g., 'senior', 'manager', 'executive'."),
  organization_locations: z
    .array(z.string())
    .optional()
    .describe("Headquarters location of the person's employer."),
  q_organization_domains_list: z
    .array(z.string())
    .optional()
    .describe("Employer's domain name (current or previous)."),
  contact_email_status: z
    .array(z.string())
    .optional()
    .describe('Email statuses: "verified", "unverified", "likely to engage", "unavailable".'),
  organization_ids: z
    .array(z.string())
    .optional()
    .describe('Apollo IDs for employers.'),
  organization_num_employees_ranges: z
    .array(z.string())
    .optional()
    .describe('Number of employees, e.g., ["1,10", "10000,20000"].'),
  q_keywords: z.string().optional().describe('Keywords to filter results.'),
  page: z.number().optional().describe('Page number of results. Defaults to 1.'),
  per_page: z
    .number()
    .optional()
    .describe('Results per page. Defaults to 10.'),
});

const organizationSearchSchema = z.object({
  q_organization_name: z
    .string()
    .optional()
    .describe('The name of the organization.'),
  organization_locations: z
    .array(z.string())
    .optional()
    .describe('Headquarters location.'),
  q_organization_domains: z
    .array(z.string())
    .optional()
    .describe('Domain names of the organization.'),
  organization_num_employees_ranges: z
    .array(z.string())
    .optional()
    .describe('Number of employees, e.g., ["1,10", "10000,20000"].'),
  organization_industries: z
    .array(z.string())
    .optional()
    .describe('Industries of the organization.'),
  page: z.number().optional().describe('Page number of results. Defaults to 1.'),
  per_page: z
    .number()
    .optional()
    .describe('Results per page. Defaults to 10.'),
});

const organizationJobPostingsSchema = z.object({
  organization_id: z.string().describe('The Apollo ID for the company.'),
  page: z.number().optional().describe('Page number of results. Defaults to 1.'),
  per_page: z
    .number()
    .optional()
    .describe('Results per page. Defaults to 10.'),
});

const peopleEnrichmentSchema = z.object({
  first_name: z.string().optional().describe("The person's first name."),
  last_name: z.string().optional().describe("The person's last name."),
  name: z.string().optional().describe("The person's full name."),
  domain: z
    .string()
    .optional()
    .describe("The domain name of the person's current employer."),
  email: z.string().optional().describe("The person's email address."),
  linkedin_url: z.string().optional().describe("The person's LinkedIn URL."),
  reveal_personal_emails: z
    .boolean()
    .optional()
    .describe('Whether to reveal personal emails. Defaults to false.'),
  reveal_phone_number: z
    .boolean()
    .optional()
    .describe('Whether to reveal phone numbers. Defaults to false.'),
});

const organizationEnrichmentSchema = z.object({
  domain: z.string().describe('The domain name of the organization to enrich.'),
});

export const apolloTools = {
  peopleSearch: tool({
    description: 'Search for people in the Apollo database.',
    parameters: peopleSearchSchema,
    execute: async (params) => peopleSearch(params),
  }),
  organizationSearch: tool({
    description: 'Search for organizations in the Apollo database.',
    parameters: organizationSearchSchema,
    execute: async (params) => organizationSearch(params),
  }),
  organizationJobPostings: tool({
    description: "Get an organization's job postings from the Apollo database.",
    parameters: organizationJobPostingsSchema,
    execute: async (params) => organizationJobPostings(params),
  }),
  peopleEnrichment: tool({
    description: 'Enrich data for a single person from Apollo.',
    parameters: peopleEnrichmentSchema,
    execute: async (params) => peopleEnrichment(params),
  }),
  bulkPeopleEnrichment: tool({
    description:
      'Enrich data for up to 10 people in a single API call from Apollo.',
    parameters: z.object({
      details: z
        .array(peopleEnrichmentSchema)
        .describe('An array of person details to enrich.'),
    }),
    execute: async (params) => bulkPeopleEnrichment(params),
  }),
  organizationEnrichment: tool({
    description: 'Enrich data for a single organization from Apollo.',
    parameters: organizationEnrichmentSchema,
    execute: async (params) => organizationEnrichment(params),
  }),
}; 