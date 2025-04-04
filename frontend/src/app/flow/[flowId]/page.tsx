'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlowCanvas } from '@/components/FlowCanvas';
import { ConfigPanel } from '@/components/ConfigPanel';
import { toast } from 'sonner';
import { useFlowContext } from '@/contexts/FlowContext';

const FlowEditor = () => {
  const { flowId } = useParams();
  const router = useRouter();
  const { addFlow, flows, updateFlow } = useFlowContext();
  const isNew = flowId === 'new';
  
  // Get existing flow data if editing
  const existingFlow = !isNew ? flows.find(flow => flow.id === flowId) : null;
  
  const [flowName, setFlowName] = useState(isNew ? 'Untitled Flow' : (existingFlow?.name || 'My Flow'));
  const [showConfig, setShowConfig] = useState(false);
  const [configType, setConfigType] = useState<'mailchimp' | 'sendgrid' | 'chatgpt'>('mailchimp');
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [flowSteps, setFlowSteps] = useState<Array<{
    type: 'trigger' | 'action';
    service: 'mailchimp' | 'sendgrid' | 'chatgpt';
    config: Record<string, any>;
  }>>(existingFlow?.steps || []);
  
  const [stepConfigs, setStepConfigs] = useState<Record<string, any>>({
    mailchimp: { apiKey: '', audienceId: '' },
    chatgpt: { prompt: '', outputVariable: '' },
    sendgrid: { apiKey: '', fromEmail: '', templateId: '' }
  });

  // Handle config panel opening
  const handleConfigOpen = (type: 'mailchimp' | 'sendgrid' | 'chatgpt') => {
    setConfigType(type);
    setShowConfig(true);
  };

  const handleSave = () => {
    // Create the flow object
    const flow = {
      name: flowName,
      steps: flowSteps.length > 0 ? flowSteps : [
        {
          type: 'trigger' as const,
          service: 'mailchimp' as const,
          config: stepConfigs.mailchimp
        },
        // Add more steps based on UI selections
      ]
    };
    
    if (isNew) {
      addFlow(flow);
      toast.success('Flow created successfully!');
      router.push('/'); // Redirect to the dashboard after saving
    } else if (flowId) { //@ts-ignore
      updateFlow(flowId, flow);
      toast.success('Flow updated successfully!');
      router.push('/'); // Redirect to the dashboard after updating
    }
  };

  const handleTest = () => {
    // Simulate testing the flow
    toast.success('Flow tested successfully!');
  };

  const handleConfigSave = (config: Record<string, any>) => {
    // Save configuration for the current service type
    setStepConfigs(prev => ({
      ...prev,
      [configType]: config
    }));
    
    // Update flow steps with new config
    setFlowSteps(prev => {
      if (currentStep !== null && prev[currentStep]) {
        const newSteps = [...prev];
        newSteps[currentStep] = {
          ...newSteps[currentStep],
          config
        };
        return newSteps;
      }
      return prev;
    });
    
    toast.success('Configuration saved');
    setShowConfig(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
          <div className="h-5 w-px bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <Input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-72 font-medium text-lg h-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTest} 
            className="flex items-center gap-1"
            disabled={flowSteps.length < 2} // Require at least trigger + action
          >
            <PlayCircle className="h-4 w-4" />
            Test
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            className="flex items-center gap-1"
            disabled={!flowName.trim()} // Require flow name
          >
            <Save className="h-4 w-4" />
            Save Flow
          </Button>
        </div>
      </div>

      {/* Main Content - Make it scrollable */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <FlowCanvas //@ts-ignore
            flowId={flowId} 
            isNew={isNew}
            onConfigOpen={handleConfigOpen}
          />
        </div>
        
        {showConfig && (
          <ConfigPanel
            type={configType}
            onClose={() => setShowConfig(false)}
            onSave={handleConfigSave}
          />
        )}
      </div>
    </div>
  );
};

export default FlowEditor;