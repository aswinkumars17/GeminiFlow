'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChatSidebar } from './sidebar';
import { ChatPanel } from './chat-panel';
import type { Conversation, Message } from '@/lib/types';
import { generateFirstMessage } from '@/ai/flows/generate-first-message';

const initialConversations: Conversation[] = [
  {
    id: '1',
    title: 'Welcome to GeminiFlow',
    messages: [
      {
        id: '1',
        role: 'assistant',
        content:
          "Hello! I'm GeminiFlow, your intelligent chat companion. How can I assist you today?",
      },
    ],
  },
  {
    id: '2',
    title: 'Plan a trip to Tokyo',
    messages: [],
  },
  {
    id: '3',
    title: 'Brainstorm project ideas',
    messages: [],
  },
];

export function ChatLayout() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(conversations[0]?.id ?? null);

  const activeConversation = conversations.find(
    c => c.id === activeConversationId
  );

  useEffect(() => {
    // If an active conversation has no messages, generate a starter message.
    const fetchStarterMessage = async (convo: Conversation) => {
      if (convo && convo.messages.length === 0) {
        try {
          const { suggestedMessage } = await generateFirstMessage({
            topic: convo.title,
          });
          const newMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: suggestedMessage,
          };
          // Update the specific conversation with the new message
          setConversations(prev =>
            prev.map(c =>
              c.id === convo.id ? { ...c, messages: [newMessage] } : c
            )
          );
        } catch (error) {
          console.error('Failed to generate first message:', error);
           const errorMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: "I couldn't think of a good starter... what's on your mind?",
          };
           setConversations(prev =>
            prev.map(c =>
              c.id === convo.id ? { ...c, messages: [errorMessage] } : c
            )
          );
        }
      }
    };
    
    if (activeConversation) {
        fetchStarterMessage(activeConversation);
    }
  }, [activeConversationId, activeConversation]);


  const createNewChat = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const addMessage = (message: Message) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConversationId) {
          // If the title is "New Chat", update it to the first user message
          const newTitle =
            c.title === 'New Chat' && message.role === 'user'
              ? message.content.substring(0, 30) + '...'
              : c.title;
          return {
            ...c,
            title: newTitle,
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
          createNewChat={createNewChat}
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
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Select or create a new chat.</p>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
