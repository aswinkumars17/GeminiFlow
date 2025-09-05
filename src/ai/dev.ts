import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-chat-history.ts';
import '@/ai/flows/generate-first-message.ts';
import '@/ai/flows/improve-message.ts';