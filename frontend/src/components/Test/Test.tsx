'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TableIcon, RefreshCcwIcon, X, CheckIcon } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define types for our Google Sheets config
type SpreadsheetInfo = {
  id: string;
  name: string;
};

type SheetInfo = {
  id: string;
  title: string;
};

type GoogleSheetsConfigType = {
  auth: {
    access_token: string;
    refresh_token?: string;
    expiry_date?: number;
  };
  props: {
    spreadsheetId: string;
    sheetId: string;
    includeTeamDrives: boolean;
    as_string: boolean;
    first_row_headers: boolean;
    values: Record<string, string>;
  };
};

const GoogleSheetsConfig = () => {
  // State for Google Sheets configuration
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<GoogleSheetsConfigType>({
    auth: {
      access_token: '',
    },
    props: {
      spreadsheetId: '',
      sheetId: '',
      includeTeamDrives: false,
      as_string: true,
      first_row_headers: true,
      values: {
        'Name': '',
        'Email': '',
      }
    }
  });

  // States for available spreadsheets and sheets
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSpreadsheets, setAvailableSpreadsheets] = useState<SpreadsheetInfo[]>([]);
  const [availableSheets, setAvailableSheets] = useState<SheetInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Handle OAuth authentication
  const initiateOAuth = () => {
    // Google OAuth parameters
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const scope = encodeURIComponent('https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    // Store current state/page in localStorage if needed for continuation after auth
    localStorage.setItem('return_to', window.location.pathname);
    
    // Redirect to Google auth page
    window.location.href = authUrl;
  };

  // Fetch available spreadsheets using the access token
  const fetchAvailableSpreadsheets = async () => {
    if (!googleSheetsConfig.auth.access_token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"', {
        headers: {
          'Authorization': `Bearer ${googleSheetsConfig.auth.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch spreadsheets');
      }
      
      const data = await response.json();
      setAvailableSpreadsheets(data.files.map((file: any) => ({
        id: file.id,
        name: file.name
      })));
      
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch spreadsheets');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available sheets for the selected spreadsheet
  const fetchAvailableSheets = async (spreadsheetId: string) => {
    if (!googleSheetsConfig.auth.access_token || !spreadsheetId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: {
          'Authorization': `Bearer ${googleSheetsConfig.auth.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sheets');
      }
      
      const data = await response.json();
      setAvailableSheets(data.sheets.map((sheet: any) => ({
        id: sheet.properties.sheetId.toString(),
        title: sheet.properties.title
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sheets');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch spreadsheets when access token changes
  useEffect(() => {
    if (googleSheetsConfig.auth.access_token) {
      fetchAvailableSpreadsheets();
    }
  }, [googleSheetsConfig.auth.access_token]);

  // Effect to fetch sheets when spreadsheetId changes
  useEffect(() => {
    if (googleSheetsConfig.props.spreadsheetId) {
      fetchAvailableSheets(googleSheetsConfig.props.spreadsheetId);
    } else {
      setAvailableSheets([]);
    }
  }, [googleSheetsConfig.props.spreadsheetId]);

  // Check for access token in URL or localStorage on component mount
  useEffect(() => {
    // This assumes your OAuth callback handler stores the token
    const token = localStorage.getItem('google_access_token');
    
    if (token) {
      setGoogleSheetsConfig(prevConfig => ({
        ...prevConfig,
        auth: { 
          ...prevConfig.auth,
          access_token: token 
        }
      }));
    }
  }, []);

  // Handle spreadsheet selection
  const handleSpreadsheetChange = (value: string) => {
    setGoogleSheetsConfig({
      ...googleSheetsConfig,
      props: { 
        ...googleSheetsConfig.props, 
        spreadsheetId: value,
        sheetId: '' // Reset sheet selection when spreadsheet changes
      }
    });
  };

  // Handle sheet selection
  const handleSheetChange = (value: string) => {
    setGoogleSheetsConfig({
      ...googleSheetsConfig,
      props: { ...googleSheetsConfig.props, sheetId: value }
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setGoogleSheetsConfig({
      ...googleSheetsConfig,
      props: { ...googleSheetsConfig.props, [field]: checked }
    });
  };

  // Handle column value changes
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

  // Add a new column value
  const addValue = () => {
    const newKey = `Column_${Object.keys(googleSheetsConfig.props.values).length + 1}`;
    setGoogleSheetsConfig({
      ...googleSheetsConfig,
      props: {
        ...googleSheetsConfig.props,
        values: {
          ...googleSheetsConfig.props.values,
          [newKey]: ''
        }
      }
    });
  };

  // Remove a column value
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

  // Test the connection to Google Sheets
  const testConnection = async () => {
    if (!googleSheetsConfig.auth.access_token || !googleSheetsConfig.props.spreadsheetId || !googleSheetsConfig.props.sheetId) {
      setError('Please complete all required fields');
      return;
    }
    
    setTestStatus('loading');
    setError(null);
    
    try {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsConfig.props.spreadsheetId}/values/${googleSheetsConfig.props.sheetId}?valueRenderOption=FORMATTED_VALUE`, {
        headers: {
          'Authorization': `Bearer ${googleSheetsConfig.auth.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Connection test failed');
      }
      
      setTestStatus('success');
    } catch (err) {
      setTestStatus('error');
      setError(err instanceof Error ? err.message : 'Connection test failed');
    } finally {
      // Reset test status after 3 seconds
      setTimeout(() => setTestStatus('idle'), 3000);
    }
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

      {/* Authentication Section */}
      <div>
        <Label className="flex items-center font-medium mb-2">
          Authentication <span className="text-red-500 ml-1">*</span>
        </Label>
        
        {!isAuthenticated ? (
          <Button 
            onClick={initiateOAuth}
            className="flex items-center"
            type="button"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"/>
            </svg>
            Connect to Google Sheets
          </Button>
        ) : (
          <div className="flex items-center space-x-2 text-sm">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span className="text-green-700">Connected to Google Sheets</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                localStorage.removeItem('google_access_token');
                setGoogleSheetsConfig({...googleSheetsConfig, auth: {access_token: ''}});
                setIsAuthenticated(false);
              }}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isAuthenticated && (
        <>
          {/* Spreadsheet Selection */}
          <div>
            <Label htmlFor="spreadsheet-select" className="flex items-center font-medium">
              Select Spreadsheet <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="mt-2">
              <Select 
                onValueChange={handleSpreadsheetChange} 
                value={googleSheetsConfig.props.spreadsheetId}
              >
                <SelectTrigger id="spreadsheet-select" className="w-full">
                  <SelectValue placeholder="Select a spreadsheet" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpreadsheets.map(spreadsheet => (
                    <SelectItem key={spreadsheet.id} value={spreadsheet.id}>
                      {spreadsheet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sheet Selection */}
          {googleSheetsConfig.props.spreadsheetId && (
            <div>
              <Label htmlFor="sheet-select" className="flex items-center font-medium">
                Select Sheet <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="mt-2">
                <Select 
                  onValueChange={handleSheetChange} 
                  value={googleSheetsConfig.props.sheetId}
                >
                  <SelectTrigger id="sheet-select" className="w-full">
                    <SelectValue placeholder="Select a sheet" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSheets.map(sheet => (
                      <SelectItem key={sheet.id} value={sheet.id}>
                        {sheet.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Options */}
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
          
          {/* Column Values */}
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
                  <Input
                    placeholder="Column Name"
                    value={key}
                    className="flex-1"
                    readOnly
                  />
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
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h4 className="text-sm font-medium">Test Connection</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={testConnection}
                disabled={testStatus === 'loading'}
              >
                {testStatus === 'loading' ? (
                  <span className="flex items-center">
                    <RefreshCcwIcon className="h-3.5 w-3.5 mr-1 animate-spin" />
                    Testing...
                  </span>
                ) : testStatus === 'success' ? (
                  <span className="flex items-center text-green-600">
                    <CheckIcon className="h-3.5 w-3.5 mr-1" />
                    Success
                  </span>
                ) : (
                  <span className="flex items-center">
                    <RefreshCcwIcon className="h-3.5 w-3.5 mr-1" />
                    Test
                  </span>
                )}
              </Button>
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground">
                Verify your Google Sheets connection before saving the configuration
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleSheetsConfig;