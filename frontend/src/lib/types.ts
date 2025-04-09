// types.ts

// Status types
export type FlowStatus = 'success' | 'failed' | 'running';
export type DatabaseStatus = 'completed' | 'failed' | 'processing' | 'pending';
export type ActionExecutionStatus = 'pending' | 'completed' | 'failed';

// Action execution type
export interface ActionExecution {
  id: string;
  actionName: string;
  status: ActionExecutionStatus;
  started_at: string;
  completed_at: string | null;
  result: Record<string, any>;
}

// Flow run type
export interface FlowRun {
  id: string;
  flowName: string;
  status: FlowStatus;
  timestamp: string;
  duration: string;
  created_at: string;
  completed_at: string | null;
  metadata: Record<string, any>;
  executionResults: Record<string, any>;
  actionExecutions: ActionExecution[];
}

// For API response types
export interface FlowRunListResponse {
  data: FlowRun[];
}

export interface FlowRunDetailResponse {
  data: FlowRun;
}

// Error response type
export interface ApiError {
  error: string;
  status?: number;
  message?: string;
}