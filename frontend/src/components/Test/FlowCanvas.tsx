'use client'
import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NodeSelector, SelectionData } from './NodeSelector';  // Update import for SelectionData
import { useFlowContext } from '@/contexts/FlowContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';

type FlowCanvasProps = {
  flowId?: string;
  isNew?: boolean;
  onConfigOpen?: (type: string, actionName?: string) => void;  // Updated to include actionName
};

type FlowStep = {
  type: 'trigger' | 'action';
  service: string;
  actionName?: string;  // Added to store the specific action name
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
      service: step.service,
      actionName: step.actionName,  // Added this field
      logoUrl: step.logoUrl || "",
      displayName: step.displayName || step.service,
      description: step.description || ""
    })) || []
  ));
  
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionInsertIndex, setActionInsertIndex] = useState<number | null>(null);

  const handleAddTrigger = (selectionData: SelectionData) => {
    setFlowSteps([{
      type: 'trigger',
      service: selectionData.pieceName,
      logoUrl: selectionData.logoUrl,
      displayName: selectionData.displayName,
      description: selectionData.description
    }]);
    setShowTriggerModal(false);
    if (onConfigOpen) onConfigOpen(selectionData.pieceName);
  };

  const handleAddAction = (selectionData: SelectionData, index: number) => {
    const newSteps = [...flowSteps];
    
    const newAction = {
      type: 'action' as const,
      service: selectionData.pieceName,
      actionName: selectionData.actionName,  // Store the specific action name
      logoUrl: selectionData.logoUrl,
      displayName: selectionData.displayName,
      description: selectionData.description
    };
    
    if (index === flowSteps.length) {
      newSteps.push(newAction);
    } else {
      newSteps.splice(index + 1, 0, newAction);
    }
    
    setFlowSteps(newSteps);
    setShowActionModal(false);
    if (onConfigOpen) onConfigOpen(selectionData.pieceName, selectionData.actionName);
  };

  const handleOpenActionModal = (index: number) => {
    setActionInsertIndex(index);
    setShowActionModal(true);
  };

  const getStepColor = (step: FlowStep) => {
    if (step.type === 'trigger') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100'
      };
    }
    
    // Add more service-specific colors here
    switch (step.service) {
      case 'openai':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100'
        };
      case 'slack':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          iconBg: 'bg-purple-100'
        };
      case 'googleSheets':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          iconBg: 'bg-emerald-100'
        };
      case 'airtable':
        return {
          bg: 'bg-teal-50',
          border: 'border-teal-200',
          iconBg: 'bg-teal-100'
        };
      case 'sendgrid':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          iconBg: 'bg-indigo-100'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100'
        };
    }
  };

  return (
  <div>
    <div className="flow-canvas p-8 min-h-[800px] bg-gray-50 rounded-lg">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Trigger Node */}
        {flowSteps.length === 0 ? (
          <Button 
            variant="outline" 
            className="mb-8 w-64 h-24 border-dashed border-2 flex flex-col items-center justify-center gap-2 bg-white shadow-sm hover:shadow-md transition-all"
            onClick={() => setShowTriggerModal(true)}
          >
            <Plus className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">Select a trigger</span>
            <span className="text-xs text-muted-foreground">What starts your flow?</span>
          </Button>
        ) : (
          <div 
            className={`mb-8 w-64 py-5 px-6 ${getStepColor(flowSteps[0]).bg} ${getStepColor(flowSteps[0]).border} rounded-lg flex flex-col items-center cursor-pointer shadow-sm hover:shadow-md transition-all`}
            onClick={() => { 
              setShowTriggerModal(true);
              if (onConfigOpen) onConfigOpen(flowSteps[0].service);
            }}
          >
            <div className={`w-12 h-12 ${getStepColor(flowSteps[0]).iconBg} rounded-full flex items-center justify-center mb-3`}>
              <Image
                src={flowSteps[0].logoUrl}
                alt={flowSteps[0].displayName}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="font-medium text-sm">{flowSteps[0].displayName}</span>
            <span className="text-xs text-muted-foreground text-center mt-1">{flowSteps[0].description}</span>
          </div>
        )}

        {/* Render each step with connectors */}
        {flowSteps.map((step, index) => {
          if (index === 0) return null; // Skip the first step (trigger) as it's handled above

          const isLastStep = index === flowSteps.length - 1;
          const colors = getStepColor(step);
          
          // Connector before the step
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center mb-4">
                <div className="w-px h-10 bg-gray-300"></div>
                <div className="bg-white border border-gray-200 text-gray-700 rounded-full p-1 shadow-sm">
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
              </div>
              
              {/* The step itself */}
              <div 
                className={`mb-8 w-64 py-5 px-6 ${colors.bg} ${colors.border} rounded-lg flex flex-col items-center cursor-pointer shadow-sm hover:shadow-md transition-all`}
                onClick={() => {
                  if (onConfigOpen) onConfigOpen(step.service, step.actionName);
                }}
              >
                <div className={`w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center mb-3`}>
                  <Image
                    src={step.logoUrl}
                    alt={step.displayName}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-sm">{step.displayName}</span>
                <span className="text-xs text-muted-foreground text-center mt-1">{step.description}</span>
              </div>
              
              {/* Add "+" button after the step if it's the last one */}
              {isLastStep && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full mb-8 shadow-sm hover:shadow-md"
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
            <div className="flex flex-col items-center mb-4">
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="bg-white border border-gray-200 text-gray-700 rounded-full p-1 shadow-sm">
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-64 h-24 border-dashed border-2 flex flex-col items-center justify-center gap-2 bg-white shadow-sm hover:shadow-md transition-all"
              onClick={() => handleOpenActionModal(0)}
            >
              <Plus className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Add an action</span>
              <span className="text-xs text-muted-foreground">What should happen next?</span>
            </Button>
          </>
        )}
      </div>

      {/* Trigger Selection Dialog */}
      <Dialog open={showTriggerModal} onOpenChange={setShowTriggerModal}>
        <DialogContent className="w-[700px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Select a Trigger</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <NodeSelector 
              type="trigger"
              onSelect={handleAddTrigger}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Selection Dialog */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="w-[700px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Select an Action</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <NodeSelector 
              type="action"
              onSelect={(selectionData) => {
                if (actionInsertIndex !== null) {
                  handleAddAction(selectionData, actionInsertIndex);
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