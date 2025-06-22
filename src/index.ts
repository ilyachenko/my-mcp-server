import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { handleSaveResponseTool } from './handlers/saveResponse.handler.js';

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
    description: 'Save Claude response and user message',
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

main().catch(console.error);