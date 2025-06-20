import "dotenv/config";
import * as assert from "assert";
import { writeFile } from "fs/promises";
import { join } from "path";

import { ApolloError } from "@/lib/apollo/config";
import {
  peopleSearch,
  organizationSearch,
  organizationJobPostings,
} from "@/lib/apollo/search";

// --- PLACEHOLDERS ---
// Please replace these values with actual data for testing.
const PERSON_NAME_TO_SEARCH = "tim zheng";
const ORGANIZATION_NAME_TO_SEARCH = "apollo.io";
const ORGANIZATION_ID_FOR_JOBS = "5e66b6381e05b4008c8331b8"; // Apollo's ID

const RESPONSES_DIR = join(__dirname, "responses");

async function run() {
  console.log("--- Running Search API Tests ---");

  // Test peopleSearch
  try {
    console.log(`Testing peopleSearch with name: "${PERSON_NAME_TO_SEARCH}"...`);
    const searchResults = await peopleSearch({
      q_person_name: PERSON_NAME_TO_SEARCH,
      raw: true,
    });
    assert.strictEqual(
      typeof searchResults,
      "object",
      "Search results should be an object"
    );
    await writeFile(
      join(RESPONSES_DIR, "peopleSearch.json"),
      JSON.stringify(searchResults, null, 2)
    );
    console.log("✓ peopleSearch successful.");
  } catch (error) {
    handleError(error, "peopleSearch");
  }

  // Test organizationSearch
  try {
    console.log(
      `Testing organizationSearch with name: "${ORGANIZATION_NAME_TO_SEARCH}"...`
    );
    const searchResults = await organizationSearch({
      q_organization_name: ORGANIZATION_NAME_TO_SEARCH,
      raw: true,
    });
    assert.strictEqual(
      typeof searchResults,
      "object",
      "Search results should be an object"
    );
    await writeFile(
      join(RESPONSES_DIR, "organizationSearch.json"),
      JSON.stringify(searchResults, null, 2)
    );
    console.log("✓ organizationSearch successful.");
  } catch (error) {
    handleError(error, "organizationSearch");
  }

  // Test organizationJobPostings
  try {
    console.log(
      `Testing organizationJobPostings for organization ID: ${ORGANIZATION_ID_FOR_JOBS}...`
    );
    const jobPostings = await organizationJobPostings({
      organization_id: ORGANIZATION_ID_FOR_JOBS,
      raw: true,
    });
    assert.strictEqual(
      typeof jobPostings,
      "object",
      "Job postings should be an object"
    );
    await writeFile(
      join(RESPONSES_DIR, "organizationJobPostings.json"),
      JSON.stringify(jobPostings, null, 2)
    );
    console.log("✓ organizationJobPostings successful.");
  } catch (error) {
    handleError(error, "organizationJobPostings");
  }

  console.log("--- Search API Tests Complete ---");
}

function handleError(error: any, functionName: string) {
  console.error(`✗ ${functionName} failed.`);
  if (error instanceof ApolloError) {
    console.error(`  Status: ${error.status}`);
    console.error(`  Body: ${error.body}`);
  } else {
    console.error(`  Error: ${error.message}`);
  }
}

run(); 