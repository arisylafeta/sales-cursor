import 'dotenv/config';
import * as assert from 'assert';

import { getBaseUrl, getHeaders, UnipileError, ensureAccountId } from '@/lib/unipile/config';

// Mock environment variables
const originalEnv = { ...process.env };

function runTests() {
  // Reset process.env before each test block
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = { ...originalEnv };
  });

  describe('Unipile Config', () => {
    describe('getBaseUrl', () => {
      it('should return the base URL if UNIPILE_DNS is set', () => {
        process.env.UNIPILE_DNS = 'api.unipile.com';
        assert.strictEqual(getBaseUrl(), 'https://api.unipile.com');
      });

      it('should return the base URL if UNIPILE_DSN with http is set', () => {
        process.env.UNIPILE_DNS = 'http://localhost:3000';
        assert.strictEqual(getBaseUrl(), 'http://localhost:3000');
      });

      it('should throw an error if UNIPILE_DSN is not set', () => {
        delete process.env.UNIPILE_DNS;
        assert.throws(getBaseUrl, /UNIPILE_DNS environment variable is not set/);
      });
    });

    describe('getHeaders', () => {
      it('should return headers if UNIPILE_API_KEY is set', () => {
        process.env.UNIPILE_API_KEY = 'test-api-key';
        const headers = getHeaders();
        assert.deepStrictEqual(headers, {
          'accept': 'application/json',
          'content-type': 'application/json',
          'X-API-KEY': 'test-api-key'
        });
      });

      it('should throw an error if UNIPILE_API_KEY is not set', () => {
        delete process.env.UNIPILE_API_KEY;
        assert.throws(getHeaders, /UNIPILE_API_KEY environment variable is not set/);
      });
    });

    describe('UnipileError', () => {
      it('should create an error with status and body', () => {
        const error = new UnipileError(404, 'Not Found');
        assert.strictEqual(error.status, 404);
        assert.strictEqual(error.body, 'Not Found');
        assert.strictEqual(error.message, 'Unipile API error: 404');
        assert.strictEqual(error.name, 'UnipileError');
      });

      it('should create an error with a custom message', () => {
        const error = new UnipileError(500, 'Server Error', 'Custom error message');
        assert.strictEqual(error.message, 'Custom error message');
      });
    });

    describe('ensureAccountId', () => {
      it('should return accountId if provided', () => {
        assert.strictEqual(ensureAccountId('provided-id'), 'provided-id');
      });

      it('should return UNIPILE_ACCOUNT_ID if accountId is not provided and env is set', () => {
        process.env.UNIPILE_ACCOUNT_ID = 'env-account-id';
        assert.strictEqual(ensureAccountId(), 'env-account-id');
      });

      it('should throw an error if no accountId is available', () => {
        delete process.env.UNIPILE_ACCOUNT_ID;
        assert.throws(() => ensureAccountId(), /Account ID is required but not provided/);
      });
    });

  });
}

// Simple test runner
const tests: {name: string, fn: () => void}[] = [];
let beforeEachFn: (() => void) | null = null;
let afterAllFn: (() => void) | null = null;

function describe(name: string, fn: () => void) {
  console.log(name);
  fn();
}

function it(name: string, fn: () => void) {
    tests.push({ name, fn });
}

function beforeAll(fn: () => void) {
    fn();
}

function afterAll(fn: () => void) {
    afterAllFn = fn;
}

function beforeEach(fn: () => void) {
    beforeEachFn = fn;
}

function run() {
    for (const test of tests) {
        try {
            if (beforeEachFn) {
                beforeEachFn();
            }
            test.fn();
            console.log(`  ✓ ${test.name}`);
        } catch (error) {
            console.error(`  ✗ ${test.name}`);
            console.error(error);
            process.exit(1);
        }
    }
    if(afterAllFn) {
        afterAllFn();
    }
}


// This is not a real test runner, so we will just run the tests.
// In a real scenario, you would use a test runner like Jest or Vitest.
// For now, we can run this with `npx tsx tests/unipile/config.test.ts`
console.log("Running tests for @/lib/unipile/config.ts");

// A simple check to ensure env variables are loaded for the test
if (!process.env.UNIPILE_API_KEY || !process.env.UNIPILE_DNS) {
    console.warn("\\nWarning: UNIPILE_API_KEY or UNIPILE_DSN is not set in your .env file.");
    console.warn("Some tests might fail. Please create a .env.test or similar and load it.");
}

// Mock test runner functions for structure
runTests();
run(); 