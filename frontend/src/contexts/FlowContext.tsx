'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toggleFlowStatus as toggleFlowApi, deleteFlow as deleteFlowApi } from '@/lib/api/flowApi';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { serviceIds } from '@/components/ConfigPanel';


export type Flow = {
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
  steps: FlowStep[]
};

export type FlowStep = {
  type: 'trigger' | 'action';
  service: string;
  logoUrl: string;
  config: Record<string, any>;
}

type DraftFLow = {
  name: string;
  active: boolean;
  triggerId: string;
  triggerConfig: Record<string, any>;
  actions: Actions[]
}

type Actions = {
  actionId: string;
  config: Record<string, any>;
}

type FlowContextType = {
  flows: Flow[];
  selectedFlow: Flow | null;
  addFlow: (flow: DraftFLow) => Promise<Flow>;
  updateFlow: (id: string, flow: Partial<DraftFLow>) => Promise<Flow>;
  deleteFlow: (id: string) => void;
  selectFlow: (id: string | null) => void;
  toggleFlowStatus: (id: string) => void;
  loading: boolean;
  error: string | null;
  draftFlow: DraftFLow;
  updateDraftFlowName: (name: string) => void;
  updateDraftFlowActions: ( actionId: string, actionConfig: Record<string, any>) => void;
  updateDraftFlowActive: (active: boolean) => void;
  updateDraftFlowTrigger: (triggerId: string, triggerConfig: Record<string, any>) => void;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowProvider');
  }
  return context;
};



export const FlowProvider = ({ children }: { children: ReactNode }) => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [draftFlow, setDraftFlow] = useState<DraftFLow>({
    name: 'Untitled',
    active: false,
    triggerId: '',
    triggerConfig: {},
    actions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useContext(AuthContext);
  const router = useRouter()

  const updateDraftFlowName = (name: string) => {
    setDraftFlow((prevDraft) => ({ ...prevDraft, name}))
  }

  const updateDraftFlowActive = (isActive: boolean) => {
    setDraftFlow((prevDraft) => ({ ...prevDraft, isActive}))
  } 
 
  const updateDraftFlowActions = (actionId: string, actionConfig: Record<string, any>) => {
    if (actionId === 'chatgpt') {
      actionId = serviceIds.chatgpt
    } else if (actionId === 'sendgrid') {
      actionId = serviceIds.sendgrid
    }
    setDraftFlow((prevDraft) => {
      const actionExists = prevDraft.actions.some(action => action.actionId === actionId);
  
      if (actionExists) {
        // Update the existing action
        return {
          ...prevDraft,
          actions: prevDraft.actions.map((action) =>
            action.actionId === actionId
              ? { ...action, config: actionConfig }
              : action
          ),
        };
      } else {
        // Add a new action
        return {
          ...prevDraft,
          actions: [
            ...prevDraft.actions,
            { actionId, config: actionConfig },
          ],
        };
      }
    });
  };
    

  const updateDraftFlowTrigger = (triggerId: string, triggerConfig: Record<string, any>) => {
    if (triggerId === 'mailchimp') {
      triggerId = serviceIds.mailchimp
    }
    setDraftFlow((prevDraft) => ({
      ...prevDraft,
      triggerId,
      triggerConfig,
    }));
  };

  const fetchFlows = async (): Promise<Flow[]> => {
    if (!isAuthenticated) {
      return [];
    }
    
    if (!token) {
      return[]
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/flow/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const fetchedFlows = response.data;
      setFlows(fetchedFlows);
      setLoading(false);
      return fetchedFlows;
    } catch (error) {
      console.error('Error fetching flows:', error);
      setError('Failed to fetch flows');
      setLoading(false);
      return [];
    }
  }

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFlows();
    } else {
      setFlows([]);
    }
  }, [isAuthenticated, token]);

  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  const addFlow = async (flow: DraftFLow): Promise<Flow> => {
    if (!isAuthenticated || !token) {
      setError('Not Authenticated')
      toast.error('User not authenticated')
      router.push('/sign-in')
    }

    setLoading(true);
    setError(null)

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/flow/`,flow, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const newFlow = response.data;
      setFlows(prevFlows => [...prevFlows, newFlow]);
      setLoading(false);
      return newFlow;
    } catch (error) {
      console.error('Error adding flow:', error);
      toast.error('Failed to add flow')
      setError('Failed to add flow');
      setLoading(false);
      throw error;
    }
  }


  const updateFlow = async (id: string, flow: Partial<DraftFLow>): Promise<Flow> => {
    if (!isAuthenticated || !token) {
      throw new Error('Not authenticated');
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${BACKEND_URL}/api/v1/flow/${id}/`, flow, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const updatedFlow = response.data;
      setFlows(prevFlows => 
        prevFlows.map(f => f.id === id ? updatedFlow : f)
      );
      
      setLoading(false);
      return updatedFlow;
    } catch (error) {
      console.error(`Error updating flow ${id}:`, error);
      setError('Failed to update flow');
      setLoading(false);
      throw error;
    }
  };

  const deleteFlow = async (id: string) => {
    await deleteFlowApi(id);
    setFlows((prev) => prev.filter((flow) => flow.id !== id));
    if (selectedFlow?.id === id) {
      setSelectedFlow(null);
    }
  };

  const selectFlow = (id: string | null) => {
    if (id === null) {
      setSelectedFlow(null);
      return;
    }
    
    const flow = flows.find((flow) => flow.id === id);
    if (flow) {
      setSelectedFlow(flow);
    }
  };

  const toggleFlowStatus = async (id: string) => {
    const updated = await toggleFlowApi(id);

    setFlows((prev) =>
      prev.map((flow) =>
        flow.id === id ? { ...flow, active: updated.active } : flow
      )
    );
    
    if (selectedFlow?.id === id) {
      setSelectedFlow((prev) => prev ? { ...prev, active: !prev.active } : null);
    }
  };

  const value = {
    flows,
    selectedFlow,
    addFlow,
    error,
    loading,
    updateFlow,
    deleteFlow,
    selectFlow,
    toggleFlowStatus,
    draftFlow,
    updateDraftFlowName,
    updateDraftFlowActions,
    updateDraftFlowActive,
    updateDraftFlowTrigger,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};