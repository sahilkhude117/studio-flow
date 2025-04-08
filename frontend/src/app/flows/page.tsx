'use client'
import React from 'react';
import Link from 'next/link';
import { PlusCircle, GitBranch, Mail, MessageSquare, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/FlowCard';
import { EmptyState } from '@/components/EmptyState';
import { useFlowContext, Flow } from '@/contexts/FlowContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

const Dashboard = () => {
  const { flows, toggleFlowStatus, deleteFlow, loading, error } = useFlowContext();
  
  const handleToggleStatus = (id: string) => {
    toggleFlowStatus(id);
    toast.success('Flow status updated successfully');
  };
  
  const handleDelete = (id: string) => {
    deleteFlow(id);
    toast.success('Flow deleted successfully');
  };
  
  const handleDuplicate = (id: string) => {
    const flowToDuplicate = flows.find(flow => flow.id === id);
    if (flowToDuplicate) {
      const newFlow: Omit<Flow, 'id' | 'createdAt' | 'active'> = {
        name: `${flowToDuplicate.name} (Copy)`,
        steps: flowToDuplicate.steps,
      };
      // This is where we would call the addFlow function from context
      // addFlow(newFlow);
      toast.success('Flow duplicated successfully');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    <Loader2Icon className="h-8 w-8 text-primary animate-spin flex items-center justify-center h-screen" />
  }

  if (error) {
    toast.error(`Error: ${error}`)
  }

  return (
    <div className='p-6'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Flows</h1>
        <Button asChild>
          <Link href="/flow/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Flow
          </Link>
        </Button>
      </div>
      {flows.length === 0 ? (
        <EmptyState
          title="No flows yet"
          description="Create your first flow to automate the connection between Mailchimp and SendGrid."
          buttonText="Create Flow"
          buttonLink="/flow/new"
        />
      ) : (
        <div className="bg-white rounded-md border shadow-sm ml-20 mr-20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flows.map((flow) => (
                <TableRow key={flow.id}>
                  <TableCell className="font-medium">
                    <Link href={`/flow/${flow.id}`} className="text-black-600 hover:underline">
                      {flow.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {flow.steps.map((step, index) => (
                        <React.Fragment key={index}>
                          <div className={`p-1.5 rounded-full ${
                            step.service === 'mailchimp' ? 'bg-red-100' : 
                            step.service === 'chatgpt' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <Image
                              src={step.logoUrl}
                              alt='S'
                              width={20}
                              height={20}
                            />
                            
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(flow.createdAt)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={flow.active}
                      onCheckedChange={() => handleToggleStatus(flow.id)}
                      aria-label="Toggle flow status"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/flow/${flow.id}`}>Edit</Link>
                        </DropdownMenuItem>
                       <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(flow.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;