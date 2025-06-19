# Unipile API Client for LinkedIn

This library provides a robust and type-safe client for interacting with LinkedIn via the Unipile API. It includes functions for working with LinkedIn users, posts, messages, and companies.

## Setup

1. Set the following environment variables in your `.env.local` file:

```
UNIPILE_DNS=your_unipile_dsn_here
UNIPILE_API_KEY=your_api_key_here
UNIPILE_ACCOUNT_ID=your_account_id_here
```

2. Import the functions you need:

```typescript
import { getUserProfileByIdentifier, searchLinkedIn } from '@/lib/unipile';
```

## Features

### User-related Functions

- `getAccountOwnerProfile`: Get the profile of the authenticated LinkedIn user
- `getUserProfileByIdentifier`: Get a LinkedIn user's profile by their public identifier
- `searchLinkedIn`: Search for LinkedIn users
- `getRelations`: Get the user's LinkedIn connections
- `getInvitationsSent`: Get invitations sent by the user
- `getInvitationsReceived`: Get invitations received by the user
- `sendInvitation`: Send a LinkedIn connection request

### Post-related Functions

- `getUserPosts`: Get posts from a specific LinkedIn user
- `getUserComments`: Get comments from a specific LinkedIn user
- `createPost`: Create a new LinkedIn post
- `getPost`: Get a specific LinkedIn post
- `getPostComments`: Get comments on a specific LinkedIn post
- `commentOnPost`: Comment on a LinkedIn post

### Message-related Functions

- `getChats`: Get the user's LinkedIn conversations
- `getChatMessages`: Get messages from a specific LinkedIn chat
- `sendMessage`: Send a message in a LinkedIn chat
- `createChat`: Create a new chat with a LinkedIn user
- `sendInMail`: Send an InMail to a LinkedIn user

### Company-related Functions

- `getCompanyProfile`: Get details about a LinkedIn company
- `searchCompanies`: Search for LinkedIn companies
- `followCompany`: Follow a LinkedIn company
- `unfollowCompany`: Unfollow a LinkedIn company

## AI Chatbot Integration

The Unipile API client is integrated with the AI chatbot via the following tools:

- `getLinkedInProfile`: Get a LinkedIn user profile by their public identifier
- `searchLinkedInUsers`: Search for LinkedIn users by keywords
- `getLinkedInPosts`: Get LinkedIn posts from a specific user
- `getLinkedInCompany`: Get details about a LinkedIn company
- `searchLinkedInCompanies`: Search for LinkedIn companies by keywords

These tools are available to the AI chatbot and can be used to retrieve LinkedIn data during conversations.

## Example Usage

```typescript
import { getUserProfileByIdentifier, searchLinkedIn } from '@/lib/unipile';

// Get a LinkedIn user's profile
const profile = await getUserProfileByIdentifier('johndoe');
console.log(profile);

// Search for LinkedIn users
const searchResults = await searchLinkedIn('John Doe');
console.log(searchResults);
```

See the `example.ts` file for more examples.

## Error Handling

All functions include robust error handling and will throw descriptive errors if something goes wrong. You can catch these errors and handle them appropriately:

```typescript
try {
  const profile = await getUserProfileByIdentifier('johndoe');
  console.log(profile);
} catch (error) {
  console.error('Failed to get LinkedIn profile:', error);
}
```

## Pagination

Many functions support pagination via cursor and limit parameters:

```typescript
// Get the first page of results
const firstPage = await getRelations(undefined, undefined, 10);

// Get the next page of results
if (firstPage.cursor) {
  const nextPage = await getRelations(undefined, firstPage.cursor, 10);
}
```