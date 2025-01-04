// Next.js API route for CopilotKit
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';

// Example data or configuration
const exampleData = [
  { id: 1, name: 'Token Purchase' },
  { id: 2, name: 'Account Information' },
];

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment variables
});

// Configure OpenAIAdapter
const llmAdapter = new OpenAIAdapter({
  openai,
  model: 'gpt-4o-mini',
});

// Configure CopilotRuntime
const runtime = new CopilotRuntime({
  actions: ({ properties }) => {
    return [
      {
        name: 'getTokenPurchaseInfo',
        description: 'Retrieve token purchase information.',
        parameters: [
          {
            name: 'id',
            type: 'number',
            description: 'The ID of the token purchase record.',
            required: true,
          },
        ],
        handler: async ({ id }) => {
          const record = exampleData.find((item) => item.id === id);
          return record ? record : { error: 'Record not found' };
        },
      },
    ];
  },
  readable: () => ({
    description: 'A list of example data available.',
    value: exampleData,
  }),
});

// Create API endpoint handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: llmAdapter,
    endpoint: '/api/copilot',
  });

  return handleRequest(req, res);
}
