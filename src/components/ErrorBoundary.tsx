import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log error details for debugging
    this.logError(error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  private logError = (error: Error, errorInfo: React.ErrorInfo) => {
    const errorLog = {
      id: this.state.errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Boundary Details');
      console.log('Error ID:', errorLog.id);
      console.log('Error:', errorLog.error);
      console.log('Component Stack:', errorLog.errorInfo.componentStack);
      console.log('User Agent:', errorLog.userAgent);
      console.log('URL:', errorLog.url);
      console.groupEnd();
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorLog });
  };

  private handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: undefined 
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorDetails = {
      id: this.state.errorId,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // In a real app, you would send this to your error reporting service
    console.log('Error Report:', errorDetails);
    
    // For now, just show an alert
    alert('Error has been logged. Thank you for your patience.');
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-xs bg-gray-50 rounded p-2 max-h-32 overflow-auto">
                  <summary className="cursor-pointer font-medium mb-2 flex items-center gap-1">
                    <Bug className="h-3 w-3" />
                    Error Details (Development)
                  </summary>
                  <div className="space-y-1">
                    <div><strong>Error ID:</strong> {this.state.errorId}</div>
                    <div><strong>Message:</strong> {this.state.error.message}</div>
                    <div><strong>Stack:</strong></div>
                    <pre className="text-xs overflow-auto max-h-20">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={this.handleReset} 
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleReload} 
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                
                <Button 
                  onClick={this.handleGoHome} 
                  className="w-full"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                
                <Button 
                  onClick={this.handleReportError} 
                  className="w-full"
                  variant="outline"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
