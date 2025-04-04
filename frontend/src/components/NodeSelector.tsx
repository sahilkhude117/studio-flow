
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
      iconUrl: 'https://cdn.activepieces.com/pieces/mailchimp.png',
      service: 'mailchimp' as const,
    },
    {
      id: 'updated_subscriber',
      name: 'Updated Subscriber',
      description: 'Triggered when a contact is updated in an audience',
      iconUrl: 'https://cdn.activepieces.com/pieces/mailchimp.png',
      service: 'mailchimp' as const,
    },
  ];

  const actions = [
    {
      id: 'chatgpt_process',
      name: 'Process with ChatGPT',
      description: 'Process data with AI before sending to next step',
      iconUrl: "https://cdn.activepieces.com/pieces/openai.png",
      service: 'chatgpt' as const,
    },
    {
      id: 'send_email',
      name: 'Send Email',
      description: 'Sends an email using a template with dynamic variables',
      iconUrl: "https://cdn.activepieces.com/pieces/sendgrid.png",
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
              <div className={`text-${item.service === 'chatgpt' ? 'green' : item.service === 'mailchimp' ? 'red' : 'blue'}-600`}>
                <Image
                  src={item.iconUrl}
                  alt='s'
                  width={20}
                  height={20}
                />
              </div>
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
