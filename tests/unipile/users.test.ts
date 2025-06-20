import 'dotenv/config';
import * as assert from 'assert';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { UnipileError } from '@/lib/unipile/config';
import {
  getAccountOwnerProfile,
  getUserProfileByIdentifier,
  searchLinkedIn,
  getRelations,
  getInvitationsSent,
  getInvitationsReceived,
  sendInvitation,
} from '@/lib/unipile/users';

// --- PLACEHOLDERS ---
// Please replace these values with actual data for testing.
const USER_IDENTIFIER_TO_GET = 'andi-sylafeta-4a9163202';
const USER_SEARCH_KEYWORDS = 'Software Engineer';
const INVITATION_RECIPIENT_ID = 'ACoAADOi6QEBq1otxoTYbxKN9MeXLX-vXv3K-8w'; // e.g., "urn:li:fs_profile:ACoAABC..."
const INVITATION_MESSAGE = 'Succ my dicc';

const RESPONSES_DIR = join(__dirname, 'responses');

async function run() {
  console.log('--- Running Users API Tests ---');

  // Test getAccountOwnerProfile
  // try {
  //   console.log('Testing getAccountOwnerProfile...');
  //   const ownerProfile = await getAccountOwnerProfile();
  //   assert.strictEqual(typeof ownerProfile, 'object', 'Owner profile should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getAccountOwnerProfile.json'), JSON.stringify(ownerProfile, null, 2));
  //   console.log('✓ getAccountOwnerProfile successful.');
  // } catch (error) {
  //   handleError(error, 'getAccountOwnerProfile');
  // }

  // Test getUserProfileByIdentifier
  // try {
  //   console.log(`Testing getUserProfileByIdentifier with identifier: ${USER_IDENTIFIER_TO_GET}...`);
  //   const userProfile = await getUserProfileByIdentifier(USER_IDENTIFIER_TO_GET);
  //   assert.strictEqual(typeof userProfile, 'object', 'User profile should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getUserProfileByIdentifier.json'), JSON.stringify(userProfile, null, 2));
  //   console.log('✓ getUserProfileByIdentifier successful.');
  // } catch (error) {
  //   handleError(error, 'getUserProfileByIdentifier');
  // }

  // // Test searchLinkedIn
  // try {
  //   console.log(`Testing searchLinkedIn with keywords: "${USER_SEARCH_KEYWORDS}"...`);
  //   const searchResults = await searchLinkedIn(USER_SEARCH_KEYWORDS);
  //   assert.strictEqual(typeof searchResults, 'object', 'Search results should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'searchLinkedIn.json'), JSON.stringify(searchResults, null, 2));
  //   console.log('✓ searchLinkedIn successful.');
  // } catch (error) {
  //   handleError(error, 'searchLinkedIn');
  // }

  // // Test getRelations
  // try {
  //   console.log('Testing getRelations...');
  //   const relations = await getRelations();
  //   assert.strictEqual(typeof relations, 'object', 'Relations should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getRelations.json'), JSON.stringify(relations, null, 2));
  //   console.log('✓ getRelations successful.');
  // } catch (error) {
  //   handleError(error, 'getRelations');
  // }

  // // Test getInvitationsSent
  // try {
  //   console.log('Testing getInvitationsSent...');
  //   const invitationsSent = await getInvitationsSent();
  //   assert.strictEqual(typeof invitationsSent, 'object', 'Sent invitations should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getInvitationsSent.json'), JSON.stringify(invitationsSent, null, 2));
  //   console.log('✓ getInvitationsSent successful.');
  // } catch (error) {
  //   handleError(error, 'getInvitationsSent');
  // }

  // // Test getInvitationsReceived
  // try {
  //   console.log('Testing getInvitationsReceived...');
  //   const invitationsReceived = await getInvitationsReceived();
  //   assert.strictEqual(typeof invitationsReceived, 'object', 'Received invitations should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getInvitationsReceived.json'), JSON.stringify(invitationsReceived, null, 2));
  //   console.log('✓ getInvitationsReceived successful.');
  // } catch (error) {
  //   handleError(error, 'getInvitationsReceived');
  // }

  // Test sendInvitation (Use with caution, this sends a real invitation)
  try {
    console.log(`Testing sendInvitation to: ${INVITATION_RECIPIENT_ID}...`);
    const invitationResult = await sendInvitation(INVITATION_RECIPIENT_ID, INVITATION_MESSAGE);
    assert.strictEqual(typeof invitationResult, 'object', 'Invitation result should be an object');
    await writeFile(join(RESPONSES_DIR, 'sendInvitation.json'), JSON.stringify(invitationResult, null, 2));
    console.log('✓ sendInvitation successful.');
  } catch (error) {
    handleError(error, 'sendInvitation');
  }

  console.log('--- Users API Tests Complete ---');
}

function handleError(error: any, functionName: string) {
    console.error(`✗ ${functionName} failed.`);
    if (error instanceof UnipileError) {
        console.error(`  Status: ${error.status}`);
        console.error(`  Body: ${error.body}`);
    } else {
        console.error(`  Error: ${error.message}`);
    }
}

run(); 