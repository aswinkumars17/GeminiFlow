import Link from 'next/link';
import { Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-6">
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">GeminiFlow</h1>
        </div>
        <p className="text-center text-muted-foreground">
          Your intelligent chat companion powered by Google Gemini.
        </p>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Create an account or sign in to continue.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">
                Sign Up
              </Link>
            </Button>
          </CardContent>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
