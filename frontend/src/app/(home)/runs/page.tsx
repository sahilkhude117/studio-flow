
import React from 'react';
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
  const runs: Run[] = [
    {
      id: '1',
      flowName: 'New Subscriber Welcome',
      status: 'success',
      timestamp: '2023-05-15 14:32:45',
      duration: '1.2s',
    },
    {
      id: '2',
      flowName: 'Customer Onboarding',
      status: 'failed',
      timestamp: '2023-05-15 13:18:22',
      duration: '3.5s',
    },
    {
      id: '3',
      flowName: 'New Subscriber Welcome',
      status: 'running',
      timestamp: '2023-05-15 15:01:05',
      duration: '...',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flow Runs</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Last 24 hours</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Select defaultValue="all">
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
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Runs;
