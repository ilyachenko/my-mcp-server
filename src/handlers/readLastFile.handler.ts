import * as fs from 'fs';
import * as path from 'path';

export function handleReadLastFileTool() {
  try {
    const dataDir = path.join(__dirname, '../../data');
    
    if (!fs.existsSync(dataDir)) {
      return {
        content: [
          {
            type: 'text',
            text: 'Data directory does not exist',
          },
        ],
        isError: true,
      };
    }

    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => ({
        name: file,
        path: path.join(dataDir, file),
        mtime: fs.statSync(path.join(dataDir, file)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No files found in data directory',
          },
        ],
      };
    }

    const lastFile = files[0];
    const content = fs.readFileSync(lastFile.path, 'utf8');

    return {
      content: [
        {
          type: 'text',
          text: `Last saved file: ${lastFile.name}\n\nContent:\n${content}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to read last file: ${error}`,
        },
      ],
      isError: true,
    };
  }
}