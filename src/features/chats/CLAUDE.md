**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `index.tsx`
  - Core function: Chat/messaging page, displays chat interface with message history and input;
  - Technical details: Real-time messaging UI, message list with scrolling, input with send functionality;
  - Key parameters: chat data, messages array, sendMessage handler
- `components/`
  - Core function: Chat-specific UI components;
  - Technical details: Includes chat-message-list, chat-input, chat-header components;
  - Key parameters: messages, onSendMessage input handlers
- `data/`
  - Core function: Data layer for chats feature;
  - Technical details: Contains schema.ts (Zod validation), data.ts (mock chat records);
  - Key parameters: chat schema, mock messages array
