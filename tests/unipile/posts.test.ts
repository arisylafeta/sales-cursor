import 'dotenv/config';
import * as assert from 'assert';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { UnipileError } from '@/lib/unipile/config';
import {
  getUserPosts,
  getUserComments,
  createPost,
  getPost,
  getPostComments,
  commentOnPost,
} from '@/lib/unipile/posts';

// --- PLACEHOLDERS ---
// Please replace these values with actual data for testing.
const USER_ID_FOR_POSTS = 'ACoAAA119qIBvOTRhOkXtY4yGtmG_XWf3rjJ48Q'; // e.g., "urn:li:person:..."
const POST_ID_TO_FETCH = 'urn:li:activity:7341861677639831554'; // e.g., "urn:li:share:..."
const POST_CONTENT_TO_CREATE = 'This is a test post created by an automated script.';
const COMMENT_CONTENT = 'Great post!';

const RESPONSES_DIR = join(__dirname, 'responses');

async function run() {
  console.log('--- Running Posts API Tests ---');

  // Test getUserPosts
  // try {
  //   console.log(`Testing getUserPosts for user: ${USER_ID_FOR_POSTS}...`);
  //   const userPosts = await getUserPosts(USER_ID_FOR_POSTS);
  //   assert.strictEqual(typeof userPosts, 'object', 'User posts should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getUserPosts.json'), JSON.stringify(userPosts, null, 2));
  //   console.log('✓ getUserPosts successful.');
  // } catch (error) {
  //   handleError(error, 'getUserPosts');
  // }

  // // Test getUserComments
  // try {
  //   console.log(`Testing getUserComments for user: ${USER_ID_FOR_POSTS}...`);
  //   const userComments = await getUserComments(USER_ID_FOR_POSTS);
  //   assert.strictEqual(typeof userComments, 'object', 'User comments should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getUserComments.json'), JSON.stringify(userComments, null, 2));
  //   console.log('✓ getUserComments successful.');
  // } catch (error) {
  //   handleError(error, 'getUserComments');
  // }

  // // Test getPost
  // try {
  //   console.log(`Testing getPost with ID: ${POST_ID_TO_FETCH}...`);
  //   const post = await getPost(POST_ID_TO_FETCH);
  //   assert.strictEqual(typeof post, 'object', 'Post should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getPost.json'), JSON.stringify(post, null, 2));
  //   console.log('✓ getPost successful.');
  // } catch (error) {
  //   handleError(error, 'getPost');
  // }

  // // Test getPostComments
  // try {
  //   console.log(`Testing getPostComments for post ID: ${POST_ID_TO_FETCH}...`);
  //   const postComments = await getPostComments(POST_ID_TO_FETCH);
  //   assert.strictEqual(typeof postComments, 'object', 'Post comments should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'getPostComments.json'), JSON.stringify(postComments, null, 2));
  //   console.log('✓ getPostComments successful.');
  // } catch (error) {
  //   handleError(error, 'getPostComments');
  // }

  // Test createPost (Use with caution, this creates a real post)
  // try {
  //   console.log('Testing createPost...');
  //   const newPost = await createPost(POST_CONTENT_TO_CREATE, 'connections');
  //   assert.strictEqual(typeof newPost, 'object', 'New post should be an object');
  //   await writeFile(join(RESPONSES_DIR, 'createPost.json'), JSON.stringify(newPost, null, 2));
  //   console.log('✓ createPost successful.');
  // } catch (error) {
  //   handleError(error, 'createPost');
  // }
  
  // Test commentOnPost (Use with caution, this creates a real comment)
  try {
    console.log(`Testing commentOnPost on post ID: ${POST_ID_TO_FETCH}...`);
    const newComment = await commentOnPost(POST_ID_TO_FETCH, COMMENT_CONTENT);
    assert.strictEqual(typeof newComment, 'object', 'New comment should be an object');
    await writeFile(join(RESPONSES_DIR, 'commentOnPost.json'), JSON.stringify(newComment, null, 2));
    console.log('✓ commentOnPost successful.');
  } catch (error) {
    handleError(error, 'commentOnPost');
  }

  console.log('--- Posts API Tests Complete ---');
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