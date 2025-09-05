'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ChatSidebar } from './sidebar';
import { ChatPanel } from './chat-panel';
import type { Conversation, Message } from '@/lib/types';
import { generateFirstMessage } from '@/ai/flows/generate-first-message';
import * as ChatService from '@/services/chat-service';
import { Bot, Lightbulb, Zap } from 'lucide-react';
import { Button } from '../ui/button';

export function ChatLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeConversation = conversations.find(
    c => c.id === activeConversationId
  );

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const convos = await ChatService.getConversations();
      setConversations(convos);
      if (convos.length > 0 && !activeConversationId) {
        // Don't auto-select a conversation to show the welcome screen
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadMessages = useCallback(async (convoId: string) => {
    const convo = conversations.find(c => c.id === convoId);
    // Only fetch if messages are not already loaded
    if (convo && convo.messages.length === 0) {
      try {
        const messages = await ChatService.getConversationMessages(convoId);
        setConversations(prev =>
          prev.map(c => (c.id === convoId ? { ...c, messages } : c))
        );
        // If there are no messages, generate a starter message.
        if (messages.length === 0) {
            generateStarterMessage(convo);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    }
  }, [conversations, setConversations]);

  const generateStarterMessage = async (convo: Conversation) => {
      try {
        const { suggestedMessage } = await generateFirstMessage({
          topic: convo.title,
        });
        const newMessage = await ChatService.addMessage(convo.id, { role: 'assistant', content: suggestedMessage });
        setConversations(prev =>
          prev.map(c =>
            c.id === convo.id ? { ...c, messages: [newMessage] } : c
          )
        );
      } catch (error) {
        console.error('Failed to generate first message:', error);
        const errorMessage: Omit<Message, 'id'> = {
          role: 'assistant',
          content: "I couldn't think of a good starter... what's on your mind?",
        };
        const newErrorMessage = await ChatService.addMessage(convo.id, errorMessage);
        setConversations(prev =>
          prev.map(c =>
            c.id === convo.id ? { ...c, messages: [newErrorMessage] } : c
          )
        );
      }
  };


  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    }
  }, [activeConversationId, loadMessages]);


  const createNewChat = async () => {
    try {
      const newConversation = await ChatService.createNewChat('New Chat');
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
    } catch (error) {
        console.error("Failed to create new chat:", error)
    }
  };

  const addMessage = (message: Message) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConversationId) {
          // If the title is "New Chat", update it in Firestore
          if (c.title === 'New Chat' && message.role === 'user') {
            const newTitle = message.content.substring(0, 30) + '...';
            ChatService.updateConversationTitle(c.id, newTitle);
            return {
              ...c,
              title: newTitle,
              messages: [...c.messages, message],
            };
          }
          return {
            ...c,
            messages: [...c.messages, message],
          };
        }
        return c;
      })
    );
  };
  
  const updateLastMessage = (content: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConversationId) {
          const newMessages = [...c.messages];
          const lastMessage = newMessages[newMessages.length - 1];
          if(lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = content;
          }
          return { ...c, messages: newMessages };
        }
        return c;
      })
    );
  }

  const handleExamplePrompt = async (prompt: string) => {
    await createNewChat();
    // A bit of a hack to wait for state to update.
    setTimeout(() => {
      // Find the new chat
      const newChat = conversations.find(c => c.title === 'New Chat');
      if (newChat && newChat.id === activeConversationId) {
         // This is a simplified version of what happens in ChatPanel.
         // In a real app, this logic should be shared.
         const userMessagePayload: Omit<Message, 'id'> = { role: 'user', content: prompt };
         ChatService.addMessage(newChat.id, userMessagePayload).then(userMessage => {
            addMessage(userMessage);
         });
      }
    }, 500);
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
          createNewChat={createNewChat}
          isLoading={isLoading}
        />
        <SidebarInset>
          {activeConversation ? (
            <ChatPanel
              key={activeConversation.id}
              conversation={activeConversation}
              addMessage={addMessage}
              updateLastMessage={updateLastMessage}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4">
              <div className="flex flex-col items-center text-center max-w-md mx-auto">
                <Bot className="h-16 w-16 text-primary mb-4" />
                <h1 className="text-3xl font-bold mb-2">Welcome to GeminiFlow</h1>
                <p className="text-muted-foreground mb-8">
                  Your intelligent chat companion. Start a new chat or try one of the examples below.
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2" onClick={() => handleExamplePrompt('Explain quantum computing in simple terms')}>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        <span className="font-semibold">Explain</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">quantum computing in simple terms</p>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2" onClick={() => handleExamplePrompt('Write a short story about a robot who discovers music')}>
                     <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <span className="font-semibold">Create</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">a story about a robot who discovers music</p>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
