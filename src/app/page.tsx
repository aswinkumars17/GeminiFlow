import Link from 'next/link';
import { Bot, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleIcon } from '@/components/icons';

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
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Choose an account to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="outline">
              <Link href="/chat">
                <GoogleIcon className="mr-2 h-4 w-4" />
                Continue with Google
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/chat">
                <Mail className="mr-2 h-4 w-4" />
                Continue with Email
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
