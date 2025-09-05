'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import * as ChatService from '@/services/chat-service';

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
      setConversations(convo_s);
      if (convo_s.length > 0 && !activeConversationId) {
        setActiveConversationId(convo_s[0].id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

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
  }, [conversations]);

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
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Select or create a new chat.</p>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
