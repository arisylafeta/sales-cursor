import 'dotenv/config';
import * as assert from 'assert';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import {
    getCompanyProfile,
    searchCompanies,
    followCompany,
    unfollowCompany,
  } from '@/lib/unipile/companies';
import { UnipileError } from '@/lib/unipile/config';


// --- PLACEHOLDERS ---
// Please replace these values with actual data for testing.
const COMPANY_IDENTIFIER_TO_GET = 'linkedin';
const COMPANY_SEARCH_KEYWORDS = 'Technology';
const COMPANY_ID_TO_FOLLOW_UNFOLLOW = 'hitachi'; // LinkedIn's company ID

const RESPONSES_DIR = join(__dirname, 'responses');

async function run() {
  console.log('--- Running Companies API Tests ---');

  // Test getCompanyProfile
  try {
    console.log(`Testing getCompanyProfile with identifier: ${COMPANY_IDENTIFIER_TO_GET}...`);
    const companyProfile = await getCompanyProfile(COMPANY_IDENTIFIER_TO_GET);
    assert.strictEqual(typeof companyProfile, 'object', 'Company profile should be an object');
    await writeFile(join(RESPONSES_DIR, 'getCompanyProfile.json'), JSON.stringify(companyProfile, null, 2));
    console.log('✓ getCompanyProfile successful.');
  } catch (error) {
    handleError(error, 'getCompanyProfile');
  }

  // Test searchCompanies
  try {
    console.log(`Testing searchCompanies with keywords: "${COMPANY_SEARCH_KEYWORDS}"...`);
    const searchResults = await searchCompanies(COMPANY_SEARCH_KEYWORDS);
    assert.strictEqual(typeof searchResults, 'object', 'Search results should be an object');
    await writeFile(join(RESPONSES_DIR, 'searchCompanies.json'), JSON.stringify(searchResults, null, 2));
    console.log('✓ searchCompanies successful.');
  } catch (error) {
    handleError(error, 'searchCompanies');
  }

  // Test followCompany (Use with caution, this follows a real company)
  // try {
  //   console.log(`Testing followCompany with ID: ${COMPANY_ID_TO_FOLLOW_UNFOLLOW}...`);
  //   const followResult = await followCompany(COMPANY_ID_TO_FOLLOW_UNFOLLOW);
  //   assert.strictEqual(typeof followResult, 'object', 'Follow result should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'followCompany.json'), JSON.stringify(followResult, null, 2));
  //   console.log('✓ followCompany successful.');
  // } catch (error) {
  //   handleError(error, 'followCompany');
  // }

  // Test unfollowCompany (Use with caution, this unfollows a real company)
  // try {
  //   console.log(`Testing unfollowCompany with ID: ${COMPANY_ID_TO_FOLLOW_UNFOLLOW}...`);
  //   const unfollowResult = await unfollowCompany(COMPANY_ID_TO_FOLLOW_UNFOLLOW);
  //   assert.strictEqual(typeof unfollowResult, 'object', 'Unfollow result should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'unfollowCompany.json'), JSON.stringify(unfollowResult, null, 2));
  //   console.log('✓ unfollowCompany successful.');
  // } catch (error) {
  //   handleError(error, 'unfollowCompany');
  // }

  console.log('--- Companies API Tests Complete ---');
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