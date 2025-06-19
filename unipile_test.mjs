import dotenv from 'dotenv';
import { UnipileClient } from 'unipile-node-sdk';

dotenv.config({ path: '.env.local' });

async function main() {
  const unipileDsn = process.env.UNIPILE_DNS;
  const unipileApiKey = process.env.UNIPILE_API_KEY;

  if (!unipileDsn || !unipileApiKey) {
    console.error('Error: UNIPILE_DNS and UNIPILE_API_KEY must be set in your .env file.');
    process.exit(1);
  }
  
  // The SDK might still be useful for other calls.
  const client = new UnipileClient(unipileDsn, unipileApiKey);
  const targetUserIdentifier = 'arianitsylafeta';
  const targetUserFullName = 'arianit sylafeta';

  try {
    console.log(`Searching for "${targetUserFullName}" on LinkedIn via Unipile...`);
    
    const searchUrl = `${unipileDsn}/api/v1/linkedin/search`;
    const searchOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        // Assuming the API key is passed via this header
        'X-API-KEY': unipileApiKey
      },
      body: JSON.stringify({
        api: 'classic',
        category: 'people',
        keywords: targetUserFullName
      })
    };

    const response = await fetch(searchUrl, searchOptions);
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const searchResults = await response.json();
    console.log(`Found ${searchResults.length} total results.`);

    const targetUser = searchResults.find(user =>
      (user.name && user.name.toLowerCase().includes(targetUserFullName)) ||
      (user.provider_id && user.provider_id.toLowerCase().includes(targetUserIdentifier))
    );

    if (targetUser) {
      console.log(`User found: ${targetUser.name} (ID: ${targetUser.id})`);
      console.log('Fetching posts...');
      
      // Let's see if this SDK method works
      const posts = await client.users.listAllPosts(targetUser.id);
      
      console.log(`Found ${posts.length} posts for ${targetUser.name}.`);
      console.log(JSON.stringify(posts, null, 2));

    } else {
      console.log(`Could not find a user matching "${targetUserIdentifier}" or "${targetUserFullName}" in the search results.`);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    if (error.response?.data) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main(); 