import { streamObject, streamText, tool, StreamData } from 'ai';
import { z } from 'zod';

import { customModel } from '@/ai';
import { getDocumentById } from '@/db/cached-queries';
import { saveDocument, saveSuggestions } from '@/db/mutations';
import { generateUUID } from '@/lib/utils';

async function getUser() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export const documentTools = (streamingData: StreamData) => ({
  createDocument: tool({
    description: 'Create a document for a writing activity',
    parameters: z.object({
      title: z.string(),
    }),
    execute: async ({ title }) => {
      const user = await getUser();
      if (!user) throw new Error('Unauthorized');

      const id = generateUUID();
      let draftText: string = '';

      streamingData.append({ type: 'id', content: id });
      streamingData.append({ type: 'title', content: title });
      streamingData.append({ type: 'clear', content: '' });

      const { fullStream } = await streamText({
        model: customModel('claude-3-5-sonnet-20240620'), // Replace with your model
        system:
          'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
        prompt: title,
      });

      for await (const delta of fullStream) {
        if (delta.type === 'text-delta') {
          draftText += delta.textDelta;
          streamingData.append({
            type: 'text-delta',
            content: delta.textDelta,
          });
        }
      }

      streamingData.append({ type: 'finish', content: '' });

      await saveDocument({
        id,
        title,
        content: draftText,
        userId: user.id,
      });

      return {
        id,
        title,
        content: `A document was created and is now visible to the user.`,
      };
    },
  }),
  updateDocument: tool({
    description: 'Update a document with the given description',
    parameters: z.object({
      id: z.string().describe('The ID of the document to update'),
      description: z
        .string()
        .describe('The description of changes that need to be made'),
    }),
    execute: async ({ id, description }) => {
      const user = await getUser();
      if (!user) throw new Error('Unauthorized');

      const document = await getDocumentById(id);
      if (!document) {
        return { error: 'Document not found' };
      }

      const { content: currentContent } = document;
      if (!currentContent) {
        return { error: 'Document has no content' };
      }
      let draftText: string = '';

      streamingData.append({
        type: 'clear',
        content: document.title,
      });

      const { fullStream } = await streamText({
        model: customModel('claude-3-5-sonnet-20240620'), // Replace with your model
        system:
          'You are a helpful writing assistant. Based on the description, please update the piece of writing.',
        experimental_providerMetadata: {
          openai: {
            prediction: {
              type: 'content',
              content: currentContent,
            },
          },
        },
        messages: [
          {
            role: 'user',
            content: description,
          },
          { role: 'user', content: currentContent },
        ],
      });

      for await (const delta of fullStream) {
        if (delta.type === 'text-delta') {
          const { textDelta } = delta;
          draftText += textDelta;
          streamingData.append({
            type: 'text-delta',
            content: textDelta,
          });
        }
      }

      streamingData.append({ type: 'finish', content: '' });

      await saveDocument({
        id,
        title: document.title,
        content: draftText,
        userId: user.id,
      });

      return {
        id,
        title: document.title,
        content: 'The document has been updated successfully.',
      };
    },
  }),
  requestSuggestions: tool({
    description: 'Request suggestions for a document',
    parameters: z.object({
      documentId: z
        .string()
        .describe('The ID of the document to request edits'),
    }),
    execute: async ({ documentId }) => {
      const user = await getUser();
      if (!user) throw new Error('Unauthorized');

      const document = await getDocumentById(documentId);
      if (!document || !document.content) {
        return { error: 'Document not found' };
      }

      let suggestions: Array<{
        originalText: string;
        suggestedText: string;
        description: string;
        id: string;
        documentId: string;
        isResolved: boolean;
      }> = [];

      const { elementStream } = await streamObject({
        model: customModel('claude-3-5-sonnet-20240620'), // Replace with your model
        system:
          'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
        prompt: document.content,
        output: 'array',
        schema: z.object({
          originalSentence: z.string().describe('The original sentence'),
          suggestedSentence: z.string().describe('The suggested sentence'),
          description: z
            .string()
            .describe('The description of the suggestion'),
        }),
      });

      for await (const element of elementStream) {
        const suggestion = {
          originalText: element.originalSentence,
          suggestedText: element.suggestedSentence,
          description: element.description,
          id: generateUUID(),
          documentId: documentId,
          isResolved: false,
        };

        streamingData.append({
          type: 'suggestion',
          content: suggestion,
        });

        suggestions.push(suggestion);
      }

      const userId = user.id;
      await saveSuggestions({
        suggestions: suggestions.map((suggestion) => ({
          ...suggestion,
          userId,
          createdAt: new Date(),
          documentCreatedAt: document.created_at,
        })),
      });

      return {
        id: documentId,
        title: document.title,
        message: 'Suggestions have been added to the document',
      };
    },
  }),
}); 