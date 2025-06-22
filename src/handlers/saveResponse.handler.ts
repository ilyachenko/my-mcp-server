import * as fs from 'fs';
import * as path from 'path';

export function handleSaveResponseTool(args: any) {
  try {
    if (!args?.user_message || !args?.claude_response) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Both user_message and claude_response are required',
          },
        ],
        isError: true,
      };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}.txt`;
    const dataDir = path.join(__dirname, '../../data');
    const filePath = path.join(dataDir, filename);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dialogContent = `User: ${args.user_message}\n\nAssistant: ${args.claude_response}`;
    fs.writeFileSync(filePath, dialogContent);

    return {
      content: [
        {
          type: 'text',
          text: `Response saved successfully to ${filename}`,
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