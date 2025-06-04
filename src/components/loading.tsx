import { Sprout } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

export function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6 p-4">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="absolute -inset-4 animate-spin-slow rounded-full border-b-2 border-t-2 border-primary/30"></div>
          {/* Inner spinning ring */}
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <div className="absolute inset-0 animate-pulse flex items-center justify-center">
              <Sprout className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-xl font-medium text-primary animate-pulse">
            {text}
          </p>
          <p className="text-sm text-muted-foreground">
            Please wait while we process your request
          </p>
        </div>
      </div>
    </div>
  );
}
