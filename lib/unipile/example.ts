/**
 * Unipile API Client Example
 * 
 * This file demonstrates how to use the Unipile API client.
 */

import {
  // User-related functions
  getAccountOwnerProfile,
  getUserProfileByIdentifier,
  searchLinkedIn,
  getRelations,
  getInvitationsSent,
  getInvitationsReceived,
  
  // Post-related functions
  getUserPosts,
  getUserComments,
  createPost,
  
  // Message-related functions
  getChats,
  getChatMessages,
  sendMessage,
  
  // Company-related functions
  getCompanyProfile
} from './index';

/**
 * Example: Get the authenticated user's LinkedIn profile
 */
async function exampleGetAccountOwnerProfile() {
  try {
    const profile = await getAccountOwnerProfile();
    console.log('Account owner profile:', profile);
  } catch (error) {
    console.error('Error getting account owner profile:', error);
  }
}

/**
 * Example: Get a LinkedIn user's profile by their public identifier
 */
async function exampleGetUserProfile() {
  try {
    const profile = await getUserProfileByIdentifier('arianitsylafeta');
    console.log('User profile:', profile);
  } catch (error) {
    console.error('Error getting user profile:', error);
  }
}

/**
 * Example: Search for LinkedIn users
 */
async function exampleSearchLinkedIn() {
  try {
    const results = await searchLinkedIn('arianit sylafeta');
    console.log('Search results:', results);
  } catch (error) {
    console.error('Error searching LinkedIn:', error);
  }
}

/**
 * Example: Get the user's LinkedIn connections
 */
async function exampleGetRelations() {
  try {
    const relations = await getRelations();
    console.log('Relations:', relations);
  } catch (error) {
    console.error('Error getting relations:', error);
  }
}

/**
 * Example: Get posts from a specific LinkedIn user
 */
async function exampleGetUserPosts() {
  try {
    // First, get the user's profile to get their provider ID
    const profile = await getUserProfileByIdentifier('arianitsylafeta');
    
    // Then, get their posts
    const posts = await getUserPosts(profile.provider_id);
    console.log('User posts:', posts);
  } catch (error) {
    console.error('Error getting user posts:', error);
  }
}

/**
 * Example: Get the user's LinkedIn chats
 */
async function exampleGetChats() {
  try {
    const chats = await getChats();
    console.log('Chats:', chats);
    
    // If there are any chats, get the messages from the first one
    if (chats.items && chats.items.length > 0) {
      const chatId = chats.items[0].id;
      const messages = await getChatMessages(chatId);
      console.log('Messages from first chat:', messages);
    }
  } catch (error) {
    console.error('Error getting chats:', error);
  }
}

/**
 * Example: Get details about a LinkedIn company
 */
async function exampleGetCompanyProfile() {
  try {
    const company = await getCompanyProfile('linkedin');
    console.log('Company profile:', company);
  } catch (error) {
    console.error('Error getting company profile:', error);
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  console.log('Running Unipile API client examples...');
  
  await exampleGetAccountOwnerProfile();
  await exampleGetUserProfile();
  await exampleSearchLinkedIn();
  await exampleGetRelations();
  await exampleGetUserPosts();
  await exampleGetChats();
  await exampleGetCompanyProfile();
  
  console.log('All examples completed.');
}

// Uncomment to run the examples
// runExamples();