import "dotenv/config";
import * as assert from "assert";
import { writeFile } from "fs/promises";
import { join } from "path";

import { ApolloError } from "@/lib/apollo/config";
import {
  peopleEnrichment,
  bulkPeopleEnrichment,
  organizationEnrichment,
  bulkOrganizationEnrichment,
} from "@/lib/apollo/enrich";

// --- PLACEHOLDERS ---
const PERSON_TO_ENRICH = {
  name: "tim zheng",
  first_name: "tim",
  last_name: "zheng",
  domain: "apollo.io",
};
const ORGANIZATION_TO_ENRICH = { domain: "apollo.io" };
const BULK_PEOPLE_TO_ENRICH = [
  { name: "tim zheng", domain: "apollo.io" },
  { name: "elon musk", domain: "tesla.com" },
];
const BULK_ORGANIZATIONS_TO_ENRICH = ["apollo.io", "google.com"];

const RESPONSES_DIR = join(__dirname, "responses");

async function run() {
  console.log("--- Running Enrichment API Tests ---");

  // Test peopleEnrichment
  try {
    console.log(
      `Testing peopleEnrichment with name: "${PERSON_TO_ENRICH.name}"...`
    );
    const enrichmentResult = await peopleEnrichment({
      ...PERSON_TO_ENRICH,
      raw: true,
    });
    assert.strictEqual(
      typeof enrichmentResult,
      "object",
      "Enrichment result should be an object"
    );
    await writeFile(
      join(RESPONSES_DIR, "peopleEnrichment.json"),
      JSON.stringify(enrichmentResult, null, 2)
    );
    console.log("✓ peopleEnrichment successful.");
  } catch (error) {
    handleError(error, "peopleEnrichment");
  }

  // Test bulkPeopleEnrichment
  try {
    console.log(`Testing bulkPeopleEnrichment...`);
    const enrichmentResult = await bulkPeopleEnrichment({
      details: BULK_PEOPLE_TO_ENRICH,
      raw: true,
    });
    assert.strictEqual(
      typeof enrichmentResult,
      "object",
      "Enrichment result should be an object"
    );
    await writeFile(
      join(RESPONSES_DIR, "bulkPeopleEnrichment.json"),
      JSON.stringify(enrichmentResult, null, 2)
    );
    console.log("✓ bulkPeopleEnrichment successful.");
  } catch (error) {
    handleError(error, "bulkPeopleEnrichment");
  }

  // Test organizationEnrichment
  try {
    console.log(
      `Testing organizationEnrichment with domain: "${ORGANIZATION_TO_ENRICH.domain}"...`
    );
    const enrichmentResult = await organizationEnrichment({
      ...ORGANIZATION_TO_ENRICH,
      raw: true,
    });
    assert.strictEqual(
      typeof enrichmentResult,
      "object",
      "Enrichment result should be an object"
    );
    await writeFile(
      join(RESPONSES_DIR, "organizationEnrichment.json"),
      JSON.stringify(enrichmentResult, null, 2)
    );
    console.log("✓ organizationEnrichment successful.");
  } catch (error) {
    handleError(error, "organizationEnrichment");
  }

  // Test bulkOrganizationEnrichment
  try {
    console.log(`Testing bulkOrganizationEnrichment...`);
    const enrichmentResult = await bulkOrganizationEnrichment({
      domains: BULK_ORGANIZATIONS_TO_ENRICH,
      raw: true,
    });
    assert.strictEqual(
      typeof enrichmentResult,
      "object",
      "Enrichment result should be an object"
    );
    await writeFile(
      join(RESPONSES_DIR, "bulkOrganizationEnrichment.json"),
      JSON.stringify(enrichmentResult, null, 2)
    );
    console.log("✓ bulkOrganizationEnrichment successful.");
  } catch (error) {
    handleError(error, "bulkOrganizationEnrichment");
  }

  console.log("--- Enrichment API Tests Complete ---");
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