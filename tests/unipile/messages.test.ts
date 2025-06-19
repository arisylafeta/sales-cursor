import 'dotenv/config';
import * as assert from 'assert';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { UnipileError } from '@/lib/unipile/config';
import {
  getChats,
  getChatMessages,
  sendMessage,
  createChat,
  sendInMail,
} from '@/lib/unipile/messages';

// --- PLACEHOLDERS ---
// Please replace these values with actual data for testing.
const CHAT_ID_TO_FETCH = '1o0xC1RWV4q3fcsJlJUmFg';
const MESSAGE_CONTENT_TO_SEND = 'Stop getting people pregnant! ChatGPT';
const RECIPIENT_ID_FOR_NEW_CHAT = 'linkedin-profile-urn'; // e.g., "urn:li:fs_profile:ACoAABC..."
const INMAIL_RECIPIENT_ID = 'linkedin-profile-urn';
const INMAIL_SUBJECT = 'Test InMail';
const INMAIL_CONTENT = 'This is a test InMail sent from an automated script.';

const RESPONSES_DIR = join(__dirname, 'responses');

async function run() {
  console.log('--- Running Messages API Tests ---');

//   // Test getChats
//   try {
//     console.log('Testing getChats...');
//     const chats = await getChats();
//     assert.strictEqual(typeof chats, 'object', 'Chats response should be an object');
//     await writeFile(join(RESPONSES_DIR, 'getChats.json'), JSON.stringify(chats, null, 2));
//     console.log('✓ getChats successful.');
//   } catch (error) {
//     handleError(error, 'getChats');
//   }

  // Test getChatMessages
  try {
    console.log(`Testing getChatMessages for chat ID: ${CHAT_ID_TO_FETCH}...`);
    const messages = await getChatMessages(CHAT_ID_TO_FETCH);
    assert.strictEqual(typeof messages, 'object', 'Messages response should be an object');
    await writeFile(join(RESPONSES_DIR, 'getChatMessages.json'), JSON.stringify(messages, null, 2));
    console.log('✓ getChatMessages successful.');
  } catch (error) {
    handleError(error, 'getChatMessages');
  }

  // Test sendMessage (Use with caution, this sends a real message)
  try {
    console.log(`Testing sendMessage to chat ID: ${CHAT_ID_TO_FETCH}...`);
    const sentMessage = await sendMessage(CHAT_ID_TO_FETCH, MESSAGE_CONTENT_TO_SEND);
    assert.strictEqual(typeof sentMessage, 'object', 'Sent message should be an object');
    await writeFile(join(RESPONSES_DIR, 'sendMessage.json'), JSON.stringify(sentMessage, null, 2));
    console.log('✓ sendMessage successful.');
  } catch (error) {
    handleError(error, 'sendMessage');
  }

//   // Test createChat (Use with caution, this creates a real chat)
//   try {
//     console.log(`Testing createChat with recipient: ${RECIPIENT_ID_FOR_NEW_CHAT}...`);
//     const newChat = await createChat(RECIPIENT_ID_FOR_NEW_CHAT);
//     assert.strictEqual(typeof newChat, 'object', 'New chat should be an object');
//     await writeFile(join(RESPONSES_DIR, 'createChat.json'), JSON.stringify(newChat, null, 2));
//     console.log('✓ createChat successful.');
//   } catch (error) {
//     handleError(error, 'createChat');
//   }

//   // Test sendInMail (Use with caution, this sends a real InMail)
//   try {
//     console.log(`Testing sendInMail to: ${INMAIL_RECIPIENT_ID}...`);
//     const inmailResult = await sendInMail(INMAIL_RECIPIENT_ID, INMAIL_SUBJECT, INMAIL_CONTENT);
//     assert.strictEqual(typeof inmailResult, 'object', 'InMail result should be an object');
//     await writeFile(join(RESPONSES_DIR, 'sendInMail.json'), JSON.stringify(inmailResult, null, 2));
//     console.log('✓ sendInMail successful.');
//   } catch (error) {
//     handleError(error, 'sendInMail');
//   }

  console.log('--- Messages API Tests Complete ---');
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