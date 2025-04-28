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
import { ReactFlow, Background } from '@xyflow/react';
import { NodeSelector } from './NodeSelector';
import { useFlowContext, Flow } from '@/contexts/FlowContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';

type FlowCanvasProps = {
  flowId?: string;
  isNew?: boolean;
  onConfigOpen?: (type: string) => void;
};

type ServiceType = 'webhook' | 'sendgrid' | 'openai' | 'slack' | 'airtable' | 'googleSheets';

type FlowStep = {
  type: 'trigger' | 'action';
  service: ServiceType;
  logoUrl: string;
  displayName: string;
  description?: string;
};

export const FlowCanvas = ({ flowId, isNew = false, onConfigOpen }: FlowCanvasProps) => {
  const router = useRouter();
  const { addFlow, flows, updateFlow, updateDraftFlowTrigger } = useFlowContext();
  
  const existingFlow = !isNew ? flows.find(flow => flow.id === flowId) : null;

  const [flowSteps, setFlowSteps] = useState<FlowStep[]>(isNew ? [] : (
    existingFlow?.steps.map(step => ({
      type: step.type,
      service: step.service as ServiceType,
      logoUrl: step.logoUrl,
      displayName: step.service,
      description: ""
    })) || []
  ));
  
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionInsertIndex, setActionInsertIndex] = useState<number | null>(null);

  const getDisplayName = (service: ServiceType) => {
    switch (service) {
      case 'webhook':
        return 'Webhook';
      case 'sendgrid':
        return 'SendGrid';
      case 'openai':
        return 'OpenAI';
      case 'slack':
        return 'Slack';
      case 'airtable':
        return 'Airtable';
      case 'googleSheets':
        return 'Google Sheets';
      default:
        return "Unknown";
    }
  };

  const getLogo = (service: ServiceType) => {
    switch (service) {
      case 'webhook':
        return 'https://cdn.activepieces.com/pieces/webhook.svg';
      case 'sendgrid':
        return 'https://cdn.activepieces.com/pieces/sendgrid.png';
      case 'openai':
        return 'https://cdn.activepieces.com/pieces/openai.png';
      case 'slack':
        return 'https://cdn.activepieces.com/pieces/slack.png';
      case 'airtable':
        return 'https://cdn.activepieces.com/pieces/airtable.png';
      case 'googleSheets':
        return 'https://cdn.activepieces.com/pieces/google-sheets.png';
      default:
        return '';
    }
  };

  const getDescription = (service: ServiceType) => {
    switch (service) {
      case 'webhook':
        return 'Catch a webhook';
      case 'sendgrid':
        return 'Send a text or HTML email';
      case 'openai':
        return 'Ask ChatGPT anything you want!';
      case 'slack':
        return 'Send Message To A Channel';
      case 'airtable':
        return 'Adds a record into an airtable';
      case 'googleSheets':
        return 'Append a row of values to an existing sheet';
      default:
        return '';
    }
  };

  const getStepStyles = (service: ServiceType) => {
    switch (service) {
      case 'webhook':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100'
        };
      case 'openai':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100'
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const handleAddTrigger = (service: ServiceType) => {
    setFlowSteps([{
      type: 'trigger',
      service,
      logoUrl: getLogo(service),
      displayName: getDisplayName(service),
      description: getDescription(service)
    }]);
    setShowTriggerModal(false);
    if (onConfigOpen) onConfigOpen(service);
  };

  const handleAddAction = (service: ServiceType, index: number) => {
    const newSteps = [...flowSteps];
    
    const newAction = {
      type: 'action' as const,
      service,
      logoUrl: getLogo(service),
      displayName: getDisplayName(service),
      description: getDescription(service)
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
            className={`mb-8 w-60 py-4 px-6 ${getStepStyles(flowSteps[0].service).bgColor} border ${getStepStyles(flowSteps[0].service).borderColor} rounded-lg flex flex-col items-center cursor-pointer`}
            onClick={() => { 
              setShowTriggerModal(true);
              if (onConfigOpen) onConfigOpen(flowSteps[0].service);
            }}
          >
            <div className={`w-10 h-10 ${getStepStyles(flowSteps[0].service).iconBg} rounded-full flex items-center justify-center mb-2`}>
              <Image
                src={flowSteps[0].logoUrl}
                alt={flowSteps[0].service}
                width={20}
                height={20}
              />
            </div>
            <span className="font-medium text-sm">{flowSteps[0].displayName}</span>
            <span className="text-xs text-muted-foreground">{flowSteps[0].description}</span>
          </div>
        )}

        {/* Render each step with connectors */}
        {flowSteps.map((step, index) => {
          if (index === 0) return null; // Skip the first step (trigger) as it's handled above

          const isLastStep = index === flowSteps.length - 1;
          const stepStyles = getStepStyles(step.service);
          
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
                className={`mb-8 w-60 py-4 px-6 ${stepStyles.bgColor} border ${stepStyles.borderColor} rounded-lg flex flex-col items-center cursor-pointer`}
                onClick={() => {
                  if (onConfigOpen) onConfigOpen(step.service);
                }}
              >
                <div className={`w-10 h-10 ${stepStyles.iconBg} rounded-full flex items-center justify-center mb-2`}>
                  <Image
                    src={step.logoUrl}
                    alt={step.displayName || step.service}
                    width={20}
                    height={20}
                  />
                </div>
                <span className="font-medium text-sm">{step.displayName}</span>
                <span className="text-xs text-muted-foreground">{step.description}</span>
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
        <DialogContent className="w-[600px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Select a Trigger</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <NodeSelector 
              type="trigger"
              onSelect={handleAddTrigger}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Selection Dialog */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="w-[600px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Select an Action</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <NodeSelector 
              type="action"
              onSelect={(service) => {
                if (actionInsertIndex !== null) {
                  handleAddAction(service, actionInsertIndex);
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