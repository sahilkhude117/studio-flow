
import React from 'react';
import Link from 'next/link';
import { MoreHorizontal, GitBranch, Mail } from 'lucide-react';
import { Flow } from '@/contexts/FlowContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FlowCardProps = {
  flow: Flow;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
};

export const FlowCard = ({ flow, onToggleStatus, onDelete, onDuplicate }: FlowCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/flow/${flow.id}`} className="font-medium text-studio-700 hover:text-studio-800">
          {flow.name}
        </Link>
        <div className="flex items-center gap-2">
          <Switch
            checked={flow.active}
            onCheckedChange={() => onToggleStatus(flow.id)}
            aria-label="Toggle flow status"
          />
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
              <DropdownMenuItem onClick={() => onDuplicate(flow.id)}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete(flow.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {flow.steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="h-px w-4 bg-gray-300" />}
            <div className={`p-1.5 rounded ${
              step.service === 'mailchimp' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {step.type === 'trigger' ? (
                <GitBranch className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Created {formatDate(flow.createdAt)}</span>
        <span>{flow.active ? 'Active' : 'Inactive'}</span>
      </div>
    </div>
  );
};
