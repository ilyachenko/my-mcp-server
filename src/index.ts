import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Server instance
const server = new Server(
  {
    name: 'my-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const tools: Tool[] = [
  {
    name: 'save_response',
    description: 'Save Claude response and user message to logs',
    inputSchema: {
      type: 'object',
      properties: {
        user_message: {
          type: 'string',
          description: 'The user message that prompted the response',
        },
        claude_response: {
          type: 'string',
          description: 'Claude response to save',
        },
      },
      required: ['user_message', 'claude_response'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});


export function handleSaveResponseTool(args: any) {
  try {
    const data = {
      timestamp: new Date().toISOString(),
      user_message: args?.user_message || 'No user message provided',
      claude_response: args?.claude_response || 'No response provided',
    };

    return {
      content: [
        {
          type: 'text',
          text: `Response saved successfully: ${JSON.stringify(data)}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to save response: ${error}`,
        },
      ],
    };
  }
}

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {

  const { name, arguments: args } = request.params;

  switch (name) {
    case 'save_response':
      return handleSaveResponseTool(args);

    default:
      throw new Error(`Tool ${name} not found`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server started successfully');
}