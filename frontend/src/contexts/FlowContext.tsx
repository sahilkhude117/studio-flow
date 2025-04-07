'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchFlows, toggleFlowStatus as toggleFlowApi, deleteFlow as deleteFlowApi } from '@/lib/api/flowApi';
import { AuthContext } from './AuthContext';


export type Flow = {
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
  steps: {
    type: 'trigger' | 'action';
    service: string;
    logoUrl: string;
    config: Record<string, any>;
  }[];
};

type FlowContextType = {
  flows: Flow[];
  selectedFlow: Flow | null;
  addFlow: (flow: Omit<Flow, 'id' | 'createdAt' | 'active'>) => void;
  updateFlow: (id: string, updates: Partial<Omit<Flow, 'id' | 'createdAt'>>) => void;
  deleteFlow: (id: string) => void;
  selectFlow: (id: string | null) => void;
  toggleFlowStatus: (id: string) => void;
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
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && token) {
      (async () => {
        const data = await fetchFlows();
        setFlows(data);
      })();
    } else {
      // Reset flows when logged out
      setFlows([]);
    }
  }, [isAuthenticated, token]);

  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  const addFlow = (flow: Omit<Flow, 'id' | 'createdAt' | 'active'>) => {
    const newFlow = {
      ...flow,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      active: true,
    };
    setFlows((prev) => [...prev, newFlow]);
  };

  const updateFlow = (id: string, updates: Partial<Omit<Flow, 'id' | 'createdAt'>>) => {
    setFlows((prev) =>
      prev.map((flow) => (flow.id === id ? { ...flow, ...updates } : flow))
    );
    
    if (selectedFlow?.id === id) {
      setSelectedFlow((prev) => prev ? { ...prev, ...updates } : null);
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
    updateFlow,
    deleteFlow,
    selectFlow,
    toggleFlowStatus,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
