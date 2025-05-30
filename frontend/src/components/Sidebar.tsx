'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Mail, GitBranch, Database, Settings, HelpCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: number;
  active?: boolean;
};

const SidebarItem = ({ icon: Icon, label, to, badge, active }: SidebarItemProps) => {
  return (
    <Link
      href={to}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {badge !== undefined && (
        <span className="ml-auto bg-studio-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

type SidebarSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SidebarSection = ({ title, children }: SidebarSectionProps) => {
  return (
    <div className="py-2">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export const Sidebar = () => {
  const currentPath = usePathname()

  return (
    <div className="w-64 h-screen bg-sidebar flex flex-col border-r">
      <div className="p-5 border-b mt-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-black text-white p-1 rounded">
            <GitBranch className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">StudioFlow</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <SidebarSection title="Automation">
          <SidebarItem
            icon={GitBranch}
            label="Flows"
            to="/flows"
            active={currentPath === '/flows' || currentPath.startsWith('/flow/flows')}
          />
          <SidebarItem
            icon={Mail}
            label="Runs"
            to="/flows/runs"
            active={currentPath === '/flows/runs'}
          />
          {/* <SidebarItem
            icon={Database}
            label="Connections"
            to="/flows/connections"
            active={currentPath === '/flows/connections'}
          /> */}
        </SidebarSection>

        {/* <SidebarSection title="Project">
          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/flows/settings"
            active={currentPath === '/flows/settings'}
          />
        </SidebarSection> */}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 text-sm text-sidebar-foreground">
          <HelpCircle className="h-4 w-4" />
          <span>Help & Resources</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-sidebar-foreground mt-2">
          <MessageSquare className="h-4 w-4" />
          <span>Send Feedback</span>
        </div>
      </div>
    </div>
  );
};
