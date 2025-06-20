# Unipile Cleaner Tests

This directory contains tests for the Unipile API response cleaners.

## Running the Tests

To run the tests, use the following command:

```bash
npx tsx tests/unipile/cleaners/run-tests-tsx.ts
```

This will:
1. Read all the sample responses from the `tests/unipile/responses` directory
2. Apply the appropriate cleaner function to each response
3. Output the cleaned results to the `tests/unipile/cleaners/outputs` directory

## Outputs

The outputs directory will contain JSON files with the cleaned responses. Each file will be named `cleaned_[original_file_name].json`.

For example:
- `cleaned_getCompanyProfile.json`
- `cleaned_getUserPosts.json`
- `cleaned_createChat.json`

## Purpose

These tests help visualize how the cleaner functions transform the raw API responses into more concise and relevant formats suitable for LLM consumption.