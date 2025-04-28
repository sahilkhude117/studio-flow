
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type NodeSelectorProps = {
  type: 'trigger' | 'action';
  onSelect: (service: 'webhook' | 'sendgrid' | 'openai' | 'slack' | 'airtable' | 'googleSheets') => void;
};

export const NodeSelector = ({ type, onSelect }: NodeSelectorProps) => {
  const webhookTriggers = [
    {
      id: 'webhook',
      name: 'webhook',
      description: 'Catch a webhook',
      iconUrl: 'https://cdn.activepieces.com/pieces/webhook.svg',
      service: 'webhook' as const,
    },
  ];

  const actions = [
    {
      id: 'airtable_create_record',
      name: 'Create Airtable Record',
      description: 'Adds a record into an airtable',
      iconUrl: "https://cdn.activepieces.com/pieces/airtable.png",
      service: 'airtable' as const,
    },
    {
      id: 'insert_row',
      name: 'Insert Row',
      description: 'Append a row of values to an existing sheet',
      iconUrl: "https://cdn.activepieces.com/pieces/google-sheets.png",
      service: 'googleSheets' as const,
    },
    {
      id: 'ask_chatgpt',
      name: 'Ask ChatGPT',
      description: 'Ask ChatGPT anything you want!',
      iconUrl: "https://cdn.activepieces.com/pieces/openai.png",
      service: 'openai' as const,
    },
    {
      id: 'send_email',
      name: 'Send Email',
      description: 'Send a text or HTML email',
      iconUrl: "https://cdn.activepieces.com/pieces/sendgrid.png",
      service: 'sendgrid' as const,
    },
    {
      id: 'send_channel_message',
      name: 'Send Message To A Channel',
      description: 'Send Message To A Channel',
      iconUrl: "https://cdn.activepieces.com/pieces/slack.png",
      service: 'slack' as const,
    },
  ];

  const items = type === 'trigger' ? webhookTriggers : actions;
  
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div 
          key={item.id} 
          className={`p-4 border rounded-md hover:bg-${item.service === 'webhook' ? 'red' : 'blue'}-50 cursor-pointer`}
          onClick={() => onSelect(item.service)}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 bg-${item.service === 'webhook' ? 'red' : 'blue'}-100 rounded-full flex items-center justify-center`}>
              <div className={`text-${item.service === 'webhook' ? 'red' : 'blue'}-600`}>
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
