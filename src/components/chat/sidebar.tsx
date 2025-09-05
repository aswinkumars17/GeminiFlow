'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, MessageSquare, Plus, Settings } from 'lucide-react';
import type { Conversation } from '@/lib/types';
import { useSidebar } from '@/components/ui/sidebar';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string) => void;
  createNewChat: () => void;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  setActiveConversationId,
  createNewChat,
}: ChatSidebarProps) {
  const { open } = useSidebar();
  
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Bot className="h-7 w-7 text-primary" />
              <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">GeminiFlow</span>
            </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
        <div className="w-full px-2">
           <Button variant="outline" className="w-full justify-start" onClick={createNewChat}>
             <Plus className="mr-2" />
             <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
           </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {conversations.map(convo => (
            <SidebarMenuItem key={convo.id}>
              <SidebarMenuButton
                onClick={() => setActiveConversationId(convo.id)}
                isActive={activeConversationId === convo.id}
                tooltip={{ children: convo.title, side:'right' }}
                className="justify-start"
              >
                <MessageSquare />
                <span className="truncate">{convo.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="justify-start" tooltip={{children: 'Settings', side:'right'}}>
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton className="h-auto justify-start gap-3" size="lg" tooltip={{children: "User Profile", side: 'right'}}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/100/100" alt="User" data-ai-hint="profile picture" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="font-medium">User</span>
                        <span className="text-xs text-muted-foreground">user@example.com</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
