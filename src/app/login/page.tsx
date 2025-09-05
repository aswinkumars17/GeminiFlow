import { LoginForm } from './login-form';
import { Bot } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-6">
            <div className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">GeminiFlow</h1>
            </div>
            <p className="text-center text-muted-foreground">
                Welcome back! Sign in to your account.
            </p>
            <LoginForm />
        </div>
    </div>
  );
}
