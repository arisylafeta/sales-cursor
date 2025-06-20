# Unipile API Response Cleaners

This directory contains functions for cleaning and formatting Unipile API responses to make them suitable for feeding to an LLM.

## Purpose

The cleaner functions extract the most important data from API responses and format it in a way that's more concise and relevant for LLM consumption. This helps to:

1. Reduce token usage when feeding data to an LLM
2. Focus on the most relevant information
3. Standardize the format of data across different API endpoints
4. Remove unnecessary metadata and technical details

## Structure

The cleaners are organized by API category:

- `companies.ts` - Cleaners for LinkedIn company-related API responses
- `users.ts` - Cleaners for LinkedIn user-related API responses
- `posts.ts` - Cleaners for LinkedIn post-related API responses
- `messages.ts` - Cleaners for LinkedIn message-related API responses

## Usage

The cleaners are automatically used in the Unipile API functions. Each API function:

1. Makes the API request
2. Passes the response to the appropriate cleaner function
3. Returns the original response (the cleaned response is available for LLM consumption)

## Example

```typescript
// Original API function
export async function getCompanyProfile(identifier: string, accountId?: string): Promise<LinkedInCompany> {
  // ... API request logic ...
  
  const response = await makeRequest<LinkedInCompany>(url, {
    method: 'GET',
    headers: getHeaders()
  });
  
  // Clean the response for LLM consumption
  const cleanedResponse = cleanCompanyProfile(response);
  
  return response;
}
```

To access the cleaned response for LLM consumption, you can call the cleaner function directly:

```typescript
const response = await getCompanyProfile('linkedin');
const cleanedResponse = cleanCompanyProfile(response);

// Now you can feed cleanedResponse to an LLM
```