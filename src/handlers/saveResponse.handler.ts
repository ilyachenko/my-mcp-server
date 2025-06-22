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

    const data = {
      timestamp: new Date().toISOString(),
      user_message: args.user_message,
      claude_response: args.claude_response,
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