'use client'
import React, { useEffect, useState } from 'react';
import { AlertCircleIcon, BoltIcon, Brain, CodeIcon, FlameIcon, Loader2Icon, Mail, SendIcon, StarIcon, ThermometerIcon, X, ZapIcon, RefreshCcwIcon, CheckIcon, InfoIcon, ChevronsUpDownIcon, MailIcon, EyeIcon, LinkIcon, BellIcon, UsersIcon, TagIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Flow } from '@/contexts/FlowContext';

export const serviceIds = {
  'mailchimp' : 'fed32c44-3c0e-4011-94b6-ec049cf11462',
  'chatgpt' : '990e8400-e29b-41d4-a716-446655440004',
  'sendgrid': '65b0adfc-4b63-4570-b23a-cb16ad96be54',
}

type ConfigPanelProps = {
  type: string;
  initialConfig?: Record<string, any>;
  flow:Flow | null | undefined;
  onClose: () => void;
  onSave: (type: 'trigger'| 'action' , serviceId: string, config: Record<string, any>) => void;
};

export const ConfigPanel = ({ type, onClose, onSave, initialConfig = {}, flow}: ConfigPanelProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Mailchimp config
  const [mailchimpConfig, setMailchimpConfig] = useState({
    apiKey: initialConfig.apiKey || '',
    audienceId: initialConfig.audienceId || '',
    tags: '',
  });

  const [airtableConfig, setAirtableConfig] = useState({
    auth: {
      personalAccessToken: initialConfig.auth?.personalAccessToken || '',
    },
    base: initialConfig.base || '',
    tableId: initialConfig.tableId || '',
    fields: initialConfig.fields || {},
  })

  // SendGrid config
  const [sendgridConfig, setSendgridConfig] = useState({
    apiKey: initialConfig.apiKey || '',
    fromEmail: initialConfig.fromEmail || '',
    toEmail: initialConfig.toEmail || '',
    subject: initialConfig.subject || '',
    templateId: initialConfig.templateId || '',
  });
  
  // ChatGPT config
  const [chatgptConfig, setChatgptConfig] = useState({
    prompt: initialConfig.prompt || '',
    model: initialConfig.model || 'gpt-3.5-turbo',
    outputVariable: initialConfig.outputVariable || 'processed_content',
    temperature: initialConfig.temperature || '0.7',
  });

  const validateForm = () => {
    let valid = true;
    
    // Validate based on the integration type
    if (type === 'mailchimp') {
      valid = mailchimpConfig.apiKey?.trim() && mailchimpConfig.audienceId?.trim();
    } else if (type === 'sendgrid') {
      valid = sendgridConfig.apiKey?.trim() && 
              sendgridConfig.fromEmail?.trim() && 
              sendgridConfig.toEmail?.trim() && 
              sendgridConfig.subject?.trim() && 
              sendgridConfig.templateId?.trim();
    } else if (type === 'chatgpt') {
      valid = chatgptConfig.prompt?.trim() && 
              chatgptConfig.model?.trim() && 
              chatgptConfig.outputVariable?.trim();
    }
    
    setIsValid(valid);
    return valid;
  };

  const resetForm = () => {
    if (type === 'mailchimp') {
      setMailchimpConfig({ apiKey: '', audienceId: '' , tags: ''});
    } else if (type === 'sendgrid') {
      setSendgridConfig({ 
        apiKey: '', 
        fromEmail: '', 
        toEmail: '', 
        subject: '', 
        templateId: '' 
      });
    } else if (type === 'chatgpt') {
      setChatgptConfig({
        prompt: '',
        model: 'gpt-3.5-turbo',
        outputVariable: '',
        temperature: 0.7
      });
    }
    
    setError(null);
    setHasChanges(false);
  };

  const handleSave = async () => {
    setError(null);
    
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      switch (type) {
        case 'mailchimp':
          onSave('trigger', serviceIds.mailchimp , mailchimpConfig);
          break;
        case 'sendgrid':
          onSave('action', serviceIds.sendgrid ,sendgridConfig);
          break;
        case 'chatgpt':
          onSave('action', serviceIds.chatgpt ,chatgptConfig);
          break;
        default:
          break;
      }
      
      toast.success(`${getTitle()} configuration saved successfully!`);
      setHasChanges(false);
      onClose();
    } catch (err) {
      //@ts-ignore
      setError(err.message || "Failed to save configuration");
      toast.error("Failed to save configuration");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchConfig = async (flow: Flow | null | undefined) => {
      const configStep = flow?.steps.find(step => 
        step.service === type
      )

      if (configStep) {
        const backendConfig = configStep.config;
        switch(type) {
          case 'mailchimp':
            setMailchimpConfig({
              apiKey: backendConfig.apiKey || '',
              audienceId: backendConfig.audienceId || '',
              tags: backendConfig.tags || '',
            });
            break;
          case 'sendgrid':
            setSendgridConfig({
              apiKey: backendConfig.apiKey || '',
              fromEmail: backendConfig.fromEmail || '',
              toEmail: backendConfig.toEmail || '',
              subject: backendConfig.subject || '',
              templateId: backendConfig.templateId || '',
            });
            break;
          case 'chatgpt':
            setChatgptConfig({
              prompt: backendConfig.prompt || '',
              model: backendConfig.model || 'gpt-3.5-turbo',
              outputVariable: backendConfig.outputVariable || 'processed_content',
              temperature: backendConfig.temperature?.toString() || '0.7',
            });
            break;
        }
      }
    }
    fetchConfig(flow);
  }, [type])

  useEffect(() => {
    validateForm();
    setHasChanges(true);
  }, [type === 'mailchimp' ? mailchimpConfig : type === 'sendgrid' ? sendgridConfig : chatgptConfig]);

  const renderMailchimpConfig = () => {
    const [apiKeyError, setApiKeyError] = useState("");
    const [audienceError, setAudienceError] = useState("");
    
    const handleApiKeyChange = (e:any) => {
      const value = e.target.value;
      setMailchimpConfig({ ...mailchimpConfig, apiKey: value });
      
      if (!value.trim()) {
        setApiKeyError("API Key is required");
      } else if (!value.includes("-")) {
        setApiKeyError("API Key should include a hyphen (-)");
      } else {
        setApiKeyError("");
      }
    };
    
    const handleAudienceChange = (value: any) => {
      setMailchimpConfig({ ...mailchimpConfig, audienceId: value });
      
      if (!value) {
        setAudienceError("Please select an audience");
      } else {
        setAudienceError("");
      }
    };
  
    return (
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-start">
            <MailIcon className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Mailchimp Integration</h4>
              <p className="mt-1 text-xs text-green-700">
                Connect your Mailchimp account to automatically update subscriber information
                and manage your email marketing lists.
              </p>
            </div>
          </div>
        </div>
  
        {/* API Key Input */}
        <div>
          <Label htmlFor="api-key" className="flex items-center font-medium">
            API Key <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="api-key"
              value={mailchimpConfig.apiKey}
              onChange={handleApiKeyChange}
              onBlur={handleApiKeyChange}
              placeholder="Enter your Mailchimp API key"
              className={`pr-10 font-mono text-sm ${
                apiKeyError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              type="text"
              required
            />
          </div>
          {apiKeyError ? (
            <p className="mt-1.5 text-sm text-red-500">{apiKeyError}</p>
          ) : (
            <div className="flex items-center mt-1.5">
              <LinkIcon className="h-3 w-3 text-muted-foreground mr-1" />
              <a 
                href="https://mailchimp.com/help/about-api-keys/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                How to find your Mailchimp API key
              </a>
            </div>
          )}
        </div>
  
        {/* Audience Selection */}
        <div>
          <Label htmlFor="audience-id" className="flex items-center font-medium">
            Audience <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={mailchimpConfig.audienceId}
            onValueChange={handleAudienceChange}
          >
            <SelectTrigger 
              id="audience-id" 
              className={`w-full mt-2 ${
                audienceError ? "border-red-300 focus:ring-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select an audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Your Audiences</SelectLabel>
                <SelectItem value="audience1">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-green-500" />
                    <span>Main Newsletter</span>
                  </div>
                </SelectItem>
                <SelectItem value="audience2">
                  <div className="flex items-center">
                    <BellIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Product Updates</span>
                  </div>
                </SelectItem>
                <SelectItem value="audience3">
                  <div className="flex items-center">
                    <TagIcon className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Marketing List</span>
                  </div>
                </SelectItem>
                <SelectItem value="audience4">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>VIP Customers</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {audienceError ? (
            <p className="mt-1.5 text-sm text-red-500">{audienceError}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Select the audience you want to add or update subscribers in
            </p>
          )}
        </div>
  
        {/* Additional Options */}
        <div className="pt-2">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              <ChevronsUpDownIcon className="h-4 w-4 mr-1" />
              Advanced Settings
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <div>
                <Label htmlFor="tags" className="text-sm">
                  Tags (Optional)
                </Label>
                <Input
                  id="tags"
                  placeholder="e.g. new-signup, website-form"
                  className="mt-1"
                  value={mailchimpConfig.tags || ""}
                  onChange={(e) => setMailchimpConfig({ ...mailchimpConfig, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated tags to apply to new subscribers
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
  
        {/* Testing Panel */}
        <div className="border border-gray-200 rounded-lg mt-4">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h4 className="text-sm font-medium">Test Connection</h4>
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCcwIcon className="h-3.5 w-3.5 mr-1" />
              Test
            </Button>
          </div>
          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              Verify your API key and audience connection before saving the configuration
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderSendgridConfig = () => {
    //@ts-ignore
    const handleChange = (field, value) => {
      setSendgridConfig({ ...sendgridConfig, [field]: value });
    };
  
    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="sg-api-key" className="flex items-center">
            API Key <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="sg-api-key"
            value={sendgridConfig.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            placeholder="Enter your SendGrid API key"
            className="mt-2"
            required
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            You can find your API key in your SendGrid account settings
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from-email" className="flex items-center">
              From Email <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="from-email"
              type="email"
              value={sendgridConfig.fromEmail}
              onChange={(e) => handleChange('fromEmail', e.target.value)}
              placeholder="notifications@example.com"
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="to-email" className="flex items-center">
              To Email <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="to-email"
              type="email"
              value={sendgridConfig.toEmail}
              onChange={(e) => handleChange('toEmail', e.target.value)}
              placeholder="{{subscriber.email}}"
              className="mt-2"
              required
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Use <code className="bg-gray-100 px-1 py-0.5 rounded">{"{{subscriber.email}}"}</code> to send to the subscriber's email
            </p>
          </div>
        </div>
  
        <div>
          <Label htmlFor="subject" className="flex items-center">
            Subject <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="subject"
            value={sendgridConfig.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Welcome to our newsletter!"
            className="mt-2"
            required
          />
        </div>
  
        <div>
          <Label htmlFor="template" className="flex items-center">
            Email Template <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={sendgridConfig.templateId}
            onValueChange={(value) => handleChange('templateId', value)}
          >
            <SelectTrigger id="template" className="w-full mt-2">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template1">Welcome Email</SelectItem>
              <SelectItem value="template2">Monthly Newsletter</SelectItem>
              <SelectItem value="template3">Product Update</SelectItem>
              <SelectItem value="template4">Confirmation Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">SendGrid Tips</h4>
              <ul className="mt-1 text-xs text-blue-700 list-disc list-inside space-y-1">
                <li>Verify your sender email address in SendGrid before sending emails</li>
                <li>Test your templates with different email clients</li>
                <li>Check your email deliverability score in SendGrid dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderChatGPTConfig = () => {
    const [promptError, setPromptError] = useState("");
    const [outputVarError, setOutputVarError] = useState("");
    
    const handlePromptChange = (e: any) => {
      const value = e.target.value;
      setChatgptConfig({ ...chatgptConfig, prompt: value });
      
      if (!value.trim()) {
        setPromptError("Prompt template is required");
      } else {
        setPromptError("");
      }
    };

    const handleOutputVarChange = (e: any) => {
      const value = e.target.value;
      setChatgptConfig({ ...chatgptConfig, outputVariable: value });
      
      if (!value.trim()) {
        setOutputVarError("Output variable name is required");
      } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        setOutputVarError("Variable must start with a letter and contain only letters, numbers, or underscores");
      } else {
        setOutputVarError("");
      }
    };

    return (
      <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <CodeIcon className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-purple-800">Prompt Engineering Tips</h4>
                <ul className="mt-1 text-xs text-purple-700 list-disc list-inside space-y-1">
                  <li>Be specific and clear with your instructions</li>
                  <li>Break complex tasks into steps</li>
                  <li>Use variables like <code className="bg-purple-100 px-1 py-0.5 rounded text-purple-800">{"{{subscriber.field}}"}</code> to personalize output</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="gpt-prompt" className="flex items-center font-medium">
              Prompt Template <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="gpt-prompt"
              value={chatgptConfig.prompt}
              onChange={handlePromptChange}
              onBlur={handlePromptChange}
              placeholder="Write your prompt here. Use {{variables}} to include data from previous steps."
              className={`mt-2 min-h-[150px] font-mono text-sm ${
                promptError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              required
            />
            {promptError ? (
              <p className="mt-1.5 text-sm text-red-500">{promptError}</p>
              ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Example: <code className="bg-gray-100 px-1 py-0.5 rounded">Summarize the following subscriber information: {"{{subscriber.details}}"}</code>
            </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="gpt-model" className="flex items-center font-medium">
                    AI Model <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={chatgptConfig.model}
                  onValueChange={(value) => setChatgptConfig({ ...chatgptConfig, model: value })}
                >
                  <SelectTrigger id="gpt-model" className="w-full mt-2">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">
                      <div className="flex items-center">
                        <ZapIcon className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>GPT-3.5 Turbo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 mr-2 text-blue-500" />
                        <span>GPT-4 (Premium)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4-turbo">
                      <div className="flex items-center">
                        <BoltIcon className="h-4 w-4 mr-2 text-purple-500" />
                        <span>GPT-4 Turbo</span>
                      </div>
                    </SelectItem>
                  </SelectContent>                  
                </Select>
                <p className="text-xs text-muted-foreground mt-1.5">
                    More capable models may incur additional costs
                </p>
            </div>

            <div>
            <Label htmlFor="output-variable" className="flex items-center font-medium">
                Output Variable Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="output-variable"
                value={chatgptConfig.outputVariable}
                onChange={handleOutputVarChange}
                onBlur={handleOutputVarChange}
                placeholder="processed_content"
                className={`mt-2 font-mono ${
                  outputVarError ? "border-red-300 focus:ring-red-500" : ""
                }`}
                required
              />
              
              <div className="mt-2 px-1">
          <Input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={chatgptConfig.temperature}
            onChange={(e) => setChatgptConfig({ ...chatgptConfig, temperature: e.target.value })}
            className="accent-primary w-full"
          />

<div className="flex justify-between text-xs text-muted-foreground mt-2">
            <div className="flex flex-col items-center">
              <ThermometerIcon className="h-4 w-4 text-blue-500" />
              <span className="mt-1">Precise (0)</span>
            </div>
            <div className="text-center">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {chatgptConfig.temperature}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <FlameIcon className="h-4 w-4 text-red-500" />
              <span className="mt-1">Creative (1)</span>
            </div>
          </div>
        </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
          Lower values produce more predictable outputs, while higher values produce more varied and creative results
        </p>
          </div>

          <Collapsible className="pt-2">
        <CollapsibleTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronsUpDownIcon className="h-4 w-4 mr-1" />
          Advanced Options
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-tokens" className="text-sm">
                Max Tokens
              </Label>
              <Input
                id="max-tokens"
                type="number"
                min="1"
                max="4096"
                value={ 1024}
                onChange={(e) => setChatgptConfig({ ...chatgptConfig})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="top-p" className="text-sm">
                Top P
              </Label>
              <Input
                id="top-p"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={1}
                onChange={(e) => setChatgptConfig({ ...chatgptConfig })}
                className="mt-1"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
          
      </div>
    )
  }

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
      <SheetContent className="sm:max-w-md p-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header with icon */}
          <SheetHeader className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-3">
              {type === 'mailchimp' && <Mail className="h-5 w-5 text-primary" />}
              {type === 'sendgrid' && <SendIcon className="h-5 w-5 text-primary" />}
              {type === 'chatgpt' && <Brain className="h-5 w-5 text-primary" />}
              <SheetTitle>{getTitle()}</SheetTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your {getTitle()} integration settings below
            </p>
          </SheetHeader>
  
          {/* Main content */}
          <div className="flex-1 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2Icon className="h-8 w-8 text-primary animate-spin" />
                <span className="ml-2">Loading configuration...</span>
              </div>
            ) : (
              <>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {renderConfig()}
              </>
            )}
          </div>
  
          {/* Footer with actions */}
          <div className="p-6 border-t sticky bottom-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  // Reset form function that would clear all fields
                  if (hasChanges) {
                    if (confirm("Discard unsaved changes?")) {
                      resetForm();
                    }
                  } else {
                    resetForm();
                  }
                }}
                disabled={isLoading}
              >
                <RefreshCcwIcon className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                
                <Button 
                  onClick={handleSave}
                  disabled={isLoading || !isValid}
                  className="relative"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};