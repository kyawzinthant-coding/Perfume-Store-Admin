import { AlertCircle, RefreshCcw, ArrowLeft, Store } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function Error({
  title = 'Oops! Something went wrong',
  message = 'We encountered an error while processing your request.',
  onRetry,
}: ErrorProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Logo and Error Icon */}
          <div className="relative">
            <div className="absolute -inset-4 animate-ping rounded-full bg-destructive/10"></div>
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-destructive/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Store className="h-12 w-12 text-destructive animate-pulse" />
              </div>
              <AlertCircle className="h-full w-full text-destructive/40" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-tight text-destructive">
              {title}
            </h3>
            <p className="text-muted-foreground">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            {onRetry && (
              <Button variant="default" className="gap-2" onClick={onRetry}>
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
