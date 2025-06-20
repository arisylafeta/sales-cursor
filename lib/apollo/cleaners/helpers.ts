export function cleanPerson(person: any): any {
  const {
    name,
    title,
    headline,
    linkedin_url,
    city,
    state,
    country,
    organization,
    employment_history,
  } = person;

  const cleaned_person: any = {
    name,
    title,
    headline,
    linkedin_url,
    location:
      city && state && country ? `${city}, ${state}, ${country}` : undefined,
    current_organization: organization
      ? cleanOrganization(organization)
      : undefined,
    employment_history: employment_history?.map((job: any) => {
      const cleaned_job: any = {
        title: job.title,
        organization_name: job.organization_name,
        start_date: job.start_date,
        end_date: job.end_date || "Present",
      };
      Object.keys(cleaned_job).forEach(
        (key) => cleaned_job[key] == null && delete cleaned_job[key]
      );
      return cleaned_job;
    }),
  };

  // remove null/undefined fields
  Object.keys(cleaned_person).forEach(
    (key) => (cleaned_person[key] == null) && delete cleaned_person[key]
  );

  return cleaned_person;
}

export function cleanOrganization(org: any): any {
  const {
    name,
    website_url,
    linkedin_url,
    primary_domain,
    founded_year,
    annual_revenue_printed, // from enrichment
    organization_revenue_printed, // from search
    estimated_num_employees,
    industry,
    keywords,
    short_description,
    total_funding_printed,
    latest_funding_stage,
  } = org;

  const cleaned_org: any = {
    name,
    website_url,
    linkedin_url,
    domain: primary_domain,
    founded_year,
    revenue: annual_revenue_printed || organization_revenue_printed,
    employees: estimated_num_employees,
    industry,
    latest_funding: latest_funding_stage,
    total_funding: total_funding_printed,
    description: short_description,
    keywords: keywords?.slice(0, 10),
  };

  // remove null/undefined fields
  Object.keys(cleaned_org).forEach(
    (key) => (cleaned_org[key] == null) && delete cleaned_org[key]
  );

  return cleaned_org;
} 