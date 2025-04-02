
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type ConfigPanelProps = {
  type: 'mailchimp' | 'sendgrid' | 'chatgpt';
  onClose: () => void;
  onSave: (config: Record<string, any>) => void;
};

export const ConfigPanel = ({ type, onClose, onSave }: ConfigPanelProps) => {
  // Mailchimp config
  const [mailchimpConfig, setMailchimpConfig] = useState({
    apiKey: '',
    audienceId: '',
  });

  // SendGrid config
  const [sendgridConfig, setSendgridConfig] = useState({
    apiKey: '',
    fromEmail: '',
    toEmail: '',
    subject: '',
    templateId: '',
  });
  
  // ChatGPT config
  const [chatgptConfig, setChatgptConfig] = useState({
    prompt: '',
    model: 'gpt-3.5-turbo',
    outputVariable: 'processed_content',
    temperature: '0.7',
  });

  const handleSave = () => {
    switch (type) {
      case 'mailchimp':
        onSave(mailchimpConfig);
        break;
      case 'sendgrid':
        onSave(sendgridConfig);
        break;
      case 'chatgpt':
        onSave(chatgptConfig);
        break;
      default:
        break;
    }
  };

  const renderMailchimpConfig = () => (
    <div className="space-y-4 mt-6">
      <div>
        <Label htmlFor="api-key">API Key</Label>
        <Input
          id="api-key"
          value={mailchimpConfig.apiKey}
          onChange={(e) => setMailchimpConfig({ ...mailchimpConfig, apiKey: e.target.value })}
          placeholder="Enter your Mailchimp API key"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="audience-id">Audience</Label>
        <Select
          value={mailchimpConfig.audienceId}
          onValueChange={(value) => setMailchimpConfig({ ...mailchimpConfig, audienceId: value })}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select an audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="audience1">Main Newsletter</SelectItem>
            <SelectItem value="audience2">Product Updates</SelectItem>
            <SelectItem value="audience3">Marketing List</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSendgridConfig = () => (
    <div className="space-y-4 mt-6">
      <div>
        <Label htmlFor="sg-api-key">API Key</Label>
        <Input
          id="sg-api-key"
          value={sendgridConfig.apiKey}
          onChange={(e) => setSendgridConfig({ ...sendgridConfig, apiKey: e.target.value })}
          placeholder="Enter your SendGrid API key"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="from-email">From Email</Label>
        <Input
          id="from-email"
          type="email"
          value={sendgridConfig.fromEmail}
          onChange={(e) => setSendgridConfig({ ...sendgridConfig, fromEmail: e.target.value })}
          placeholder="notifications@example.com"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="to-email">To Email</Label>
        <Input
          id="to-email"
          type="email"
          value={sendgridConfig.toEmail}
          onChange={(e) => setSendgridConfig({ ...sendgridConfig, toEmail: e.target.value })}
          placeholder="{{subscriber.email}}"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use {"{{subscriber.email}}"} to send to the subscriber's email
        </p>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={sendgridConfig.subject}
          onChange={(e) => setSendgridConfig({ ...sendgridConfig, subject: e.target.value })}
          placeholder="Welcome to our newsletter!"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="template">Email Template</Label>
        <Select
          value={sendgridConfig.templateId}
          onValueChange={(value) => setSendgridConfig({ ...sendgridConfig, templateId: value })}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="template1">Welcome Email</SelectItem>
            <SelectItem value="template2">Monthly Newsletter</SelectItem>
            <SelectItem value="template3">Product Update</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  
  const renderChatGPTConfig = () => (
    <div className="space-y-4 mt-6">
      <div>
        <Label htmlFor="gpt-prompt">Prompt Template</Label>
        <Textarea
          id="gpt-prompt"
          value={chatgptConfig.prompt}
          onChange={(e) => setChatgptConfig({ ...chatgptConfig, prompt: e.target.value })}
          placeholder="Write your prompt here. Use {{variables}} to include data from previous steps."
          className="mt-1 min-h-[120px]"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Example: Summarize the following subscriber information: {"{{subscriber.details}}"}
        </p>
      </div>
      <div>
        <Label htmlFor="gpt-model">AI Model</Label>
        <Select
          value={chatgptConfig.model}
          onValueChange={(value) => setChatgptConfig({ ...chatgptConfig, model: value })}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="gpt-4">GPT-4 (Premium)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="output-variable">Output Variable Name</Label>
        <Input
          id="output-variable"
          value={chatgptConfig.outputVariable}
          onChange={(e) => setChatgptConfig({ ...chatgptConfig, outputVariable: e.target.value })}
          placeholder="processed_content"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This variable name will be available to use in subsequent steps as {"{{chatgpt.variableName}}"}
        </p>
      </div>
      <div>
        <Label htmlFor="temperature">Temperature</Label>
        <Input
          id="temperature"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={chatgptConfig.temperature}
          onChange={(e) => setChatgptConfig({ ...chatgptConfig, temperature: e.target.value })}
          className="mt-1"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Precise (0)</span>
          <span>Temperature: {chatgptConfig.temperature}</span>
          <span>Creative (1)</span>
        </div>
      </div>
    </div>
  );

  const renderConfig = () => {
    switch (type) {
      case 'mailchimp':
        return renderMailchimpConfig();
      case 'sendgrid':
        return renderSendgridConfig();
      case 'chatgpt':
        return renderChatGPTConfig();
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'mailchimp':
        return 'Configure Mailchimp Trigger';
      case 'sendgrid':
        return 'Configure SendGrid Action';
      case 'chatgpt':
        return 'Configure ChatGPT Processing';
      default:
        return 'Configure';
    }
  };

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
        </SheetHeader>
        
        {renderConfig()}
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
