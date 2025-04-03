
import React from 'react';
import Link from 'next/link';
import { PlusCircle, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ConnectionCard = ({ 
  name, 
  description, 
  icon, 
  connected 
}: { 
  name: string; 
  description: string; 
  icon: React.ReactNode;
  connected: boolean;
}) => {
  const handleConnect = () => {
    toast.success(`${name} connected successfully!`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100">
          {icon}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {connected ? (
            <div className="text-sm flex items-center text-green-600 gap-1">
              <Check className="h-4 w-4" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="text-sm flex items-center text-amber-600 gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Not connected</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={connected ? "outline" : "default"}>
              {connected ? "Reconfigure" : "Connect"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect {name}</DialogTitle>
              <DialogDescription>
                Enter your API key to connect your {name} account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder={`Enter your ${name} API key`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleConnect}>
                Connect Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const Connections = () => {
  const connections = [
    {
      name: 'Mailchimp',
      description: 'Email marketing platform',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      connected: true,
    },
    {
      name: 'SendGrid',
      description: 'Email service provider',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M22 5L11 5M9 5L2 5M22 12L11 12M9 12L2 12M22 19L11 19M9 19L2 19M12 3V7M12 10V14M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      connected: false,
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Connections</h1>
        <Button asChild>
          <Link href="#" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Connection
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.name}
            name={connection.name}
            description={connection.description}
            icon={connection.icon}
            connected={connection.connected}
          />
        ))}
      </div>
    </div>
  );
};

export default Connections;
