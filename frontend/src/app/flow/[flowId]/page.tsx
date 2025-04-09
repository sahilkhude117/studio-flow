'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, PlayCircle, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlowCanvas } from '@/components/FlowCanvas';
import { ConfigPanel, serviceIds } from '@/components/ConfigPanel';
import { toast } from 'sonner';
import { useFlowContext } from '@/contexts/FlowContext';

const FlowEditor = () => {
  const { flowId } = useParams();
  const router = useRouter();
  const { 
    addFlow, 
    updateFlow,
    flows,
    selectFlow,
    selectedFlow,
    loading,
    error,
    draftFlow,
    updateDraftFlowName,
    updateDraftFlowActions,
    updateDraftFlowTrigger,
    updateDraftFlowActive
  } = useFlowContext();
  const isNew = flowId === 'new';
  
  const existingFlow = !isNew ? flows.find(flow => flow.id === flowId) : null;

  useEffect(() => {
    setDraft()
  },[])

  const setDraft = () => {
    if (existingFlow) {
      updateDraftFlowName(existingFlow.name)
      updateDraftFlowActive(existingFlow.active)
  
      existingFlow.steps.forEach(step => {
        const { type, service, config } = step;
  
        if (service === 'chatgpt') {
          const serviceId = serviceIds.chatgpt
        } else if (service === 'mailchimp'){
          const serviceId = serviceIds.mailchimp
        } else if ( service === 'sendgrid') {
          const serviceId = serviceIds.sendgrid
        }
        
        if (type === 'trigger') {
          const serviceId = serviceIds.mailchimp;
          updateDraftFlowTrigger(serviceId, config);
        } else if (type === 'action') {
          updateDraftFlowActions(service, config)
        }
      })
    }
  }
  

  const [flowName, setFlowName] = useState(isNew ? 'Untitled Flow' : (existingFlow?.name || 'My Flow'));
  const [showConfig, setShowConfig] = useState(false);
  const [configType, setConfigType] = useState<'mailchimp' | 'sendgrid' | 'chatgpt'>('mailchimp');
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [flowSteps, setFlowSteps] = useState<Array<{
    type: 'trigger' | 'action';
    service: string;
    logoUrl: string;
    config: Record<string, any>;
  }>>([]);
  
  const [stepConfigs, setStepConfigs] = useState<Record<string, any>>({
    mailchimp: { apiKey: '', audienceId: '' },
    chatgpt: { prompt: '', outputVariable: '' },
    sendgrid: { apiKey: '', fromEmail: '', templateId: '' }
  });

  const handleConfigOpen = (type: 'mailchimp' | 'sendgrid' | 'chatgpt', stepIndex: number) => {
    setConfigType(type);
    setCurrentStep(stepIndex);
    setShowConfig(true);
  };

  const handleSave = async () => {
    await updateDraftFlowName(flowName);
    await updateDraftFlowActive(true);
    // Create the flow object
    const flow = draftFlow;

    
    if (!draftFlow.triggerId) {
      setDraft()
      toast.error('Please Select Trigger')
      return;
    }
    if (!draftFlow.name) {
      toast.error("Please enter valid name")
      return;
    }
    if(draftFlow.actions.length < 1) {
      toast.error('Please select atleast one action')
      return;
    }
    
    try {
      if (isNew) {
        await addFlow(flow);
        toast.success('Flow created successfully!');
      } else if (flowId) {
        await updateFlow(flowId as string, flow);
        toast.success('Flow updated successfully!');
      }
      router.push('/flows'); // Redirect to the dashboard after saving
    } catch (error) {
      console.error('Error saving flow:', error);
      toast.error('Failed to save flow');
    }
  };

  const handleTest = () => {
    // Simulate testing the flow
    toast.success('Flow tested successfully!');
  };

  const handleConfigSave = (type: 'trigger'| 'action' , serviceId: string , config: Record<string, any>) => {

    setStepConfigs(prev => ({
      ...prev,
      [configType]: config
    }));

    if (type === 'trigger') {
      updateDraftFlowTrigger(serviceId, config)
    } else if (type === 'action') {
      updateDraftFlowActions(serviceId, config)
    }
    
    if (currentStep !== null) {
      setFlowSteps(prev => {
        const newSteps = [...prev];
        if (newSteps[currentStep]) {
          newSteps[currentStep] = {
            ...newSteps[currentStep],
            config
          };
        } else {
          // Create a new step if it doesn't exist
          newSteps[currentStep] = {
            type: currentStep === 0 ? 'trigger' : 'action',
            service: configType,
            logoUrl: "", // You might want to set this based on the service
            config
          };
        }
        return newSteps;
      });
    }
    toast.success('Configuration saved');
    setShowConfig(false);
  };

  if (loading && !isNew) {
    return <div>
      <Loader2Icon className="h-8 w-8 text-primary animate-spin flex items-center justify-center h-screen w-screen" />
    </div>
    
  }

  if (error && !isNew) {
    toast.error(`Error: ${error}`)
  }

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
          <FlowCanvas
            flowId={flowId as string} 
            isNew={isNew} //@ts-ignore
            onConfigOpen={handleConfigOpen}
          />
        </div>
        
        {showConfig && (
          <ConfigPanel
          type={configType}
          initialConfig={currentStep !== null && flowSteps[currentStep]?.config 
            ? flowSteps[currentStep].config 
            : stepConfigs[configType]}
          onClose={() => setShowConfig(false)}
          onSave={handleConfigSave}
          flow={existingFlow}
          />
        )}
      </div>
    </div>
  );
};

export default FlowEditor;