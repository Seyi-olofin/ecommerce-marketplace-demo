import { toast } from "@/hooks/use-toast";

// Error tracking and analytics service
interface TrackedError {
  message: string;
  stack?: string;
  type: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  additionalData?: any;
}

export class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private errors: TrackedError[] = [];
  private maxErrors = 100;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  // Setup global error handlers
  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: 'Unhandled Promise Rejection',
        stack: event.reason?.stack || event.reason?.toString(),
        type: 'promise_rejection',
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        type: 'javascript_error',
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle React errors (if using ErrorBoundary)
    window.addEventListener('react_error', (event: any) => {
      this.trackError({
        message: event.detail?.message || 'React Error',
        stack: event.detail?.stack,
        type: 'react_error',
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });
  }

  // Track an error
  trackError(error: {
    message: string;
    stack?: string;
    type: string;
    timestamp: Date;
    userAgent: string;
    url: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    additionalData?: any;
  }): void {
    // Add to errors array
    this.errors.unshift(error);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', error);
    }

    // Send to analytics service (placeholder for actual implementation)
    this.sendToAnalytics(error);

    // Show user-friendly error message for critical errors
    if (this.isCriticalError(error)) {
      this.showUserError(error);
    }
  }

  // Check if error is critical
  private isCriticalError(error: any): boolean {
    const criticalTypes = ['javascript_error', 'promise_rejection', 'network_error'];
    return criticalTypes.includes(error.type) || error.message?.includes('Failed to fetch');
  }

  // Show user-friendly error message
  private showUserError(error: any): void {
    const userMessage = this.getUserFriendlyMessage(error);

    toast({
      title: "Something went wrong",
      description: userMessage,
      variant: "destructive",
    });
  }

  // Get user-friendly error message
  private getUserFriendlyMessage(error: any): string {
    if (error.message?.includes('Failed to fetch')) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    if (error.message?.includes('NetworkError')) {
      return "Network error occurred. Please try again.";
    }
    if (error.type === 'promise_rejection') {
      return "An unexpected error occurred. Please refresh the page.";
    }
    return "An error occurred. Please try again or contact support if the problem persists.";
  }

  // Send error to analytics service
  private async sendToAnalytics(error: any): Promise<void> {
    try {
      // Placeholder for analytics service integration
      // In production, you would send to services like Sentry, LogRocket, etc.

      const analyticsData = {
        event: 'error',
        error_type: error.type,
        message: error.message,
        stack: error.stack,
        url: error.url,
        user_agent: error.userAgent,
        timestamp: error.timestamp.toISOString(),
        additional_data: error.additionalData
      };

      // For now, just store locally or send to console
      if (process.env.NODE_ENV === 'production') {
        // Send to your analytics endpoint
        // await fetch('/api/analytics/error', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(analyticsData)
        // });
      }
    } catch (analyticsError) {
      console.warn('Failed to send error to analytics:', analyticsError);
    }
  }

  // Track user interactions and performance
  trackEvent(eventName: string, data?: any): void {
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      data: data || {}
    };

    // Send to analytics
    this.sendEventToAnalytics(eventData);
  }

  // Send event to analytics
  private async sendEventToAnalytics(eventData: any): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'production') {
        // Send to analytics endpoint
        // await fetch('/api/analytics/event', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(eventData)
        // });
      }
    } catch (error) {
      console.warn('Failed to send event to analytics:', error);
    }
  }

  // Get error statistics
  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    recentErrors: TrackedError[];
  } {
    const errorsByType: Record<string, number> = {};

    this.errors.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
    });

    return {
      totalErrors: this.errors.length,
      errorsByType,
      recentErrors: this.errors.slice(0, 10)
    };
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, additionalData?: any): void {
    const performanceData = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      additionalData: additionalData || {}
    };

    this.sendPerformanceToAnalytics(performanceData);
  }

  // Send performance data to analytics
  private async sendPerformanceToAnalytics(data: any): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'production') {
        // Send to analytics endpoint
        // await fetch('/api/analytics/performance', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
      }
    } catch (error) {
      console.warn('Failed to send performance data:', error);
    }
  }

  // Clear error history
  clearErrors(): void {
    this.errors = [];
  }
}

// Export singleton instance
export const errorTracking = ErrorTrackingService.getInstance();

// Helper function to track errors easily
export function trackError(error: Error | string, additionalData?: any): void {
  const errorObj = error instanceof Error ? error : new Error(error);

  errorTracking.trackError({
    message: errorObj.message,
    stack: errorObj.stack,
    type: 'manual_error',
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    additionalData
  });
}

// Helper function to track events
export function trackEvent(eventName: string, data?: any): void {
  errorTracking.trackEvent(eventName, data);
}

// Performance tracking helper
export function trackPerformance(metric: string, value: number, additionalData?: any): void {
  errorTracking.trackPerformance(metric, value, additionalData);
}