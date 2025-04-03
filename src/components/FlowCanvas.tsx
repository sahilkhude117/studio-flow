'use client'
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReactFlow , Background} from '@xyflow/react';
import { NodeSelector } from './NodeSelector';
import { useFlowContext, Flow } from '@/contexts/FlowContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';

type FlowCanvasProps = {
  flowId?: string;
  isNew?: boolean;
  onConfigOpen?: (type: 'mailchimp' | 'sendgrid' | 'chatgpt') => void;
};

type FlowStep = {
  type: 'trigger' | 'action';
  service: 'mailchimp' | 'sendgrid' | 'chatgpt';
  name: string;
  description: string;
};

export const FlowCanvas = ({ flowId, isNew = false, onConfigOpen }: FlowCanvasProps) => {
  const router = useRouter();
  const { addFlow, flows, updateFlow } = useFlowContext();
  
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>(isNew ? [] : (
    flows.find(f => f.id === flowId)?.steps.map(step => ({
      type: step.type,
      service: step.service,
      name: step.type === 'trigger' ? 'New Subscriber' : 
             step.service === 'chatgpt' ? 'Process with AI' : 'Send Email',
      description: step.type === 'trigger' ? 'Triggered when a new contact is added to an audience' :
                  step.service === 'chatgpt' ? 'Process data with ChatGPT' : 'Sends an email using a template'
    })) || []
  ));
  
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionInsertIndex, setActionInsertIndex] = useState<number | null>(null);

  const handleAddTrigger = (service: 'mailchimp') => {
    setFlowSteps([{
      type: 'trigger',
      service,
      name: 'New Subscriber',
      description: 'Triggered when a new contact is added to an audience'
    }]);
    setShowTriggerModal(false);
    if (onConfigOpen) onConfigOpen('mailchimp');
  };

  const handleAddAction = (service: 'sendgrid' | 'chatgpt', index: number) => {
    const newSteps = [...flowSteps];
    
    const newAction = {
      type: 'action' as const,
      service,
      name: service === 'chatgpt' ? 'Process with AI' : 'Send Email',
      description: service === 'chatgpt' 
        ? 'Process data with ChatGPT' 
        : 'Sends an email using a template'
    };
    
    if (index === flowSteps.length) {
      newSteps.push(newAction);
    } else {
      newSteps.splice(index + 1, 0, newAction);
    }
    
    setFlowSteps(newSteps);
    setShowActionModal(false);
    if (onConfigOpen) onConfigOpen(service);
  };

  const handleOpenActionModal = (index: number) => {
    setActionInsertIndex(index);
    setShowActionModal(true);
  };

  return (
  <div>
    <div className="flow-canvas p-8 min-h-[800px]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Trigger Node */}
        {flowSteps.length === 0 ? (
          <Button 
            variant="outline" 
            className="mb-8 w-60 h-24 border-dashed border-2 flex flex-col items-center justify-center gap-2"
            onClick={() => setShowTriggerModal(true)}
          >
            <span className="text-sm font-medium">Select a trigger</span>
            <span className="text-xs text-muted-foreground">What starts your flow?</span>
          </Button>
        ) : (
          <div 
            className="mb-8 w-60 py-4 px-6 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center cursor-pointer"
            onClick={() => { 
              setShowTriggerModal(true);
              if (onConfigOpen) onConfigOpen('mailchimp');
            }}
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <Image
                src={'https://cdn.activepieces.com/pieces/mailchimp.png'}
                alt='mailchimp'
                width={20}
                height={20}
              />
            </div>
            <span className="font-medium text-sm">Mailchimp</span>
            <span className="text-xs text-muted-foreground">New subscriber</span>
          </div>
        )}

        {/* Render each step with connectors */}
        {flowSteps.map((step, index) => {
          if (index === 0) return null; // Skip the first step (trigger) as it's handled above

          const isLastStep = index === flowSteps.length - 1;
          
          // Connector before the step
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center mb-8">
                <div className="w-px h-10 bg-gray-300"></div>
                <div className="bg-gray-100 text-gray-700 rounded-full p-1">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
              </div>
              
              {/* The step itself */}
              <div 
                className={`mb-8 w-60 py-4 px-6 ${
                  step.service === 'chatgpt' 
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-blue-50 border border-blue-200'
                } rounded-lg flex flex-col items-center cursor-pointer`}
                onClick={() => {
                  if (onConfigOpen) onConfigOpen(step.service);
                }}
              >
                <div className={`w-10 h-10 ${
                  step.service === 'chatgpt' 
                    ? 'bg-green-100' 
                    : 'bg-blue-100'
                } rounded-full flex items-center justify-center mb-2`}>
                  {step.service === 'chatgpt' ? (
                    <Image
                      src={'https://cdn.activepieces.com/pieces/openai.png'}
                      alt='mailchimp'
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Image
                      src={'https://cdn.activepieces.com/pieces/sendgrid.png'}
                      alt='mailchimp'
                      width={20}
                      height={20}
                    />
                  )}
                </div>
                <span className="font-medium text-sm">{step.service === 'chatgpt' ? 'ChatGPT' : 'SendGrid'}</span>
                <span className="text-xs text-muted-foreground">{step.name}</span>
              </div>
              
              {/* Add "+" button after the step if it's the last one */}
              {isLastStep && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full mb-8"
                  onClick={() => handleOpenActionModal(index)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </React.Fragment>
          );
        })}
        
        {/* Add action button if there's a trigger but no actions yet */}
        {flowSteps.length === 1 && (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-px h-10 bg-gray-300"></div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleOpenActionModal(0)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="w-px h-10 bg-gray-300"></div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-60 h-24 border-dashed border-2 flex flex-col items-center justify-center gap-2"
              onClick={() => handleOpenActionModal(0)}
            >
              <span className="text-sm font-medium">Add an action</span>
              <span className="text-xs text-muted-foreground">What should happen next?</span>
            </Button>
          </>
        )}
      </div>

      {/* Trigger Selection Dialog */}
      <Dialog open={showTriggerModal} onOpenChange={setShowTriggerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select a Trigger</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <NodeSelector 
              type="trigger"
              onSelect={() => handleAddTrigger('mailchimp')}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Selection Dialog */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select an Action</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <NodeSelector 
              type="action"
              onSelect={(service) => {
                if (actionInsertIndex !== null) {
                  handleAddAction(service as 'sendgrid' | 'chatgpt', actionInsertIndex);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  );
};