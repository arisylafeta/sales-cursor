/**
 * Test Unipile Cleaners
 * 
 * This file tests the cleaner functions by applying them to the sample responses
 * from the tests/unipile/responses directory and outputting the cleaned results.
 */

import fs from 'fs';
import path from 'path';

// Import cleaner functions
import {
  cleanCompanyProfile,
  cleanCompanySearchResults
} from '../../../lib/unipile/cleaners/companies';

import {
  cleanUserProfile,
  cleanAccountOwnerProfile,
  cleanUserRelations,
  cleanInvitationsReceived,
  cleanInvitationsSent,
  cleanSendInvitationResponse
} from '../../../lib/unipile/cleaners/users';

import {
  cleanUserPosts,
  cleanPostComments,
  cleanCreatePostResponse,
  cleanCommentOnPostResponse
} from '../../../lib/unipile/cleaners/posts';

import {
  cleanChats,
  cleanChatMessages,
  cleanCreateChatResponse,
  cleanSendMessageResponse
} from '../../../lib/unipile/cleaners/messages';

// Define the responses directory and output directory
const responsesDir = path.join(__dirname, '../responses');
const outputDir = path.join(__dirname, 'outputs');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to read a JSON file
function readJsonFile(filePath: string): any {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Function to write a JSON file
function writeJsonFile(filePath: string, data: any): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully wrote file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Process all response files
function processResponseFiles(): void {
  // Get all JSON files in the responses directory
  const files = fs.readdirSync(responsesDir).filter(file => file.endsWith('.json'));

  files.forEach(file => {
    const filePath = path.join(responsesDir, file);
    const response = readJsonFile(filePath);

    if (!response) return;

    // Apply the appropriate cleaner function based on the file name
    let cleanedResponse: any = null;

    if (file === 'getCompanyProfile.json') {
      cleanedResponse = cleanCompanyProfile(response);
    } else if (file === 'searchCompanies.json') {
      cleanedResponse = cleanCompanySearchResults(response);
    } else if (file === 'getUserProfileByIdentifier.json') {
      cleanedResponse = cleanUserProfile(response);
    } else if (file === 'getAccountOwnerProfile.json') {
      cleanedResponse = cleanAccountOwnerProfile(response);
    } else if (file === 'getRelations.json') {
      cleanedResponse = cleanUserRelations(response);
    } else if (file === 'getInvitationsReceived.json') {
      cleanedResponse = cleanInvitationsReceived(response);
    } else if (file === 'getInvitationsSent.json') {
      cleanedResponse = cleanInvitationsSent(response);
    } else if (file === 'getUserPosts.json') {
      cleanedResponse = cleanUserPosts(response);
    } else if (file === 'getUserComments.json') {
      cleanedResponse = cleanPostComments(response);
    } else if (file === 'createPost.json') {
      cleanedResponse = cleanCreatePostResponse(response);
    } else if (file === 'commentOnPost.json') {
      cleanedResponse = cleanCommentOnPostResponse(response);
    } else if (file === 'getChats.json') {
      cleanedResponse = cleanChats(response);
    } else if (file === 'getChatMessages.json') {
      cleanedResponse = cleanChatMessages(response);
    } else if (file === 'createChat.json') {
      cleanedResponse = cleanCreateChatResponse(response);
    } else if (file === 'sendMessage.json') {
      cleanedResponse = cleanSendMessageResponse(response);
    } else if (file === 'sendInvitation.json') {
      cleanedResponse = cleanSendInvitationResponse(response);
    }

    // Write the cleaned response to a file if we have one
    if (cleanedResponse) {
      const outputFilePath = path.join(outputDir, `cleaned_${file}`);
      writeJsonFile(outputFilePath, cleanedResponse);
    }
  });
}

// Run the test
processResponseFiles();

console.log('Test completed. Check the outputs directory for cleaned responses.');