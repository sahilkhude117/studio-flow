'use client'
import React, { useEffect, useState } from 'react';
import { AlertCircleIcon, BoltIcon, Brain, CodeIcon, FlameIcon, Loader2Icon, GlobeIcon, SendIcon, StarIcon, ThermometerIcon, X, ZapIcon, RefreshCcwIcon, CheckIcon, InfoIcon, ChevronsUpDownIcon, TableIcon, EyeIcon, LinkIcon, BellIcon, UsersIcon, TagIcon, EyeOffIcon, MessageSquareIcon } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Flow } from '@/contexts/FlowContext';

export const serviceIds = {
  'webhook': 'fed32c44-3c0e-4011-94b6-ec049cf11462',
  'airtable': 'ffdfaf98-0584-4b8c-8c65-460cfb7a8088',
  'googleSheets': '4d712d47-8a43-4dcb-b9e5-53cc888efdbd',
  'openai': "e3e5031b-8caa-4219-a7cf-0621f4e32d73",
  'sendgrid': "65b0adfc-4b63-4570-b23a-cb16ad96be54",
  'slack': '62918d96-462a-468a-9cdc-9deec81562b7',
};

type ConfigPanelProps = {
  type: string;
  initialConfig?: Record<string, any>;
  flow: Flow | null | undefined;
  onClose: () => void;
  onSave: (type: 'trigger' | 'action', serviceId: string, config: Record<string, any>) => void;
};

export const ConfigPanel = ({ type, onClose, onSave, initialConfig = {}, flow }: ConfigPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isValid, setIsValid] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Webhook config
  const [webhookConfig, setWebhookConfig] = useState({
    url: initialConfig.url || `http://localhost:8001/api/v1/hooks/catch/1/${flow ? flow?.id : "" }/`,
  });

  // Airtable config
  const [airtableConfig, setAirtableConfig] = useState({
    auth: {
      personalAccessToken: initialConfig.auth?.personalAccessToken || '',
    },
    base: initialConfig.base || '',
    tableId: initialConfig.tableId || '',
    fields: initialConfig.fields || {
      Name: 'John Doe',
      Email: 'john@example.com',
      Status: 'Active'
    },
  });

  // Google Sheets config
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState({
    auth: {
      access_token: initialConfig.auth?.access_token || '',
    },
    props: {
      includeTeamDrives: initialConfig.props?.includeTeamDrives || false,
      spreadsheetId: initialConfig.props?.spreadsheetId || '',
      sheetId: initialConfig.props?.sheetId || '',
      as_string: initialConfig.props?.as_string || false,
      first_row_headers: initialConfig.props?.first_row_headers || true,
      values: initialConfig.props?.values || {},
    }
  });

  // Openai Config
  const [openaiConfig, setOpenaiConfig] = useState({
    auth:  initialConfig?.auth || '',
    props: {
      model: initialConfig.props?.model || 'gpt-3.5-turbo',
      prompt: initialConfig.props?.prompt || '',
      temperature: initialConfig.props?.temperature || 0.7,
      maxTokens: initialConfig.props?.maxTokens || 1000,
      topP: initialConfig.props?.topP || 1,
      frequencyPenalty: initialConfig.props?.frequencyPenalty || 0,
      presencePenalty: initialConfig.props?.presencePenalty || 0,
      roles:  Array.isArray(initialConfig.props?.roles)
        ? initialConfig.props.roles
        : [{ role: 'system', content: 'You are a helpful assistant.' }],
      }
  })

  const [sendgridConfig, setSendgridConfig] = useState({
    auth: initialConfig?.auth || '',
    props: {
      to: Array.isArray(initialConfig.props?.to) ? initialConfig.props.to : [''],
      from: initialConfig.props?.from || '',
      from_name: initialConfig.props?.from_name || '',
      subject: initialConfig.props?.subject || '',
      content_type: initialConfig.props?.content_type || 'text/plain',
      content: initialConfig.props?.content || '',
    }
  });

  const [slackConfig, setSlackConfig] = useState({
    auth: {
      access_token: initialConfig.auth?.access_token || '',
    },
    props: {
      text: initialConfig.props?.text || 'Hi there',
      userId: initialConfig.props?.userId || '',
      blocks: initialConfig.props?.blocks || [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Welcome to Slack Blocks!",
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "This is a *section* block with _markdown_ support."
          }
        },
        {
          "type": "divider"
        }
      ],
      username: initialConfig.props?.username || '',
      profilePicture: initialConfig.props?.profilePicture || ''
    }
  });
  

  const validateForm = () => {
    let valid = true;
    
    // Validate based on the integration type
    if (type === 'webhook') {
      // Webhook URL is auto-generated, so always valid
      valid = true;
    } else if (type === 'airtable') {
      valid = airtableConfig.auth?.personalAccessToken?.trim() && 
              airtableConfig.base?.trim() && 
              airtableConfig.tableId?.trim() &&
              Object.keys(airtableConfig.fields).length > 0;
    } else if (type === 'googleSheets') {
      valid = googleSheetsConfig.auth?.access_token?.trim() && 
          googleSheetsConfig.props?.spreadsheetId?.trim() && 
          googleSheetsConfig.props?.sheetId?.trim() &&
          Object.keys(googleSheetsConfig.props.values).length > 0;
    } else if (type === 'slack') {
      valid = slackConfig.auth?.access_token?.trim() &&
              (slackConfig.props?.text?.trim() || 
               (slackConfig.props?.blocks && slackConfig.props.blocks.length > 0));
    }
    
    setIsValid(valid);
    return valid;
  };

  const resetForm = () => {
    if (type === 'webhook') {
      setWebhookConfig({ url: 'https://hooks.yourdomain.com/incoming/webhook-12345' });
    } else if (type === 'airtable') {
      setAirtableConfig({
        auth: {
          personalAccessToken: '',
        },
        base: '',
        tableId: '',
        fields: {
          Name: '',
          Email: '',
          Status: ''
        },
      });
    } else if (type === 'googleSheets') {
      setGoogleSheetsConfig({
        auth: {
          access_token: '',
        },
        props: {
          includeTeamDrives: false,
          spreadsheetId: '',
          sheetId: '',
          as_string: false,
          first_row_headers: true,
          values: {},
        }
      });
    } else if (type === 'openai') {
      setOpenaiConfig({
        auth: '',
        props: {
          model: 'gpt-3.5-turbo',
          prompt: '',
          temperature: 0.7,
          maxTokens: 1500,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
          roles: [
            {
              role: 'system',
              content: 'You are a helpful assistant'
            }
          ]
        }
      }) 
    } else if (type === 'sendgrid') {
      setSendgridConfig({
        auth: '',
        props: {
          to: [''],
          from: '',
          from_name: '',
          subject: '',
          content_type: 'text/plain',
          content: ''
        }
      });
    } else if (type === 'slack') {
      setSlackConfig({
        auth: {
          access_token: '',
        },
        props: {
          text: 'Hi there',
          userId: '',
          blocks: [
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": "Welcome to Slack Blocks!",
                "emoji": true
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "This is a *section* block with _markdown_ support."
              }
            },
            {
              "type": "divider"
            }
          ],
          username: '',
          profilePicture: ''
        }
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
        case 'webhook':
          onSave('trigger', serviceIds.webhook, webhookConfig);
          break;
        case 'airtable':
          onSave('action', serviceIds.airtable, airtableConfig);
          break;
        case 'googleSheets':
          onSave('action', serviceIds.googleSheets, googleSheetsConfig)
          break;
        case 'openai':
          onSave('action', serviceIds.openai, openaiConfig);
          break;
        case 'sendgrid':
          onSave('action', serviceIds.sendgrid, sendgridConfig);
          break;
        case 'slack':
          onSave('action', serviceIds.slack, slackConfig)
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
      );

      if (configStep) {
        const backendConfig = configStep.config;
        switch(type) {
          case 'webhook':
            setWebhookConfig({
              url: backendConfig.url || 'https://hooks.yourdomain.com/incoming/webhook-12345',
            });
            break;
          case 'airtable':
            setAirtableConfig({
              auth: {
                personalAccessToken: backendConfig.auth?.personalAccessToken || '',
              },
              base: backendConfig.base || '',
              tableId: backendConfig.tableId || '',
              fields: backendConfig.fields || {
                Name: '',
                Email: '',
                Status: ''
              },
            });
            break;
          case 'googleSheets':
            setGoogleSheetsConfig({
              auth: {
                access_token: backendConfig.auth?.access_token || '',
              },
              props: {
                includeTeamDrives: backendConfig.props?.includeTeamDrives || false,
                spreadsheetId: backendConfig.props?.spreadsheetId || '',
                sheetId: backendConfig.props?.sheetId || '',
                as_string: backendConfig.props?.as_string || false,
                first_row_headers: backendConfig.props?.first_row_headers || true,
                values: backendConfig.props?.values || {},
              }
            });
            break;
          case 'openai':
            setOpenaiConfig({
              auth: backendConfig.auth || '',
              props: {
                model: backendConfig.props?.model || 'gpt-3.5-turbo',
                prompt: backendConfig.props?.prompt || '',
                temperature: backendConfig.props?.temperature || 0.7,
                maxTokens: backendConfig.props?.maxTokens || 1000,
                topP: backendConfig.props?.topP || 1,
                frequencyPenalty: backendConfig.props?.frequencyPenalty || 0,
                presencePenalty: backendConfig.props?.presencePenalty || 0,
                roles: backendConfig.props?.roles || [
                  {
                    role: 'system',
                    content: 'You are a helpful assistant.'
                  }
                ]
              }
            });
            break;
          case 'sendgrid':
            setSendgridConfig({
              auth: backendConfig.auth || '',
              props: {
                to: backendConfig.props?.to || [''],
                from: backendConfig.props?.from || '',
                from_name: backendConfig.props?.from_name || '',
                subject: backendConfig.props?.subject || '',
                content_type: backendConfig.props?.content_type || 'text/plain',
                content: backendConfig.props?.content || ''
              }
            });
            break;
          case 'slack':
            setSlackConfig({
              auth: {
                access_token: backendConfig.auth?.access_token || '',
              },
              props: {
                text: backendConfig.props?.text || 'Hi there',
                userId: backendConfig.props?.userId || '',
                blocks: backendConfig.props?.blocks || [
                  {
                    "type": "header",
                    "text": {
                      "type": "plain_text",
                      "text": "Welcome to Slack Blocks!",
                      "emoji": true
                    }
                  },
                  {
                    "type": "section",
                    "text": {
                      "type": "mrkdwn",
                      "text": "This is a *section* block with _markdown_ support."
                    }
                  },
                  {
                    "type": "divider"
                  }
                ],
                username: backendConfig.props?.username || '',
                profilePicture: backendConfig.props?.profilePicture || ''
              }
            });
            break;
        }
      }
    };
    fetchConfig(flow);
  }, [type, flow]);

  useEffect(() => {
    validateForm();
    setHasChanges(true);
  }, [
    type === 'webhook'
      ? webhookConfig
      : type === 'airtable'
        ? airtableConfig
        : type === 'googleSheets'
          ? googleSheetsConfig
          : type === 'slack'
            ? slackConfig
            : type === 'sendgrid'
              ? sendgridConfig
              : type === 'openai'
                ? openaiConfig
                : {}
  ]);

  const renderWebhookConfig = () => {
    return (
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <GlobeIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Webhook Trigger</h4>
              <p className="mt-1 text-xs text-blue-700">
                Use this webhook URL to trigger your automation from external systems or applications.
                Send a POST request to this URL to start your workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Webhook URL Display */}
        <div>
          <Label htmlFor="webhook-url" className="flex items-center font-medium">
            Your Webhook URL
          </Label>
          <div className="relative mt-2">
            <Input
              id="webhook-url"
              value={webhookConfig.url}
              className="pr-20 font-mono text-sm bg-gray-50"
              readOnly
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute right-1 top-1 h-7"
              onClick={() => {
                navigator.clipboard.writeText(webhookConfig.url);
                toast.success("Webhook URL copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            This URL is unique to your workflow and can be used to trigger it externally
          </p>
        </div>

        {/* Usage Examples */}
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 p-3 border-b border-gray-200 rounded-t-lg">
            <h4 className="text-sm font-medium">Usage Example</h4>
          </div>
          <div className="p-3">
            <p className="text-xs mb-2">Send a POST request to the webhook URL:</p>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-xs font-mono overflow-x-auto">
              {`curl -X POST ${webhookConfig.url} \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John Doe", "email": "john@example.com"}'`}
            </pre>
          </div>
        </div>

        {/* Security Note */}
        <div className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-r-md">
          <div className="flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Security Note</h4>
              <p className="mt-1 text-xs text-amber-700">
                Keep this URL private. Anyone with this URL can trigger your workflow. For enhanced
                security, consider adding authentication headers to your workflow setup.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAirtableConfig = () => {
    const [tokenError, setTokenError] = useState("");
    const [baseError, setBaseError] = useState("");
    const [tableError, setTableError] = useState("");
    
    const handleTokenChange = (e: any) => {
      const value = e.target.value;
      setAirtableConfig({ 
        ...airtableConfig, 
        auth: { ...airtableConfig.auth, personalAccessToken: value } 
      });
      
      if (!value.trim()) {
        setTokenError("Personal Access Token is required");
      } else if (!value.startsWith('pat')) {
        setTokenError("Invalid token format. Should start with 'pat'");
      } else {
        setTokenError("");
      }
    };
    
    const handleBaseChange = (e: any) => {
      const value = e.target.value;
      setAirtableConfig({ ...airtableConfig, base: value });
      
      if (!value.trim()) {
        setBaseError("Base ID is required");
      } else {
        setBaseError("");
      }
    };
    
    const handleTableChange = (e: any) => {
      const value = e.target.value;
      setAirtableConfig({ ...airtableConfig, tableId: value });
      
      if (!value.trim()) {
        setTableError("Table ID is required");
      } else {
        setTableError("");
      }
    };
    
    const handleFieldChange = (key: string, value: string) => {
      setAirtableConfig({
        ...airtableConfig,
        fields: {
          ...airtableConfig.fields,
          [key]: value
        }
      });
    };
    
    const addField = () => {
      setAirtableConfig({
        ...airtableConfig,
        fields: {
          ...airtableConfig.fields,
          [`Field_${Object.keys(airtableConfig.fields).length + 1}`]: ''
        }
      });
    };
    
    const removeField = (key: string) => {
      const newFields = { ...airtableConfig.fields };
      delete newFields[key];
      setAirtableConfig({
        ...airtableConfig,
        fields: newFields
      });
    };

    return (
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-start">
            <TableIcon className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Airtable Integration</h4>
              <p className="mt-1 text-xs text-green-700">
                Connect your Airtable account to automatically add records to your specified base and table.
                This action will create new entries based on the field mappings below.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Access Token Input */}
        <div>
          <Label htmlFor="pat" className="flex items-center font-medium">
            Personal Access Token <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="pat"
              value={airtableConfig.auth.personalAccessToken}
              onChange={handleTokenChange}
              onBlur={handleTokenChange}
              placeholder="Enter your Airtable Personal Access Token"
              className={`pr-10 font-mono text-sm ${
                tokenError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              type="text"
              required
            />
          </div>
          {tokenError ? (
            <p className="mt-1.5 text-sm text-red-500">{tokenError}</p>
          ) : (
            <div className="flex items-center mt-1.5">
              <LinkIcon className="h-3 w-3 text-muted-foreground mr-1" />
              <a 
                href="https://airtable.com/create/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                How to create an Airtable Personal Access Token
              </a>
            </div>
          )}
        </div>

        {/* Base and Table IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="base-id" className="flex items-center font-medium">
              Base ID <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="base-id"
              value={airtableConfig.base}
              onChange={handleBaseChange}
              onBlur={handleBaseChange}
              placeholder="e.g. appgihVUnBKRZp74s"
              className={`mt-2 font-mono text-sm ${
                baseError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              required
            />
            {baseError && <p className="mt-1.5 text-sm text-red-500">{baseError}</p>}
          </div>
          <div>
            <Label htmlFor="table-id" className="flex items-center font-medium">
              Table ID <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="table-id"
              value={airtableConfig.tableId}
              onChange={handleTableChange}
              onBlur={handleTableChange}
              placeholder="e.g. tblmblI1o0ImVBgQI"
              className={`mt-2 font-mono text-sm ${
                tableError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              required
            />
            {tableError && <p className="mt-1.5 text-sm text-red-500">{tableError}</p>}
          </div>
        </div>
        
        {/* Field mappings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Field Mappings <span className="text-red-500 ml-1">*</span></Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addField}
              className="h-8"
            >
              Add Field
            </Button>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto p-1">
            {Object.entries(airtableConfig.fields).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Input
                  placeholder="Field Name"
                  value={key}
                  className="flex-1"
                  readOnly
                />
                <Input
                  placeholder="Value or Variable"
                  value={value as string}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeField(key)}
                  className="h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Map Airtable field names to static values or use variable syntax like {"{{"}<span className="font-mono">data.email</span>{"}}"}
          </p>
        </div>

        {/* Testing Panel */}
        {/* <div className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h4 className="text-sm font-medium">Test Connection</h4>
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCcwIcon className="h-3.5 w-3.5 mr-1" />
              Test
            </Button>
          </div>
          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              Verify your Airtable connection and field mappings before saving the configuration
            </p>
          </div>
        </div> */}
      </div>
    );
  };

  const renderGoogleSheetsConfig = () => {
    const [tokenError, setTokenError] = useState('');
    const [spreadsheetError, setSpreadsheetError] = useState("");
    const [sheetError, setSheetError] = useState("");

    const handleTokenChange = (e: any) => {
      const value = e.target.value;
      setGoogleSheetsConfig({ 
        ...googleSheetsConfig, 
        auth: { ...googleSheetsConfig.auth, access_token: value } 
      });
      
      if (!value.trim()) {
        setTokenError("Access Token is required");
      } else if (!value.startsWith('ya29.')) {
        setTokenError("Invalid token format. Google access tokens typically start with 'ya29.'");
      } else {
        setTokenError("");
      }
    };

    const handleSpreadsheetChange = (e: any) => {
      const value = e.target.value;
      setGoogleSheetsConfig({ 
        ...googleSheetsConfig, 
        props: { ...googleSheetsConfig.props, spreadsheetId: value } 
      });
      
      if (!value.trim()) {
        setSpreadsheetError("Spreadsheet ID is required");
      } else {
        setSpreadsheetError("");
      }
    };

    const handleSheetChange = (e: any) => {
      const value = e.target.value;
      setGoogleSheetsConfig({ 
        ...googleSheetsConfig, 
        props: { ...googleSheetsConfig.props, sheetId: value } 
      });
      
      if (!value.trim()) {
        setSheetError("Sheet ID is required");
      } else {
        setSheetError("");
      }
    };

    const handleCheckboxChange = (field: string, checked: boolean) => {
      setGoogleSheetsConfig({
        ...googleSheetsConfig,
        props: { ...googleSheetsConfig.props, [field]: checked }
      });
    };

    const handleValueChange = (key: string, value: string) => {
      setGoogleSheetsConfig({
        ...googleSheetsConfig,
        props: {
          ...googleSheetsConfig.props,
          values: {
            ...googleSheetsConfig.props.values,
            [key]: value
          }
        }
      });
    };

    const addValue = () => {
      setGoogleSheetsConfig({
        ...googleSheetsConfig,
        props: {
          ...googleSheetsConfig.props,
          values: {
            ...googleSheetsConfig.props.values,
            [`Age_${Object.keys(googleSheetsConfig.props.values).length + 1}`]: ''
          }
        }
      });
    };

    const removeValue = (key: string) => {
      const newValues = { ...googleSheetsConfig.props.values };
      delete newValues[key];
      setGoogleSheetsConfig({
        ...googleSheetsConfig,
        props: {
          ...googleSheetsConfig.props,
          values: newValues
        }
      });
    };


    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-start">
            <TableIcon className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Google Sheets Integration</h4>
              <p className="mt-1 text-xs text-green-700">
                Connect to Google Sheets to automatically add rows to your spreadsheet.
                For example, you can store form submissions, track events, or log data.
              </p>
            </div>
          </div>
        </div>

        {/* Access Token Input */}
        <div>
          <Label htmlFor="access-token" className="flex items-center font-medium">
            Access Token <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="access-token"
              value={googleSheetsConfig.auth.access_token}
              onChange={handleTokenChange}
              onBlur={handleTokenChange}
              placeholder="e.g. ya29.a0AZYkNZjMfCTDn6wIFOYLURuLhg4SL734..."
              className={`pr-10 font-mono text-sm ${
                tokenError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              type="text"
              required
            />
            {/* <EyeOffIcon className="h-4 w-4 text-gray-400 absolute right-3 top-3" /> */}
          </div>
          {tokenError && <p className="mt-1.5 text-sm text-red-500">{tokenError}</p>}
        </div>
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="spreadsheet-id" className="flex items-center font-medium">
              Spreadsheet ID <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="spreadsheet-id"
              value={googleSheetsConfig.props.spreadsheetId}
              onChange={handleSpreadsheetChange}
              onBlur={handleSpreadsheetChange}
              placeholder="e.g. 1FNSvCK80fSF_OjvRyULsIdhiLVh3I94B3C-111qTRbY"
              className={`mt-2 font-mono text-sm ${
                spreadsheetError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              required
            />
            {spreadsheetError && <p className="mt-1.5 text-sm text-red-500">{spreadsheetError}</p>}
          </div>
          <div>
            <Label htmlFor="sheet-id" className="flex items-center font-medium">
              Sheet ID <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="sheet-id"
              value={googleSheetsConfig.props.sheetId}
              onChange={handleSheetChange}
              onBlur={handleSheetChange}
              placeholder="e.g. 0"
              className={`mt-2 font-mono text-sm ${
                sheetError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              required
            />
            {sheetError && <p className="mt-1.5 text-sm text-red-500">{sheetError}</p>}
          </div>
        </div>
        
        <div className="space-y-3 border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-team-drives" 
              checked={googleSheetsConfig.props.includeTeamDrives}
              onCheckedChange={(checked) => 
                handleCheckboxChange('includeTeamDrives', checked as boolean)
              }
            />
            <Label htmlFor="include-team-drives" className="text-sm cursor-pointer">
              Include team drives
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="as-string" 
              checked={googleSheetsConfig.props.as_string}
              onCheckedChange={(checked) => 
                handleCheckboxChange('as_string', checked as boolean)
              }
            />
            <Label htmlFor="as-string" className="text-sm cursor-pointer">
              Format all values as strings
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="first-row-headers" 
              checked={googleSheetsConfig.props.first_row_headers}
              onCheckedChange={(checked) => 
                handleCheckboxChange('first_row_headers', checked as boolean)
              }
            />
            <Label htmlFor="first-row-headers" className="text-sm cursor-pointer">
              First row contains headers
            </Label>
          </div>
        </div>
          
        <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="font-medium">Column Values <span className="text-red-500 ml-1">*</span></Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addValue}
            className="h-8"
          >
            Add Column
          </Button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto p-1">
          {Object.entries(googleSheetsConfig.props.values).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              {/* <Input
                placeholder="Column Name"
                value={key}
                className="flex-1"
                readOnly
              /> */}
              <Input
                placeholder="Value or Variable"
                value={value as string}
                onChange={(e) => handleValueChange(key, e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeValue(key)}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Example values: Age: 25, Name: John Doe, City: Mumbai
        </p>
      </div>

      {/* Testing Panel */}
      {/* <div className="border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h4 className="text-sm font-medium">Test Connection</h4>
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCcwIcon className="h-3.5 w-3.5 mr-1" />
            Test
          </Button>
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground">
            Verify your Google Sheets connection before saving the configuration
          </p>
        </div>
      </div> */}
      </div>
    )

  }

  const renderOpenAIConfig = () => {
    const [apiKeyError, setApiKeyError] = useState('');
    const [promptError, setPromptError] = useState('');
    const [modelError, setModelError] = useState('');
    const [maxTokensError, setMaxTokensError] = useState('');
    
    const handleApiKeyChange = (e: any) => {
      const value = e.target.value;
      setOpenaiConfig({ 
        ...openaiConfig, 
        auth: value 
      });
      
      if (!value.trim()) {
        setApiKeyError("API Key is required");
      } else if (!value.startsWith('sk-')) {
        setApiKeyError("Invalid API key format. Should start with 'sk-'");
      } else {
        setApiKeyError("");
      }
    };
    
    const handleModelChange = (value: string) => {
      setOpenaiConfig({ 
        ...openaiConfig, 
        props: { ...openaiConfig.props, model: value } 
      });
      
      if (!value.trim()) {
        setModelError("Model is required");
      } else {
        setModelError("");
      }
    };
    
    const handlePromptChange = (e: any) => {
      const value = e.target.value;
      setOpenaiConfig({ 
        ...openaiConfig, 
        props: { ...openaiConfig.props, prompt: value } 
      });
      
      if (!value.trim()) {
        setPromptError("Prompt is required");
      } else {
        setPromptError("");
      }
    };
    
    const handleMaxTokensChange = (e: any) => {
      const value = parseInt(e.target.value);
      setOpenaiConfig({ 
        ...openaiConfig, 
        props: { ...openaiConfig.props, maxTokens: isNaN(value) ? 0 : value } 
      });
      
      if (isNaN(value) || value <= 0) {
        setMaxTokensError("Max tokens must be a positive number");
      } else {
        setMaxTokensError("");
      }
    };
    
    const handleNumericParamChange = (param: string, e: any) => {
      const value = parseFloat(e.target.value);
      setOpenaiConfig({
        ...openaiConfig,
        props: { ...openaiConfig.props, [param]: isNaN(value) ? 0 : value }
      });
    };
    
    const handleRoleContentChange = (index: number, field: string, value: string) => {
      const newRoles = [...openaiConfig.props.roles];
      newRoles[index] = { ...newRoles[index], [field]: value };
      
      setOpenaiConfig({
        ...openaiConfig,
        props: { ...openaiConfig.props, roles: newRoles }
      });
    };
    
    const addRole = () => {
      setOpenaiConfig({
        ...openaiConfig,
        props: {
          ...openaiConfig.props,
          roles: [
            ...openaiConfig.props.roles,
            { role: 'user', content: '' }
          ]
        }
      });
    };
    
    const removeRole = (index: number) => {
      const newRoles = [...openaiConfig.props.roles];
      newRoles.splice(index, 1);
      
      setOpenaiConfig({
        ...openaiConfig,
        props: { ...openaiConfig.props, roles: newRoles }
      });
    };
    
    return (
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-start">
            <Brain className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-purple-800">OpenAI Integration</h4>
              <p className="mt-1 text-xs text-purple-700">
                Connect to OpenAI's ChatGPT to generate responses based on prompts.
                Use this action to create dynamic content, answer questions, or provide assistance.
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
              value={openaiConfig.auth}
              onChange={handleApiKeyChange}
              onBlur={handleApiKeyChange}
              placeholder="sk-..."
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
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Get your OpenAI API key
              </a>
            </div>
          )}
        </div>
  
        {/* Model Selection */}
        <div>
          <Label htmlFor="model" className="flex items-center font-medium">
            Model <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={openaiConfig.props.model} 
            onValueChange={handleModelChange}
          >
            <SelectTrigger className={`mt-2 ${modelError ? "border-red-300" : ""}`}>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>GPT Models</SelectLabel>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo-16k">GPT-3.5 Turbo (16k)</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4-vision-preview">GPT-4 Vision</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {modelError && <p className="mt-1.5 text-sm text-red-500">{modelError}</p>}
        </div>
  
        {/* Prompt Input */}
        <div>
          <Label htmlFor="prompt" className="flex items-center font-medium">
            Prompt <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="prompt"
            value={openaiConfig.props.prompt}
            onChange={handlePromptChange}
            onBlur={handlePromptChange}
            placeholder="Enter your prompt here..."
            className={`mt-2 min-h-[100px] ${promptError ? "border-red-300" : ""}`}
            required
          />
          {promptError && <p className="mt-1.5 text-sm text-red-500">{promptError}</p>}
          <p className="text-xs text-muted-foreground mt-1.5">
            Write your prompt text or use variables with syntax like {"{{"}<span className="font-mono">data.question</span>{"}}"}
          </p>
        </div>
  
        {/* Max Tokens */}
        <div>
          <Label htmlFor="max-tokens" className="flex items-center font-medium">
            Max Tokens <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="max-tokens"
            type="number"
            value={openaiConfig.props.maxTokens}
            onChange={handleMaxTokensChange}
            onBlur={handleMaxTokensChange}
            min="1"
            max="8000"
            className={`mt-2 ${maxTokensError ? "border-red-300" : ""}`}
            required
          />
          {maxTokensError && <p className="mt-1.5 text-sm text-red-500">{maxTokensError}</p>}
          <p className="text-xs text-muted-foreground mt-1.5">
            Maximum length of generated output (1-8000)
          </p>
        </div>
  
        {/* Advanced Parameters */}
        <Collapsible className="border border-gray-200 rounded-lg">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium bg-gray-50 rounded-t-lg">
            <div className="flex items-center">
              <ChevronsUpDownIcon className="h-4 w-4 mr-2" />
              Advanced Parameters
            </div>
            <Badge variant="outline" className="font-normal">Optional</Badge>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature" className="text-sm">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={openaiConfig.props.temperature}
                  onChange={(e) => handleNumericParamChange('temperature', e)}
                  min="0"
                  max="2"
                  step="0.1"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls randomness (0-2)
                </p>
              </div>
              <div>
                <Label htmlFor="top-p" className="text-sm">Top P</Label>
                <Input
                  id="top-p"
                  type="number"
                  value={openaiConfig.props.topP}
                  onChange={(e) => handleNumericParamChange('topP', e)}
                  min="0"
                  max="1"
                  step="0.05"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alternative to temperature (0-1)
                </p>
              </div>
              <div>
                <Label htmlFor="frequency-penalty" className="text-sm">Frequency Penalty</Label>
                <Input
                  id="frequency-penalty"
                  type="number"
                  value={openaiConfig.props.frequencyPenalty}
                  onChange={(e) => handleNumericParamChange('frequencyPenalty', e)}
                  min="-2"
                  max="2"
                  step="0.1"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Reduces repetition (-2 to 2)
                </p>
              </div>
              <div>
                <Label htmlFor="presence-penalty" className="text-sm">Presence Penalty</Label>
                <Input
                  id="presence-penalty"
                  type="number"
                  value={openaiConfig.props.presencePenalty}
                  onChange={(e) => handleNumericParamChange('presencePenalty', e)}
                  min="-2"
                  max="2"
                  step="0.1"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Encourages new topics (-2 to 2)
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
  
        {/* System and User Messages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">System & User Messages</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addRole}
              className="h-8"
            >
              Add Message
            </Button>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto p-1"> 
            {openaiConfig.props.roles.map((role: any, index: number) => (
              <div key={role.id || index} className="border border-gray-200 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Select 
                    value={role.role} 
                    onValueChange={(value) => handleRoleContentChange(index, 'role', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {openaiConfig.props.roles.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeRole(index)}
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <Textarea
                  value={role.content}
                  onChange={(e) => handleRoleContentChange(index, 'content', e.target.value)}
                  placeholder={`Enter ${role.role} message...`}
                  className="min-h-[80px]"
                />
              </div>
            ))}
          </div>
        </div>
  
        {/* Testing Panel */}
        {/* <div className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h4 className="text-sm font-medium">Test Model</h4>
            <Button variant="outline" size="sm" className="h-8">
              <ZapIcon className="h-3.5 w-3.5 mr-1" />
              Test
            </Button>
          </div>
          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              Verify your OpenAI configuration by running a test request
            </p>
          </div>
        </div> */}
      </div>
    );
  };

  const renderSendGridConfig = () => {
    const [apiKeyError, setApiKeyError] = useState('');
    const [toEmailError, setToEmailError] = useState('');
    const [fromEmailError, setFromEmailError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [contentError, setContentError] = useState('');
    
    const validateEmail = (email:string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
    
    const handleApiKeyChange = (e:any) => {
      const value = e.target.value;
      setSendgridConfig({ 
        ...sendgridConfig, 
        auth: value 
      });
      
      if (!value.trim()) {
        setApiKeyError("API Key is required");
      } else if (!value.startsWith('SG.')) {
        setApiKeyError("Invalid API key format. Should start with 'SG.'");
      } else {
        setApiKeyError("");
      }
    };
    //@ts-ignore
    const handleToEmailChange = (index, value) => {
      const newTo = [...sendgridConfig.props.to];
      newTo[index] = value;
      
      setSendgridConfig({
        ...sendgridConfig,
        props: { ...sendgridConfig.props, to: newTo }
      });
      
      if (!value.trim()) {
        setToEmailError("Recipient email is required");
      } else if (!validateEmail(value)) {
        setToEmailError("Invalid email format");
      } else {
        setToEmailError("");
      }
    };
    
    const handleFromEmailChange = (e:any) => {
      const value = e.target.value;
      setSendgridConfig({ 
        ...sendgridConfig, 
        props: { ...sendgridConfig.props, from: value } 
      });
      
      if (!value.trim()) {
        setFromEmailError("Sender email is required");
      } else if (!validateEmail(value)) {
        setFromEmailError("Invalid email format");
      } else {
        setFromEmailError("");
      }
    };
    
    const handleFromNameChange = (e:any) => {
      const value = e.target.value;
      setSendgridConfig({ 
        ...sendgridConfig, 
        props: { ...sendgridConfig.props, from_name: value } 
      });
    };
    
    const handleSubjectChange = (e:any) => {
      const value = e.target.value;
      setSendgridConfig({ 
        ...sendgridConfig, 
        props: { ...sendgridConfig.props, subject: value } 
      });
      
      if (!value.trim()) {
        setSubjectError("Subject is required");
      } else {
        setSubjectError("");
      }
    };
    //@ts-ignore
    const handleContentTypeChange = (value) => {
      setSendgridConfig({ 
        ...sendgridConfig, 
        props: { ...sendgridConfig.props, content_type: value } 
      });
    };
    //@ts-ignore
    const handleContentChange = (e) => {
      const value = e.target.value;
      setSendgridConfig({ 
        ...sendgridConfig, 
        props: { ...sendgridConfig.props, content: value } 
      });
      
      if (!value.trim()) {
        setContentError("Email content is required");
      } else {
        setContentError("");
      }
    };
    
    const addRecipient = () => {
      setSendgridConfig({
        ...sendgridConfig,
        props: {
          ...sendgridConfig.props,
          to: [...sendgridConfig.props.to, '']
        }
      });
    };
    //@ts-ignore
    const removeRecipient = (index) => {
      if (sendgridConfig.props.to.length > 1) {
        const newTo = [...sendgridConfig.props.to];
        newTo.splice(index, 1);
        
        setSendgridConfig({
          ...sendgridConfig,
          props: { ...sendgridConfig.props, to: newTo }
        });
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <SendIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">SendGrid Email Integration</h4>
              <p className="mt-1 text-xs text-blue-700">
                Connect to SendGrid to send emails automatically as part of your workflow.
                Use this action to send notifications, confirmations, or marketing messages.
              </p>
            </div>
          </div>
        </div>
  
        {/* API Key Input */}
        <div>
          <Label htmlFor="api-key" className="flex items-center font-medium">
            SendGrid API Key <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="api-key"
              value={sendgridConfig.auth}
              onChange={handleApiKeyChange}
              onBlur={handleApiKeyChange}
              placeholder="SG.xxxxxxxxxxxxxxxxxxxx"
              className={`pr-10 font-mono text-sm ${
                apiKeyError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              type="text"
              required
            />
            {/* <span className="text-xs text-gray-400 absolute right-3 top-3">Hide</span> */}
          </div>
          {apiKeyError ? (
            <p className="mt-1.5 text-sm text-red-500">{apiKeyError}</p>
          ) : (
            <div className="flex items-center mt-1.5">
              <LinkIcon className="h-3 w-3 text-muted-foreground mr-1" />
              <a 
                href="https://app.sendgrid.com/settings/api_keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Get your SendGrid API key
              </a>
            </div>
          )}
        </div>
  
        {/* Recipients */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Recipients <span className="text-red-500 ml-1">*</span></Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addRecipient}
              className="h-8"
            >
              Add Recipient
            </Button>
          </div>
          
          <div className="space-y-3">
            {/* @ts-ignore */}
            {sendgridConfig.props.to.map((email, index) => (
              <div key={`recipient-${index}`} className="flex items-center space-x-2">
                <Input
                  placeholder="recipient@example.com"
                  value={email}
                  onChange={(e) => handleToEmailChange(index, e.target.value)}
                  className={toEmailError && index === 0 ? "border-red-300" : ""}
                />
                {sendgridConfig.props.to.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeRecipient(index)}
                    className="h-9 w-9"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {toEmailError && <p className="mt-1 text-sm text-red-500">{toEmailError}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Add one or more email recipients
            </p>
          </div>
        </div>
  
        {/* Sender Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from-email" className="flex items-center font-medium">
              From Email <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="from-email"
              value={sendgridConfig.props.from}
              onChange={handleFromEmailChange}
              onBlur={handleFromEmailChange}
              placeholder="sender@yourcompany.com"
              className={`mt-2 ${fromEmailError ? "border-red-300" : ""}`}
              required
            />
            {fromEmailError && <p className="mt-1.5 text-sm text-red-500">{fromEmailError}</p>}
          </div>
          <div>
            <Label htmlFor="from-name" className="font-medium">
              From Name
            </Label>
            <Input
              id="from-name"
              value={sendgridConfig.props.from_name || ''}
              onChange={handleFromNameChange}
              placeholder="Your Company"
              className="mt-2"
            />
          </div>
        </div>
  
        {/* Email Subject */}
        <div>
          <Label htmlFor="subject" className="flex items-center font-medium">
            Subject <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="subject"
            value={sendgridConfig.props.subject}
            onChange={handleSubjectChange}
            onBlur={handleSubjectChange}
            placeholder="Your email subject"
            className={`mt-2 ${subjectError ? "border-red-300" : ""}`}
            required
          />
          {subjectError && <p className="mt-1.5 text-sm text-red-500">{subjectError}</p>}
          <p className="text-xs text-muted-foreground mt-1.5">
            You can use variables like {"{{"}<span className="font-mono">data.name</span>{"}}"}
          </p>
        </div>
  
        {/* Content Type */}
        <div>
          <Label htmlFor="content-type" className="font-medium">
            Content Type
          </Label>
          <Select 
            value={sendgridConfig.props.content_type || 'text/plain'} 
            onValueChange={handleContentTypeChange}
          >
            <SelectTrigger id="content-type" className="mt-2">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text/plain">Plain Text</SelectItem>
              <SelectItem value="text/html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        {/* Email Content */}
        <div>
          <Label htmlFor="content" className="flex items-center font-medium">
            Email Content <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="content"
            value={sendgridConfig.props.content || ''}
            onChange={handleContentChange}
            onBlur={handleContentChange}
            placeholder={(sendgridConfig.props.content_type || 'text/plain') === 'text/html' 
              ? "<h1>Hello,</h1><p>This is your email content.</p>" 
              : "Hello,\n\nThis is your email content."}
            className={`mt-2 min-h-[150px] font-mono text-sm ${contentError ? "border-red-300" : ""}`}
            required
          />
          {contentError && <p className="mt-1.5 text-sm text-red-500">{contentError}</p>}
          <p className="text-xs text-muted-foreground mt-1.5">
            {(sendgridConfig.props.content_type || 'text/plain') === 'text/html' 
              ? "Enter HTML content. You can use variables like {{data.name}}" 
              : "Enter plain text content. You can use variables like {{data.name}}"}
          </p>
        </div>
  
        {/* Testing Panel */}
        {/* <div className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h4 className="text-sm font-medium">Test Email</h4>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              className="h-8"
            >
              <SendIcon className="h-3.5 w-3.5 mr-1" />
              Send Test
            </Button>
          </div>
          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              Send a test email to verify your SendGrid configuration
            </p>
          </div>
        </div> */}
      </div>
    );
  }

  const renderSlackConfig = () => {
    const [tokenError, setTokenError] = useState("");
    const [textError, setTextError] = useState("");
    const [blocksError, setBlocksError] = useState("");
    //@ts-ignore
    const handleTokenChange = (e) => {
      const value = e.target.value;
      setSlackConfig({ 
        ...slackConfig, 
        auth: { ...slackConfig.auth, access_token: value } 
      });
      
      if (!value.trim()) {
        setTokenError("Access Token is required");
      } else if (!value.startsWith('xoxp-')) {
        setTokenError("Invalid token format. Should start with 'xoxp-'");
      } else {
        setTokenError("");
      }
    };
    //@ts-ignore
    const handleTextChange = (e) => {
      const value = e.target.value;
      setSlackConfig({ 
        ...slackConfig, 
        props: { ...slackConfig.props, text: value } 
      });
      
      if (!value.trim() && (!slackConfig.props.blocks || slackConfig.props.blocks.length === 0)) {
        setTextError("Either message text or blocks are required");
      } else {
        setTextError("");
      }
    };
    //@ts-ignore
    const handleUserIdChange = (e) => {
      const value = e.target.value;
      setSlackConfig({ 
        ...slackConfig, 
        props: { ...slackConfig.props, userId: value } 
      });
    };
    //@ts-ignore
    const handleUsernameChange = (e) => {
      const value = e.target.value;
      setSlackConfig({ 
        ...slackConfig, 
        props: { ...slackConfig.props, username: value } 
      });
    };
    //@ts-ignore
    const handleProfilePictureChange = (e) => {
      const value = e.target.value;
      setSlackConfig({ 
        ...slackConfig, 
        props: { ...slackConfig.props, profilePicture: value } 
      });
    };
    //@ts-ignore
    const handleBlocksChange = (e) => {
      try {
        const blocks = JSON.parse(e.target.value);
        setSlackConfig({ 
          ...slackConfig, 
          props: { ...slackConfig.props, blocks } 
        });
        setBlocksError("");
      } catch (error) {
        setBlocksError("Invalid JSON format");
      }
    };
  
    // Format blocks as pretty JSON string for display
    const blocksJson = JSON.stringify(slackConfig.props.blocks || [], null, 2);
  
    return (
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <MessageSquareIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Slack Integration</h4>
              <p className="mt-1 text-xs text-blue-700">
                Connect your Slack workspace to send messages, notifications, or updates to channels or users.
                Configure the message content, blocks, and appearance below.
              </p>
            </div>
          </div>
        </div>
  
        {/* Access Token Input */}
        <div>
          <Label htmlFor="access-token" className="flex items-center font-medium">
            Access Token <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="access-token"
              value={slackConfig.auth.access_token}
              onChange={handleTokenChange}
              onBlur={handleTokenChange}
              placeholder="Enter your Slack access token"
              className={`pr-10 font-mono text-sm ${
                tokenError ? "border-red-300 focus:ring-red-500" : ""
              }`}
              type="text"
              required
            />
          </div>
          {tokenError ? (
            <p className="mt-1.5 text-sm text-red-500">{tokenError}</p>
          ) : (
            <div className="flex items-center mt-1.5">
              <LinkIcon className="h-3 w-3 text-muted-foreground mr-1" />
              <a 
                href="https://api.slack.com/authentication/token-types" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                How to create a Slack access token
              </a>
            </div>
          )}
        </div>
  
        {/* Basic Message Configuration */}
        <div>
          <Label htmlFor="message-text" className="flex items-center font-medium">
            Message Text
          </Label>
          <Input
            id="message-text"
            value={slackConfig.props.text}
            onChange={handleTextChange}
            placeholder="Enter message text"
            className={`mt-2 ${
              textError ? "border-red-300 focus:ring-red-500" : ""
            }`}
          />
          {textError && <p className="mt-1.5 text-sm text-red-500">{textError}</p>}
          <p className="text-xs text-muted-foreground mt-1">
            Simple text message. For advanced formatting, use Blocks below.
          </p>
        </div>
  
        {/* User ID */}
        <div>
          <Label htmlFor="user-id" className="font-medium">
            User ID
          </Label>
          <Input
            id="user-id"
            value={slackConfig.props.userId}
            onChange={handleUserIdChange}
            placeholder="e.g. U08PJ34LSPK"
            className="mt-2 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to send to a channel instead of direct message
          </p>
        </div>
  
        {/* Username and Profile Picture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username" className="font-medium">
              Bot Username
            </Label>
            <Input
              id="username"
              value={slackConfig.props.username}
              onChange={handleUsernameChange}
              placeholder="Custom bot name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="profile-picture" className="font-medium">
              Profile Picture URL
            </Label>
            <Input
              id="profile-picture"
              value={slackConfig.props.profilePicture}
              onChange={handleProfilePictureChange}
              placeholder="URL to profile image"
              className="mt-2"
            />
          </div>
        </div>
        
        {/* Blocks Editor */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="blocks" className="font-medium">Message Blocks</Label>
          </div>
          <div className="relative">
            <Textarea
              id="blocks"
              value={blocksJson}
              onChange={handleBlocksChange}
              placeholder='[{"type": "section", "text": {"type": "mrkdwn", "text": "Hello world"}}]'
              className={`font-mono text-sm h-64 ${
                blocksError ? "border-red-300 focus:ring-red-500" : ""
              }`}
            />
          </div>
          {blocksError ? (
            <p className="mt-1.5 text-sm text-red-500">{blocksError}</p>
          ) : (
            <div className="flex items-center mt-1.5">
              <LinkIcon className="h-3 w-3 text-muted-foreground mr-1" />
              <a 
                href="https://api.slack.com/block-kit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Slack Block Kit documentation
              </a>
            </div>
          )}
        </div>
  
        {/* Testing Panel */}
        {/* <div className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h4 className="text-sm font-medium">Test Connection</h4>
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCcwIcon className="h-3.5 w-3.5 mr-1" />
              Test
            </Button>
          </div>
          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              Verify your Slack connection and message configuration before saving
            </p>
          </div>
        </div> */}
      </div>
    );
  };

  const renderConfig = () => {
    switch (type) {
      case 'webhook':
        return renderWebhookConfig();
      case 'airtable':
        return renderAirtableConfig();
      case 'googleSheets':
          return renderGoogleSheetsConfig();
      case 'openai':
          return renderOpenAIConfig();
      case 'sendgrid':
        return renderSendGridConfig();
      case 'slack':
        return renderSlackConfig();
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'webhook':
        return 'Configure Webhook Trigger';
      case 'airtable':
        return 'Configure Airtable Action';
      case 'googleSheets':
        return 'Configure Google Sheets Action';
      case 'openai':
        return 'Configure OpenAI Action';
      case 'sendgrid':
        return 'Configure SendGrid Email';
      case 'slack':
        return 'Configure Slack Message'
      default:
        return 'Configure';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'webhook':
        return <GlobeIcon className="h-5 w-5 text-primary" />;
      case 'airtable':
        return <TableIcon className="h-5 w-5 text-primary" />;
      case 'googleSheets':
          return <TableIcon className="h-5 w-5 text-green-500" />;
      case 'openai':
        return <Brain className="h-5 w-5 text-purple-600" />;
      case 'sendgrid':
        return <SendIcon className="h-5 w-5 text-blue-500" />;
      case 'slack':
        return <SendIcon className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md p-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header with icon */}
          <SheetHeader className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <SheetTitle>{getTitle()}</SheetTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your {getTitle().toLowerCase()} settings below
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
                
                {type === 'webhook' ? (
                  <Button 
                    onClick={handleSave}
                    className="relative"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};