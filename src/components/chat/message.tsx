'use client';

import { Bot, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message as MessageType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'firebase/auth';

interface MessageProps {
  message: MessageType;
  user: User;
}

export function Message({ message, user }: MessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isLoading = message.content === '...';

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Bot />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-xl rounded-lg p-3 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
           <AvatarImage src={user.photoURL ?? "https://picsum.photos/100/100"} alt={user.displayName ?? 'User'} data-ai-hint="profile picture" />
          <AvatarFallback>
            {user.email?.[0].toUpperCase() ?? <UserIcon />}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
