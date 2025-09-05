'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Conversation, Message } from '@/lib/types';

// A mock user ID. In a real app, you'd get this from an authentication provider.
const MOCK_USER_ID = 'user123';

// Firestore converters to handle Timestamps
const messageConverter = {
  toFirestore: (message: Message) => {
    return {
      ...message,
      createdAt: serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toDate(),
    } as Message;
  },
};

const conversationConverter = {
  toFirestore: (conversation: Omit<Conversation, 'id'>) => {
    return {
      ...conversation,
      createdAt: serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: any, options: any): Conversation => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      messages: [], // Messages will be fetched separately
      createdAt: data.createdAt?.toDate(),
    } as Conversation;
  },
};

/**
 * Fetches all conversations for the mock user.
 */
export async function getConversations(): Promise<Conversation[]> {
  const conversationsRef = collection(
    db,
    'users',
    MOCK_USER_ID,
    'conversations'
  ).withConverter(conversationConverter);
  const q = query(conversationsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // If no conversations exist, create a default one
    const welcomeMessage: Omit<Message, 'id'> = {
      role: 'assistant',
      content:
        "Hello! I'm GeminiFlow, your intelligent chat companion. How can I assist you today?",
    };
    const defaultConversation = await createNewChat(
      'Welcome to GeminiFlow',
      welcomeMessage
    );
    return [defaultConversation];
  }

  return querySnapshot.docs.map(doc => doc.data());
}

/**
 * Fetches messages for a specific conversation.
 */
export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  const messagesRef = collection(
    db,
    'users',
    MOCK_USER_ID,
    'conversations',
    conversationId,
    'messages'
  ).withConverter(messageConverter);
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}

/**
 * Creates a new chat with a title and an initial message.
 */
export async function createNewChat(
  title: string,
  initialMessage?: Omit<Message, 'id'>
): Promise<Conversation> {
  const conversationsRef = collection(
    db,
    'users',
    MOCK_USER_ID,
    'conversations'
  );
  const newConversationRef = await addDoc(conversationsRef, {
    title,
    createdAt: serverTimestamp(),
    userId: MOCK_USER_ID,
  });

  const newConversation: Conversation = {
    id: newConversationRef.id,
    title,
    messages: [],
  };

  if (initialMessage) {
    const newMessage = await addMessage(newConversation.id, initialMessage);
    newConversation.messages.push(newMessage);
  }

  return newConversation;
}

/**
 * Adds a message to a specific conversation.
 */
export async function addMessage(
  conversationId: string,
  message: Omit<Message, 'id'>
): Promise<Message> {
  const messagesRef = collection(
    db,
    'users',
    MOCK_USER_ID,
    'conversations',
    conversationId,
    'messages'
  );
  const messageRef = await addDoc(messagesRef, {
    ...message,
    createdAt: serverTimestamp(),
  });

  return {
    ...message,
    id: messageRef.id,
  };
}

/**
 * Updates the title of a conversation.
 * @param conversationId - The ID of the conversation to update.
 * @param title - The new title.
 */
export async function updateConversationTitle(
  conversationId: string,
  title: string
) {
  const convoRef = doc(
    db,
    'users',
    MOCK_USER_ID,
    'conversations',
    conversationId
  );
  await updateDoc(convoRef, { title });
}
