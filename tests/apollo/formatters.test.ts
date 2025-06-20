import "dotenv/config";
import * as assert from "assert";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

import {
  peopleSearchJsonToMarkdown,
  organizationSearchJsonToMarkdown,
  organizationJobPostingsJsonToMarkdown,
  peopleEnrichmentJsonToMarkdown,
  bulkPeopleEnrichmentJsonToMarkdown,
  organizationEnrichmentJsonToMarkdown,
  bulkOrganizationEnrichmentJsonToMarkdown,
} from "@/lib/apollo/cleaners/formatters";

const CLEANED_JSON_DIR = join(__dirname, "responses", "cleaned");
const MARKDOWN_OUTPUT_DIR = join(CLEANED_JSON_DIR, "markdown");

const FORMATTER_MAP: { [key: string]: (json: any) => string } = {
  "peopleSearch.json": peopleSearchJsonToMarkdown,
  "organizationSearch.json": organizationSearchJsonToMarkdown,
  "organizationJobPostings.json": organizationJobPostingsJsonToMarkdown,
  "peopleEnrichment.json": peopleEnrichmentJsonToMarkdown,
  "bulkPeopleEnrichment.json": bulkPeopleEnrichmentJsonToMarkdown,
  "organizationEnrichment.json": organizationEnrichmentJsonToMarkdown,
  "bulkOrganizationEnrichment.json": bulkOrganizationEnrichmentJsonToMarkdown,
};

async function run() {
  console.log("--- Running Formatter Tests ---");

  for (const file of Object.keys(FORMATTER_MAP)) {
    await testFormatter(file, file.replace(".json", ".md"), FORMATTER_MAP[file]);
  }

  console.log("--- Formatter Tests Complete ---");
}

async function testFormatter(
  sourceFile: string,
  outputFile: string,
  formatterFn: (json: any) => string
) {
  try {
    console.log(`Testing formatter for ${sourceFile}...`);
    const sourcePath = join(CLEANED_JSON_DIR, sourceFile);
    const rawJson = await readFile(sourcePath, "utf-8");
    const json = JSON.parse(rawJson);
    const markdown = formatterFn(json);
    assert.ok(markdown, "Formatter function should return data");

    const outputPath = join(MARKDOWN_OUTPUT_DIR, outputFile);
    await writeFile(outputPath, markdown);
    console.log(
      `✓ Formatter for ${sourceFile} successful. Output saved to ${outputFile}.`
    );
  } catch (error: any) {
    console.error(`✗ Formatter for ${sourceFile} failed.`);
    console.error(`  Error: ${error.message}`);
  }
}

run(); 