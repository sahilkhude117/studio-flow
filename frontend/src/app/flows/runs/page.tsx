'use client'
import React, { useContext, useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AuthContext, useAuth } from '@/contexts/AuthContext';
import { BACKEND_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';

type Run = {
  id: string;
  flowName: string;
  status: 'success' | 'failed' | 'running';
  timestamp: string;
  duration: string;
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'success':
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-green-700">Success</span>
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center gap-1.5">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium text-red-700">Failed</span>
        </div>
      );
    case 'running':
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
          <span className="text-sm font-medium text-amber-700">Running</span>
        </div>
      );
    default:
      return null;
  }
};

const Runs = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const router = useRouter()
  const currentToken = localStorage.getItem('token')

  if (!currentToken) {
    router.push('/sign-in')
    return;
  }

  
  useEffect(() => {
    fetchFlowRuns();
  }, [statusFilter, timeFilter]);

  const fetchFlowRuns = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/flow-runs/?status=${statusFilter}&time=${timeFilter}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch flow runs');
      }

      const data = await response.json();
      setRuns(data);
      setError(null);
    } catch(err) {
      setError('Error fetching flow runs. Please try again.');
      console.error('Error fetching flow runs:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleViewDetails = (runId: string) => {
    router.push(`/flows/runs/${runId}`)
  };

    const timeFilterLabels = {
      '24h': 'Last 24 hours',
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
    };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flow Runs</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                // You could implement a dropdown here
                // For now we'll just cycle through options
                const options = ['24h', '7d', '30d'];
                const currentIndex = options.indexOf(timeFilter);
                const nextIndex = (currentIndex + 1) % options.length;
                setTimeFilter(options[nextIndex]);
              }}
            >
              <Calendar className="h-4 w-4" />
              <span>{timeFilterLabels[timeFilter as keyof typeof timeFilterLabels]}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="running">Running</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Flow Executions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading flow runs...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : runs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No flow runs found for the selected filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.flowName}</TableCell>
                    <TableCell>
                      <StatusBadge status={run.status} />
                    </TableCell>
                    <TableCell>{run.timestamp}</TableCell>
                    <TableCell>{run.duration}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(run.id);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Runs;
