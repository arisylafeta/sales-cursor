import 'dotenv/config';
import * as assert from 'assert';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import {
    getCompanyProfile,
    searchCompanies,
  } from '@/lib/unipile/companies';
import { UnipileError } from '@/lib/unipile/config';


// --- PLACEHOLDERS ---
// Please replace these values with actual data for testing.
const COMPANY_IDENTIFIER_TO_GET = 'hitachi';
const COMPANY_SEARCH_KEYWORDS = 'Technology';

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