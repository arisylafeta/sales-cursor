function personToMarkdown(person: any): string {
  let summary = `### ${person.name}\n`;
  if (person.title) summary += `**Title:** ${person.title}\n`;
  if (person.headline) summary += `**Headline:** ${person.headline}\n`;
  if (person.linkedin_url) summary += `**LinkedIn:** ${person.linkedin_url}\n`;
  if (person.location) summary += `**Location:** ${person.location}\n`;

  if (person.current_organization) {
    summary += `\n**Current Organization:**\n`;
    summary += organizationToMarkdown(person.current_organization, true);
  }

  if (person.employment_history && person.employment_history.length > 0) {
    summary += `\n**Employment History:**\n`;
    person.employment_history.forEach((job: any) => {
      summary += `- **${job.title}** at ${job.organization_name}`;
      if (job.start_date) {
        summary += ` (${job.start_date} - ${job.end_date || "Present"})\n`;
      } else {
        summary += `\n`;
      }
    });
  }

  return summary;
}

function organizationToMarkdown(org: any, isSub: boolean = false): string {
  let summary = "";

  if (isSub) {
    summary += `- **Name:** ${org.name}\n`;
    if (org.website_url) summary += `- **Website:** ${org.website_url}\n`;
    if (org.industry) summary += `- **Industry:** ${org.industry}\n`;
    if (org.employees) summary += `- **Employees:** ${org.employees}\n`;
  } else {
    summary += `### ${org.name}\n`;
    if (org.website_url) summary += `**Website:** ${org.website_url}\n`;
    if (org.linkedin_url) summary += `**LinkedIn:** ${org.linkedin_url}\n`;
    if (org.domain) summary += `**Domain:** ${org.domain}\n`;
    if (org.founded_year) summary += `**Founded:** ${org.founded_year}\n`;
    if (org.revenue) summary += `**Revenue:** ${org.revenue}\n`;
    if (org.employees) summary += `**Employees:** ${org.employees}\n`;
    if (org.industry) summary += `**Industry:** ${org.industry}\n`;
    if (org.latest_funding)
      summary += `**Latest Funding:** ${org.latest_funding}\n`;
    if (org.total_funding)
      summary += `**Total Funding:** ${org.total_funding}\n`;
    if (org.description)
      summary += `\n**Description:**\n${org.description}\n`;
    if (org.keywords && org.keywords.length > 0)
      summary += `\n**Keywords:**\n${org.keywords.join(", ")}\n`;
  }

  return summary;
}

function jobPostingToMarkdown(job: any): string {
  let summary = `### ${job.title}\n`;
  if (job.location) summary += `**Location:** ${job.location}\n`;
  if (job.posted_date) summary += `**Posted:** ${job.posted_date}\n`;
  if (job.url) summary += `**URL:** ${job.url}\n`;
  if (job.content) summary += `\n${job.content}\n`;
  return summary;
}

export function peopleSearchJsonToMarkdown(data: any): string {
  if (!data.people || data.people.length === 0) return "No people found.";
  const summaries = data.people.map(personToMarkdown);
  return `## People Search Results\n\n${summaries.join("\n---\n")}`;
}

export function organizationSearchJsonToMarkdown(data: any): string {
  if (!data.organizations || data.organizations.length === 0)
    return "No organizations found.";
  const summaries = data.organizations.map((org: any) =>
    organizationToMarkdown(org)
  );
  return `## Organization Search Results\n\n${summaries.join("\n---\n")}`;
}

export function organizationJobPostingsJsonToMarkdown(data: any): string {
  if (!data.job_postings || data.job_postings.length === 0)
    return "No job postings found.";
  const summaries = data.job_postings.map(jobPostingToMarkdown);
  return `## Job Postings\n\n${summaries.join("\n---\n")}`;
}

export function peopleEnrichmentJsonToMarkdown(data: any): string {
  if (!data.person) return "No person data found for enrichment.";
  return `## Person Enrichment Result\n\n${personToMarkdown(data.person)}`;
}

export function bulkPeopleEnrichmentJsonToMarkdown(data: any): string {
  if (!data.matches || data.matches.length === 0)
    return "No people found for bulk enrichment.";
  const summaries = data.matches.map(personToMarkdown);
  return `## Bulk People Enrichment Results\n\n${summaries.join("\n---\n")}`;
}

export function organizationEnrichmentJsonToMarkdown(data: any): string {
  if (!data.organization) return "No organization data found for enrichment.";
  return `## Organization Enrichment Result\n\n${organizationToMarkdown(
    data.organization
  )}`;
}

export function bulkOrganizationEnrichmentJsonToMarkdown(data: any): string {
  if (!data.organizations || data.organizations.length === 0)
    return "No organizations found for bulk enrichment.";
  const summaries = data.organizations.map((org: any) =>
    organizationToMarkdown(org)
  );
  return `## Bulk Organization Enrichment Results\n\n${summaries.join(
    "\n---\n"
  )}`;
} 