# MCP Grammar Server

A Model Context Protocol (MCP) server that provides grammar checking capabilities.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

Add the following configuration to your MCP client settings:

```json
{
  "mcpServers": {
    "mcp-server-grammar": {
      "command": "node",
      "args": ["/Users/user/.../my-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

Replace the path in `args` with the absolute path to your built `dist/index.js` file.

## Development

- **Start development server**: `npm run dev`
- **Watch mode**: `npm run watch`
- **Build**: `npm run build`
- **Run tests**: `npm test`
- **Test with coverage**: `npm run test:coverage`

## Usage

Once configured, the MCP server will be available to your MCP client and can provide grammar checking functionality through the Model Context Protocol.