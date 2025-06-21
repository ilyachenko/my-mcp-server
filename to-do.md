# MCP Server Creation Plan - TypeScript

## Overview
Create a simple Model Context Protocol (MCP) server in TypeScript that can be tested with Claude Desktop. This server will provide basic functionality to verify the MCP integration works correctly.

## Prerequisites
- Node.js v22
- npm package manager
- Claude Desktop installed
- Basic TypeScript knowledge

## Step 1: Project Setup

### Install Dependencies
```bash
# Core MCP SDK
npm install @modelcontextprotocol/sdk

# TypeScript and development dependencies
npm install -D typescript @types/node ts-node nodemon

# Additional utilities
npm install zod
```

### Create TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Step 2: Basic Server Structure

### Create Source Directory
```bash
mkdir src
```

### Create Main Server File
Create `src/index.ts` with basic MCP server structure:
```typescript
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
    name: 'my-simple-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions will go here

// Request handlers will go here

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server started successfully');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

## Step 3: Implement Basic Tools

### Add Simple Tools
Add these tools to your server for testing:

#### Echo Tool
```typescript
// Add after server definition
const tools: Tool[] = [
  {
    name: 'echo',
    description: 'Echo back the provided message',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The message to echo back',
        },
      },
      required: ['message'],
    },
  },
  {
    name: 'get_time',
    description: 'Get the current time',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
```

### Add Request Handlers
```typescript
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
    case 'echo':
      return {
        content: [
          {
            type: 'text',
            text: `Echo: ${args.message}`,
          },
        ],
      };

    case 'get_time':
      return {
        content: [
          {
            type: 'text',
            text: `Current time: ${new Date().toISOString()}`,
          },
        ],
      };

    default:
      throw new Error(`Tool ${name} not found`);
  }
});
```

## Step 4: Build Configuration

### Update package.json Scripts
Add these scripts to `package.json`:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "nodemon --exec ts-node src/index.ts"
  }
}
```

### Build the Project
```bash
npm run build
```

## Step 5: Claude Desktop Configuration

### Locate Claude Desktop Config
Find the Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Add MCP Server Configuration
Edit the config file to include your server:
```json
{
  "mcpServers": {
    "my-simple-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/dist/index.js"],
      "env": {}
    }
  }
}
```

**Important**: Use the absolute path to your compiled JavaScript file.

## Step 6: Testing

### Test Server Locally
```bash
# Run in development mode
npm run dev

# Or run compiled version
npm start
```

### Test in Claude Desktop
1. Save the configuration file
2. Restart Claude Desktop completely
3. Start a new conversation
4. Try using your tools:
   - "Can you echo 'Hello World'?"
   - "What's the current time?"

### Verify Connection
Check that Claude Desktop recognizes your server by looking for your tools in the conversation interface.

## Step 7: Debugging

### Common Issues
- **Path Issues**: Ensure absolute paths in configuration
- **Permissions**: Check file permissions for the server executable
- **Dependencies**: Verify all npm packages are installed
- **Port Conflicts**: MCP uses stdio, but check for any conflicts

### Debug Logging
Add debug logging to your server:
```typescript
console.error('Tool called:', name, args);
```

### Check Claude Desktop Logs
Look for error messages in Claude Desktop's developer console or logs.

## Step 8: Next Steps

### Extend Functionality
- Add more complex tools
- Implement resource handlers
- Add prompt templates
- Create tool chains

### Production Considerations
- Add error handling
- Implement logging
- Add input validation with Zod
- Create proper build pipeline

## File Structure Summary
```
project-root/
├── src/
│   └── index.ts
├── dist/           (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Verification Checklist
- [ ] Project initialized and dependencies installed
- [ ] TypeScript configuration created
- [ ] Basic server structure implemented
- [ ] Tools defined and handlers added
- [ ] Project builds successfully
- [ ] Claude Desktop configuration updated
- [ ] Server starts without errors
- [ ] Tools accessible in Claude Desktop
- [ ] Basic functionality tested

This plan provides a complete foundation for creating and testing an MCP server with Claude Desktop.