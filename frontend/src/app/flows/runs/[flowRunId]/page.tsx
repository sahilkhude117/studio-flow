'use client'
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BACKEND_URL } from '@/lib/config';
import { AuthContext, useAuth } from '@/contexts/AuthContext';
import { ActionExecution, FlowStatus, FlowRun } from '@/lib/types';

interface StatusBadgeProps {
    status: FlowStatus;
  }

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'success':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="h-4 w-4 mr-1" />
          Success
        </Badge>
      );
    case 'failed':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="h-4 w-4 mr-1" />
          Failed
        </Badge>
      );
    case 'running':
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          <Clock className="h-4 w-4 mr-1 animate-pulse" />
          Running
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <AlertCircle className="h-4 w-4 mr-1" />
          Unknown
        </Badge>
      );
  }
};

interface ActionExecutionCardProps {
    execution: ActionExecution;
}

const ActionExecutionCard: React.FC<ActionExecutionCardProps> = ({ execution }) => {
  // Format timestamps
  const formatTime = (timestamp:any) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusType = (status: string): FlowStatus => {
    if (status === 'completed') return 'success';
    if (status === 'failed') return 'failed';
    return 'running';
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{execution.actionName}</CardTitle>
          <StatusBadge status={getStatusType(execution.status)}/>
        </div>
        <CardDescription>
          Started at {formatTime(execution.started_at)}
          {execution.completed_at && ` • Completed at ${formatTime(execution.completed_at)}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="result">
            <AccordionTrigger>
              <span className="text-sm font-medium">Result Data</span>
            </AccordionTrigger>
            <AccordionContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(execution.result, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

const FlowRunDetail: React.FC = () => {
  const { flowRunId } = useParams();
  const router = useRouter()
  const [flowRun, setFlowRun] = useState<FlowRun | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentToken = localStorage.getItem('token')

  if (!currentToken) {
    router.push('/sign-in')
    return;
  }

  useEffect(() => {
    const fetchFlowRunDetail = async () => {
      
      if (!flowRunId) return;
      setLoading(true);

      try {
        // First try to find it in local storage cache
        const cachedRunsStr = localStorage.getItem('cachedFlowRuns');
        const cachedRuns = cachedRunsStr ? JSON.parse(cachedRunsStr) : [];
        //@ts-ignore
        const cachedRun = cachedRuns.find(run => run.id === id);

        // If cached but running or we need to get full details, fetch from API
        if (!cachedRun || cachedRun.status === 'running') {
          const response = await fetch(`${BACKEND_URL}/api/flow-runs/${flowRunId}/`, {
            headers: {
              'Content-Type': 'application/json',
               Authorization: `Bearer ${currentToken}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch flow run details: ${response.statusText}`);
          }

          const data = await response.json();
          setFlowRun(data);
        } else {
          // Use cached data to quickly show basics (will be replaced with API data)
          setFlowRun(cachedRun);
          
          // Then fetch the full details
          const response = await fetch(`${BACKEND_URL}/api/flow-runs/${flowRunId}/`);
          if (response.ok) {
            const data = await response.json();
            setFlowRun(data);
          }
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching flow run details:', err);
        setError('Failed to load flow run details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlowRunDetail();
  }, [flowRunId]);

  // Refresh data every 5 seconds if flow is running
  useEffect(() => {
    if (!flowRunId) return;
    //@ts-ignore
    if (flowRun && flowRun.status === 'running') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/flow-runs/${flowRunId}/`);
          if (response.ok) {
            const data = await response.json();
            setFlowRun(data);
            
            // Stop polling if no longer running
            if (data.status !== 'running') {
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error('Error polling flow run status:', err);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [flowRun, flowRunId]);

  if (loading && !flowRun) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2">Loading flow run details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => router.push('/flows/runs')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Runs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!flowRun) {
    return (
      <div className="p-8">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <p className="text-amber-700">Flow run not found</p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => router.push('/flows/runs')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Runs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
          onClick={() => router.push('/flows/runs')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Runs
        </Button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{flowRun.flowName}</h1>
          <StatusBadge status={flowRun.status} />
        </div>
        
        <div className="text-gray-500 mt-1 text-sm">
          {flowRun.timestamp} • Duration: {flowRun.duration}
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Actions Execution</CardTitle>
              <CardDescription>Detailed progress of each action in this flow run</CardDescription>
            </CardHeader>
            <CardContent>
              {flowRun.actionExecutions && flowRun.actionExecutions.length > 0 ? (
                <div>
                  {flowRun.actionExecutions
                    .sort((a, b) => 
                        new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
                      )
                    .map((execution:any) => (
                      <ActionExecutionCard key={execution.id} execution={execution} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No action executions found for this flow run.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Run Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ID</h3>
                  <p className="mt-1 text-sm font-mono">{flowRun.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Started</h3>
                  <p className="mt-1 text-sm">{new Date(flowRun.created_at).toLocaleString()}</p>
                </div>
                
                {flowRun.completed_at && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                    <p className="mt-1 text-sm">{new Date(flowRun.completed_at).toLocaleString()}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-sm capitalize">{flowRun.status}</p>
                </div>
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="metadata">
                    <AccordionTrigger>
                      <span className="text-sm font-medium">Metadata</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                        {JSON.stringify(flowRun.metadata, null, 2)}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {flowRun.executionResults && Object.keys(flowRun.executionResults).length > 0 && (
                    <AccordionItem value="execution-results">
                      <AccordionTrigger>
                        <span className="text-sm font-medium">Execution Results</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                          {JSON.stringify(flowRun.executionResults, null, 2)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlowRunDetail;