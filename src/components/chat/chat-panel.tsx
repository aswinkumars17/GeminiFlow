'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './message';
import type { Conversation, Message as MessageType } from '@/lib/types';
import { getAIResponse } from '@/app/chat/actions';
import { useToast } from '@/hooks/use-toast';
import { improveMessage } from '@/ai/flows/improve-message';
import { SidebarTrigger } from '../ui/sidebar';
import * as ChatService from '@/services/chat-service';
import { v4 as uuidv4 } from 'uuid';
import type { User } from 'firebase/auth';

interface ChatPanelProps {
  user: User;
  conversation: Conversation;
  addMessage: (message: MessageType) => void;
  updateLastMessage: (id: string, content: string) => void;
  replaceMessage: (oldId: string, newMessage: MessageType) => void;
}

export function ChatPanel({ user, conversation, addMessage, updateLastMessage, replaceMessage }: ChatPanelProps) {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation.messages]);

  const handleImprove = async () => {
    if (!input || isImproving) return;
    setIsImproving(true);
    try {
      const { improvedMessage } = await improveMessage({ message: input });
      setInput(improvedMessage);
    } catch (error) {
      console.error('Failed to improve message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not improve the message. Please try again.',
      });
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || isSending) return;

    setIsSending(true);

    const userMessagePayload: Omit<MessageType, 'id'> = { role: 'user', content: input };
    setInput('');
    
    // Add user message to Firestore and local state
    const userMessage = await ChatService.addMessage(user.uid, conversation.id, userMessagePayload);
    addMessage(userMessage);
    
    // Add a placeholder for the assistant's response
    const placeholderId = uuidv4();
    const assistantPlaceholder: MessageType = { id: placeholderId, role: 'assistant', content: '...' };
    addMessage(assistantPlaceholder);

    const history = [...conversation.messages, userMessage].map(({ role, content }) => ({ role, content }));
    
    const result = await getAIResponse(history);
    
    let assistantResponse = result.message;
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }

    // Add assistant message to Firestore
    const assistantMessagePayload: Omit<MessageType, 'id'> = { role: 'assistant', content: assistantResponse };
    const assistantMessage = await ChatService.addMessage(user.uid, conversation.id, assistantMessagePayload);
    
    // Replace placeholder with actual assistant message in the UI
    replaceMessage(placeholderId, assistantMessage);

    setIsSending(false);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-lg font-semibold">{conversation.title}</h2>
        </div>
      </header>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-6">
          {conversation.messages.map((message, index) => (
            <Message key={message.id} message={message} user={user} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] w-full resize-none pr-32"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            disabled={isSending}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleImprove}
              disabled={!input || isImproving || isSending}
              aria-label="Improve message"
            >
              <Wand2 className={`h-5 w-5 ${isImproving ? 'animate-pulse' : ''}`} />
            </Button>
            <Button type="submit" size="icon" disabled={!input || isSending} aria-label="Send message">
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
