
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NodeSelectorProps = {
  type: 'trigger' | 'action';
  onSelect: (service: 'mailchimp' | 'sendgrid' | 'chatgpt') => void;
};

export const NodeSelector = ({ type, onSelect }: NodeSelectorProps) => {
  const mailchimpTriggers = [
    {
      id: 'new_subscriber',
      name: 'New Subscriber',
      description: 'Triggered when a new contact is added to an audience',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      service: 'mailchimp' as const,
    },
    {
      id: 'updated_subscriber',
      name: 'Updated Subscriber',
      description: 'Triggered when a contact is updated in an audience',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      service: 'mailchimp' as const,
    },
  ];

  const actions = [
    {
      id: 'chatgpt_process',
      name: 'Process with ChatGPT',
      description: 'Process data with AI before sending to next step',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V13C15 13.5523 14.5523 14 14 14H10C9.44772 14 9 13.5523 9 13V10Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 16L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      service: 'chatgpt' as const,
    },
    {
      id: 'send_email',
      name: 'Send Email',
      description: 'Sends an email using a template with dynamic variables',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M22 5L11 5M9 5L2 5M22 12L11 12M9 12L2 12M22 19L11 19M9 19L2 19M12 3V7M12 10V14M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      service: 'sendgrid' as const,
    },
  ];

  const items = type === 'trigger' ? mailchimpTriggers : actions;
  
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div 
          key={item.id} 
          className={`p-4 border rounded-md hover:bg-${item.service === 'chatgpt' ? 'green' : item.service === 'mailchimp' ? 'red' : 'blue'}-50 cursor-pointer`}
          onClick={() => onSelect(item.service)}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 bg-${item.service === 'chatgpt' ? 'green' : item.service === 'mailchimp' ? 'red' : 'blue'}-100 rounded-full flex items-center justify-center`}>
              <div className={`text-${item.service === 'chatgpt' ? 'green' : item.service === 'mailchimp' ? 'red' : 'blue'}-600`}>{item.icon}</div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
