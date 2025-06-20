import "dotenv/config";
import * as assert from "assert";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

import {
  cleanBulkPeopleEnrichment,
  cleanOrganizationEnrichment,
  cleanBulkOrganizationEnrichment,
  cleanPeopleEnrichment,
} from "@/lib/apollo/cleaners/enrich";
import {
  cleanPeopleSearch,
  cleanOrganizationSearch,
  cleanOrganizationJobPostings,
} from "@/lib/apollo/cleaners/search";

const RESPONSES_DIR = join(__dirname, "responses");
const CLEANED_RESPONSES_DIR = join(RESPONSES_DIR, "cleaned");

async function run() {
  console.log("--- Running Cleaner Tests ---");

  await testCleaner(
    "peopleSearch.json",
    "peopleSearch.json",
    cleanPeopleSearch
  );
  await testCleaner(
    "organizationSearch.json",
    "organizationSearch.json",
    cleanOrganizationSearch
  );
  await testCleaner(
    "organizationJobPostings.json",
    "organizationJobPostings.json",
    cleanOrganizationJobPostings
  );
  await testCleaner(
    "peopleEnrichment.json",
    "peopleEnrichment.json",
    cleanPeopleEnrichment
  );
  await testCleaner(
    "bulkPeopleEnrichment.json",
    "bulkPeopleEnrichment.json",
    cleanBulkPeopleEnrichment
  );
  await testCleaner(
    "organizationEnrichment.json",
    "organizationEnrichment.json",
    cleanOrganizationEnrichment
  );
  await testCleaner(
    "bulkOrganizationEnrichment.json",
    "bulkOrganizationEnrichment.json",
    cleanBulkOrganizationEnrichment
  );

  console.log("--- Cleaner Tests Complete ---");
}

async function testCleaner(
  sourceFile: string,
  outputFile: string,
  cleanerFn: (json: any) => any
) {
  try {
    console.log(`Testing cleaner for ${sourceFile}...`);
    const sourcePath = join(RESPONSES_DIR, sourceFile);
    const rawResponse = await readFile(sourcePath, "utf-8");
    const jsonResponse = JSON.parse(rawResponse);
    const cleanedData = cleanerFn(jsonResponse);
    assert.ok(cleanedData, "Cleaner function should return data");

    const outputPath = join(CLEANED_RESPONSES_DIR, outputFile);
    await writeFile(outputPath, JSON.stringify(cleanedData, null, 2));
    console.log(
      `✓ Cleaner for ${sourceFile} successful. Output saved to ${outputFile}.`
    );
  } catch (error: any) {
    console.error(`✗ Cleaner for ${sourceFile} failed.`);
    console.error(`  Error: ${error.message}`);
  }
}

run(); 