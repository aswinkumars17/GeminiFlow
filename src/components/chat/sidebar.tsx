'use client';

import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, LogOut, MessageSquare, Plus, Settings } from 'lucide-react';
import type { Conversation } from '@/lib/types';
import { useSidebar } from '@/components/ui/sidebar';
import { signOutUser } from '@/services/auth-service';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';

interface ChatSidebarProps {
  user: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string) => void;
  createNewChat: () => void;
  isLoading: boolean;
}

export function ChatSidebar({
  user,
  conversations,
  activeConversationId,
  setActiveConversationId,
  createNewChat,
  isLoading,
}: ChatSidebarProps) {
  const { open } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOutUser();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign Out Error',
        description: error,
      });
    } else {
      toast({
        title: 'Signed Out',
        description: "You have been successfully signed out.",
      });
      router.push('/login');
    }
  };
  
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
          {isLoading ? (
            <>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </>
          ) : (
            conversations.map(convo => (
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
            ))
          )}
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
                <SidebarMenuButton className="justify-start" tooltip={{children: 'Sign Out', side:'right'}} onClick={handleSignOut}>
                    <LogOut />
                    <span>Sign Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton className="h-auto justify-start gap-3" size="lg" tooltip={{children: "User Profile", side: 'right'}}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? "https://picsum.photos/100/100"} alt={user.displayName ?? 'User'} data-ai-hint="profile picture" />
                        <AvatarFallback>{user.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="font-medium truncate">{user.displayName ?? 'User'}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
